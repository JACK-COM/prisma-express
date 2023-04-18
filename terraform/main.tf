terraform {
 required_providers {
   aws = {
     source  = "hashicorp/aws"
     version = "~> 4.19.0"
   }
 }
}

provider "aws" {
  region = var.aws_region
}

data "aws_vpc" "default" {
  default = true
}

data "aws_acm_certificate" "amazon_issued" {
  domain      = "mythosforge.app"
  types       = ["AMAZON_ISSUED"]
  most_recent = true
}