data "aws_vpc" "default" {
  default = true
}

resource "aws_security_group" "mythos_forge" {
  vpc_id      = data.aws_vpc.default.id
  name        = "mythos_forge"
  description = "DB_Security_Group"
  ingress {
    from_port   = var.db_port
    to_port     = var.db_port
    protocol    = "tcp"
    cidr_blocks = var.private_subnet_cidr_blocks
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = var.public_subnet_cidr_blocks
  }
}

resource "aws_db_instance" "mf_database" {
  allocated_storage   = var.resource_settings.database.allocated_storage
  engine              = var.resource_settings.database.engine
  engine_version      = var.resource_settings.database.engine_version
  instance_class      = var.resource_settings.database.instance_class
  db_name             = var.resource_settings.database.db_name
  username            = var.db_username
  password            = var.db_password
  skip_final_snapshot = var.resource_settings.database.skip_final_snapshot
}
