terraform {
  required_version = ">=1.9.5"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket = "vehicle-service-state"
    region = "us-east-2"
    key    = "terraform/vehicle-service.tfstate"
  }
}

provider "aws" {
  region = "us-east-2"
}

module "vehicle_service_api_container_regitry" {
  source = "./modules/ecr"
  name   = "vehicle_service_api"
}

module "dynamodb_accounts_table" {
  source                  = "./modules/dynamodb"
  name                    = "accounts"
  hash_key_attribute_name = "id"
  hash_key_attribute_type = "S"
  global_secondary_indexes = [{
    attribute_name  = "email"
    attribute_type  = "S"
    index_name      = "email_idx"
    projection_type = "ALL"
  }]
}

module "dynamodb_vehicles_table" {
  source                   = "./modules/dynamodb"
  name                     = "vehicles"
  hash_key_attribute_name  = "id"
  hash_key_attribute_type  = "S"
  global_secondary_indexes = []
}

module "vehicle_service_lambda" {
  source             = "./modules/lambda"
  function_name      = "vehicle_service_api"
  function_timeout   = 10
  function_image_uri = var.default_docker_lambda_image_uri
  function_environment_variables = {
    JWT_SECRET_KEY = ""
    LOG_LEVEL      = "info"
    AWS_DYNAMO_DB_REGION = "us-east-2"
  }
}

resource "aws_iam_policy" "vehicle_service_lambda_dynamodb_policy" {
  name = "vehicle_service_lambda_dynamodb_policy"
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "dynamodb:PutItem",
          "dynamodb:GetItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:Scan",
          "dynamodb:Query",
        ]
        Resource = [
          module.dynamodb_accounts_table.table_arn,
          module.dynamodb_vehicles_table.table_arn,
          "${module.dynamodb_accounts_table.table_arn}/index/*",
          "${module.dynamodb_vehicles_table.table_arn}/index/*",
        ]
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_dynamo_policy_attachment" {
  role       = module.vehicle_service_lambda.lambda_role_name
  policy_arn = aws_iam_policy.vehicle_service_lambda_dynamodb_policy.arn
}

module "vehicle_service_api_gateway" {
  source = "./modules/api_gateway"

  name          = "VehicleServiceLambdaAPI"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_integration" "vehicle_service_lambda_gateway_integration" {
  api_id             = module.vehicle_service_api_gateway.api_gateway_id
  integration_type   = "AWS_PROXY"
  connection_type    = "INTERNET"
  integration_uri    = module.vehicle_service_lambda.lambda_invoke_arn
  integration_method = "POST"
}

resource "aws_apigatewayv2_route" "vehicle_service_lambda_gateway_api_route" {
  api_id    = module.vehicle_service_api_gateway.api_gateway_id
  route_key = "ANY /{proxy+}" 
  target    = "integrations/${aws_apigatewayv2_integration.vehicle_service_lambda_gateway_integration.id}"
}

resource "aws_lambda_permission" "lambda_permission" {
  action        = "lambda:InvokeFunction"
  function_name = "vehicle_service_api"
  principal     = "apigateway.amazonaws.com"

  source_arn = "${module.vehicle_service_api_gateway.api_gateway_execution_arn}/*"
}