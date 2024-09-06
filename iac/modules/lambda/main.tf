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
  image_uri     = var.function_image_uri

  environment {
    variables = var.function_environment_variables
  }
}

resource "aws_iam_policy_attachment" "lambda_function_policy_attachment" {
  name       = "${var.function_name}_basic_policy_attachment"
  roles      = [aws_iam_role.lambda_role.name]
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}


output "lambda_role_name" {
  value = aws_iam_role.lambda_role.name
}

output "lambda_invoke_arn" {
  value = aws_lambda_function.lambda_function.invoke_arn
}
