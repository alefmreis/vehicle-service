variable "function_name" {
  description = "Lambda function name"
  type        = string
}

variable "function_timeout" {
  description = "Lambda function timeout"
  type        = number
  default     = 10
}

variable "function_image_uri" {
  description = "Lambda function image uri"
  type        = string
}

variable "function_environment_variables" {
  description = "Lambda function environment variables"
  type = object({
    JWT_SECRET_KEY = string
    LOG_LEVEL      = string
    AWS_DYNAMO_DB_REGION = string
  })
  default = {
    JWT_SECRET_KEY = ""
    LOG_LEVEL      = "info"
    AWS_DYNAMO_DB_REGION = "us-east-2"
  }
}





