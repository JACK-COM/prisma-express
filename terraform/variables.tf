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

    "web_app" = {
      count         = 1          // the number of EC2 instances
      instance_type = "t2.micro" // the EC2 instance
      ami_id = "ami-04d693ea042f5c1f8" // the AMI ID
    }

    "api" = {
      count         = 1          // the number of EC2 instances
      instance_type = "t2.micro" // the EC2 instance
      ami_id = "ami-04d693ea042f5c1f8" // the AMI ID
    }
  }
}

variable "subnet_id_1" {
  description = "subnet id 1"
  type        = string
}

variable "subnet_id_2" {
  description = "subnet id 2"
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