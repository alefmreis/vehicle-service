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
  name = "vehicle_service_api"
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
  source = "./modules/lambda"
  function_name    = "vehicle_service_api"
  function_timeout = 10
  function_image_uri = module.vehicle_service_api_container_regitry.ecr_repository_url
  function_environment_variables = {
    JWT_SECRET_KEY = ""
    LOG_LEVEL = "info"
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




