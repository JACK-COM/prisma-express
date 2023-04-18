resource "aws_security_group" "mf-api-sg" {
  name        = "mf-api"
  description = "Mythos Forge API Security Group"
  vpc_id      = data.aws_vpc.default.id

  // To Allow SSH Transport
  ingress {
    from_port   = 22
    protocol    = "tcp"
    to_port     = 22
    cidr_blocks = ["0.0.0.0/0"]
  }

  // To Allow Port 80 Transport
  ingress {
    from_port   = 80
    protocol    = "tcp"
    to_port     = 80
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_instance" "mf-api-instance" {
  ami                    = var.resource_settings.api.ami_id
  instance_type          = var.resource_settings.api.instance_type
  subnet_id              = var.subnet_id_1
  key_name               = var.mf_ec2
  vpc_security_group_ids = [aws_security_group.mf-api-sg.id]
  depends_on             = [aws_security_group.mf-api-sg]

  provisioner "file" {
    source      = "../api"
    destination = "/home/ec2-user"

    connection {
      type        = "ssh"
      host        = aws_instance.mf-api-instance.public_ip
      user        = "ec2-user"
      private_key = file("~/.ssh/mf_api")
      insecure    = true
    }
  }
}


