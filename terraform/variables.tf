variable "aws_region" {
  default = "us-east-1"
}

variable "resource_settings" {
  description = "Configuration settings"
  type        = map(any)
  default = {
    "database" = {
      allocated_storage   = 5            // storage in gigabytes
      engine              = "postgres"       // engine type
      engine_version      = "12"      // engine version
      instance_class      = "db.t2.micro" // rds instance type
      db_name             = "mythos_forge_main"    // database name
      skip_final_snapshot = true
    },

    "api" = {
      count         = 1          // the number of EC2 instances
      instance_type = "t2.small" // the EC2 instance
      ami_id = "ami-0661baf9111044522" // the AMI ID
    }
  }
}

variable "bucket_name" {}
variable "domain_name" {}
variable "domain_name_www" {}
variable "common_tags" {
  description = "Common tags to be applied to all resources"
  type        = map(any)
  default = {
    "Owner"       = "Mythos Forge"
    "Project" = "mythosforge.app"
    "Environment" = "Production"
  }
}
variable "subnet_id_1" {
  description = "subnet id 1"
  default = "subnet-0de6dc771b9484008"
  type        = string
}

variable "subnet_id_2" {
  description = "subnet id 2"
  default = "subnet-0f1c947166152770c"
  type        = string
}

variable "ssh_key" {
  description = "ssh key for ec2 instances"
  type        = string
  sensitive   = true
}

variable "db_username" {
  description = "Database master user"
  type        = string
  sensitive   = false
}

variable "db_password" {
  description = "Database master user password"
  type        = string
  sensitive   = false
}

variable "db_port"{
    description = "Database port"
    type        = number
    default     = 5432
}

variable "GOOGLE_CLIENT_ID" {
  description = "Google Client ID"
  type        = string
  sensitive   = false
}

variable "GOOGLE_CLIENT_SK" {
  description = "Google Client Secret Key"
  type        = string
  sensitive   = false
}