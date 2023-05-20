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

data "aws_route53_zone" "zone" {
  name = "mythosforge.app"
}

resource "aws_route53_record" "www" {
  zone_id = data.aws_route53_zone.zone.zone_id
  name    = "www.mythosforge.app"
  type    = "A"
  alias {
    name                   = aws_cloudfront_distribution.www_s3_distribution.domain_name
    zone_id                = aws_cloudfront_distribution.www_s3_distribution.hosted_zone_id
    evaluate_target_health = false
  }

  depends_on = [
    aws_cloudfront_distribution.www_s3_distribution
  ]
}

resource "aws_route53_record" "non-www" {
  zone_id = data.aws_route53_zone.zone.zone_id
  name    = "mythosforge.app"
  type    = "A"
  alias {
    name                   = aws_cloudfront_distribution.www_s3_distribution.domain_name
    zone_id                = aws_cloudfront_distribution.www_s3_distribution.hosted_zone_id
    evaluate_target_health = false
  }

  depends_on = [
    aws_cloudfront_distribution.www_s3_distribution
  ]
}

resource "aws_route53_record" "api" {
  zone_id = data.aws_route53_zone.zone.zone_id
  name    = "api.mythosforge.app"
  type    = "A"
  ttl     = 300
  records = [aws_instance.mf-api-instance.public_ip]

  depends_on = [
    aws_instance.mf-api-instance
  ]
}