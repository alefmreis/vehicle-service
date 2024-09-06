resource "aws_iam_role" "lambda_role" {
  name = "${var.function_name}_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_lambda_function" "lambda_function" {

  lifecycle {
    ignore_changes = [image_uri]
  }

  function_name = var.function_name
  role          = aws_iam_role.lambda_role.arn
  timeout       = var.function_timeout
  package_type  = "Image"
  image_uri     = "${var.function_image_uri}:latest"

  environment {
    variables = var.function_environment_variables
  }
}


output "lambda_role_name" {
  value = aws_iam_role.lambda_role.name
}
