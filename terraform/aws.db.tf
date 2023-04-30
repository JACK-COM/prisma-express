resource "aws_security_group" "db_security_group_main" {
   name        = "db security group main"
  description = "PostgreSQL security group"
  vpc_id      = "${data.aws_vpc.default.id}"

  # ingress
  ingress {
      from_port   = 5432
      to_port     = 5432
      protocol    = "tcp"
      description = "PostgreSQL access from within VPC"
      cidr_blocks = ["${data.aws_vpc.default.cidr_block}"]
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
  vpc_security_group_ids = [aws_security_group.db_security_group_main.id]
  skip_final_snapshot = var.resource_settings.database.skip_final_snapshot
}
