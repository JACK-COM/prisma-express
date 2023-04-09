VARS="secrets.tfvars"

# dev env spin up
dev:
	npm i -g concurrently
	concurrently "make dev-web" "make dev-api"

# run dev web
dev-web:
	cd ./web && npm install --force && npm run start

dev-api:
# run dev api
	cd ./api && npm install && npm run start

build:
	cd ./web && npm run build && cd ../api && npm run build

tf-init:
	cd ./terraform && terraform init

terraform-push:
	cd ./terraform && terraform plan -var-file="$(VARS)" && terraform apply -var-file="$(VARS)"