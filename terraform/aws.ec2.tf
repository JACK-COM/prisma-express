resource "aws_instance" "mf_web" {
  count                  = var.resource_settings.web_app.count
  ami                    = var.resource_settings.web_app.ami_id
  instance_type          = var.resource_settings.web_app.instance_type
  key_name               = aws_key_pair.mf_pair.key_name
  vpc_security_group_ids = [aws_security_group.mf_web.id]
  tags = {
    Name = "mf_web_${count.index}"
  }
}
