data "aws_vpc" "default" {
  default = true
}

resource "aws_security_group" "mf_db" {
  vpc_id      = data.aws_vpc.default.id
  name        = "mf_db"
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

resource "aws_security_group" "mf_web" {
  name        = "mf_web"
  description = "Security group for web servers"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    description = "Allow all traffic through HTTP"
    from_port   = "80"
    to_port     = "80"
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "Allow all outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  tags = {
    Name = "mf_web"
  }
}