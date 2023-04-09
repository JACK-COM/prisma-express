resource "aws_eip" "mf_web_eip" {
  count    = var.resource_settings.web_app.count
  instance = aws_instance.mf_web[count.index].id
  vpc      = true

  tags = {
    Name = "tutorial_web_eip_${count.index}"
  }
}