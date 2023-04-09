resource "aws_key_pair" "mf_pair" {
  key_name   = "mf_ec2"
  public_key = var.mf_ec2
}