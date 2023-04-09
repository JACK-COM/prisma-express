variable "aws_region" {
  default = "us-east-1"
}

variable "vpc_cidr_block" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidr_blocks" {
  description = "Available CIDR blocks for public subnets"
  type        = list(string)
  default = [
    "10.0.1.0/24",
    "10.0.2.0/24",
    "10.0.3.0/24",
    "10.0.4.0/24"
  ]
}

variable "private_subnet_cidr_blocks" {
  description = "Available CIDR blocks for private subnets"
  type        = list(string)
  default = [
    "10.0.101.0/24",
    "10.0.102.0/24",
    "10.0.103.0/24",
    "10.0.104.0/24",
  ]
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
      db_name             = "mythos_forge"    // database name
      skip_final_snapshot = true
    },
    "web_app" = {
      count         = 1          // the number of EC2 instances
      instance_type = "t2.micro" // the EC2 instance
      ami_id = "ami-007855ac798b5175e" // the AMI ID
    }
  }
}

variable "mf_ec2" {
  description = "ssh key for ec2 instances"
  type        = string
  sensitive   = true
}

variable "db_username" {
  description = "Database master user"
  type        = string
  sensitive   = true
}

// This variable contains the database master password
// We will be storing this in a secrets file
variable "db_password" {
  description = "Database master user password"
  type        = string
  sensitive   = true
}

variable "db_port"{
    description = "Database port"
    type        = number
    default     = 5432
}