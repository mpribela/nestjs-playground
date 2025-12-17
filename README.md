## Description

NestJS playground application

## Project setup

```bash
$ pnpm install
$ docker compose up -d
```

- Docker compose will start localstack (AWS emulator)
- Before running the project, set up the `.env` file with following variables to run against docker containers:

```
# for AWS:
CLIENT=AWS
AWS_ENDPOINT_URL=http://localhost:4566
AWS_ACCESS_KEY=test
AWS_SECRET_KEY=test
AWS_REGION=us-east-1
AWS_BUCKET_NAME=test-bucket

# for Azure:
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=http://localhost:10000/devstoreaccount1;QueueEndpoint=http://localhost:10001/devstoreaccount1;
AZURE_CONTAINER_NAME=test-container
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev
```

