resource "aws_apigatewayv2_api" "api_gateway" {
  name          = var.name
  protocol_type = var.protocol_type
}

resource "aws_apigatewayv2_stage" "lambda_stage" {
  api_id      = aws_apigatewayv2_api.api_gateway.id
  name        = "$default"
  auto_deploy = true
}

output "api_gateway_id" {
  value = aws_apigatewayv2_api.api_gateway.id  
}

output "api_gateway_url" {
  value = aws_apigatewayv2_api.api_gateway.api_endpoint
}

output "api_gateway_execution_arn" {
  value = aws_apigatewayv2_api.api_gateway.execution_arn
}

