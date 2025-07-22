terraform {
  backend "s3" {
    bucket  = "desafio-devops-terraform-state"
    key     = "terraform.tfstate"
    region  = "us-east-1"
    encrypt = true
    folder  = "terraform/environments/dev"
  }
}
