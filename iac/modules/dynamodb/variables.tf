# INPUT
variable "name" {
  description = "DynamoDB table name"
  type        = string
}

variable "hash_key_attribute_name" {
  description = "DynamoDB table hash key attribute name"
  type        = string
}

variable "hash_key_attribute_type" {
  description = "DynamoDB table hash key attribute type"
  type        = string
  default     = "S"
}

variable "billing_mode" {
  description = "DynamoDB table billing mode"
  type        = string
  default     = "PAY_PER_REQUEST"
}

variable "global_secondary_indexes" {
  type = list(object({
    attribute_name = string
    attribute_type = string
    index_name     = string
    projection_type = string
  }))
  default = []
}