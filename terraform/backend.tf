terraform {
  backend "s3" {
    bucket  = "desafio-devops-terraform-state"
    key     = "terraform/environments/dev/terraform.tfstate"
    region  = "us-east-1"
    encrypt = true
  }
}
