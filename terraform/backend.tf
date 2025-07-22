terraform {
  backend "s3" {
    bucket  = "desafio-devops-terraform-state"
    key     = "terraform.tfstate"
    region  = "us-east-1"
    encrypt = true
    folder  = "terraform/environments/${{ github.ref == 'refs/heads/main' && 'prod' || 'dev' }}"
  }
}
