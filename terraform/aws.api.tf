resource "random_string" "jwt_secret" {
  length  = 25
  special = false
  upper   = true
}

resource "random_string" "encrypt_secret" {
  length  = 25
  special = false
  upper   = true
}

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
  vpc_security_group_ids = [aws_security_group.mf-api-sg.id]
  depends_on             = [aws_security_group.mf-api-sg, aws_db_instance.mf_database]


  connection {
    type        = "ssh"
    host        = aws_instance.mf-api-instance.public_ip
    user        = "ubuntu"
    private_key = file("~/.ssh/MF_Main.cer")
    insecure    = true
  }

  provisioner "remote-exec" {
    inline = [
      "sudo chown o+w mythosforge/",
      "sudo apt-get update -y",
      "sudo npm install -g http-server"
    ]
  }

  provisioner "file" {
    source      = "../api/lib/"
    destination = "/home/ubuntu/mythosforge/"
  }

  provisioner "remote-exec" {
    inline = [
      "sudo npm install pm2@latest -g",
      "cd /home/ubuntu/mythosforge/",
      "sudo touch .env",
      "sudo chmod u+w .env",
      "sudo echo 'PORT=4001' >> .env",
      "sudo echo 'DB_URL=postgres://${var.db_username}:${var.db_password}@${aws_db_instance.mf_database.address}' >> .env",
      "sudo echo 'JWT_SEC=${random_string.jwt_secret.result}' >> .env",
      "sudo echo 'ENCRYPT=${random_string.encrypt_secret.result}' >> .env",
      "sudo echo 'GOOGLE_CLIENT_ID=${var.GOOGLE_CLIENT_ID}' >> .env",
      "sudo echo 'GOOGLE_CLIENT_SK=${var.GOOGLE_CLIENT_SK}' >> .env",
      "sudo npm install",
      "sudo npm run prisma-sync",
      "sudo pm2 start server.js --name mythosforge-api",
    ]
  }
}

