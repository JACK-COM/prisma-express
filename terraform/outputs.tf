output "database_endpoint" {
  description = "The endpoint of the database"
  value       = aws_db_instance.mf_database.address
}

output "database_port" {
  description = "The port of the database"
  value       = aws_db_instance.mf_database.port
}

output "Instance_IP" {
  description = "The IP address of the instance"
  value       = aws_instance.mf-api-instance.public_ip
}