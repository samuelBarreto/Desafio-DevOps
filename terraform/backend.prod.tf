terraform {
  backend "s3" {
    bucket  = "desafio-devops-terraform-state"
    key     = "terraform/environments/prod/terraform.tfstate"
    region  = "us-east-1"
 