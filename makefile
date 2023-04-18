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
	cd ./web && npm install --force && npm run build && cd ../api && npm install && npm run build

tf-init: build
	cd ./terraform && terraform init

terraform-plan: tf-init
	cd ./terraform && terraform plan -auto-approve -var-file="$(VARS)"

terraform-deploy: tf-init
	cd ./terraform && terraform apply -auto-approve -var-file="$(VARS)"

terraform-destroy:
	cd ./terraform && terraform destroy -var-file="$(VARS)"