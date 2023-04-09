terraform {
  backend "s3" {
    bucket = "mf-tf"
    key    = "./terraform.tfstate"
    region = "us-east-1"
  }
}