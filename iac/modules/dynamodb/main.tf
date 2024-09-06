resource "aws_dynamodb_table" "dynamodb_table" {
  name         = var.name
  billing_mode = var.billing_mode
  hash_key     = var.hash_key_attribute_name

  attribute {
    name = var.hash_key_attribute_name
    type = var.hash_key_attribute_type
  }

  dynamic "attribute" {
    for_each = var.global_secondary_indexes
    content {
      name = attribute.value.attribute_name
      type = attribute.value.attribute_type
    }
  }

  dynamic "global_secondary_index" {
    for_each = var.global_secondary_indexes
    content {
      name            = global_secondary_index.value.index_name
      hash_key        = global_secondary_index.value.attribute_name
      projection_type = global_secondary_index.value.projection_type
    }
  }
}

output "table_arn" {
  value = aws_dynamodb_table.dynamodb_table.arn
}
