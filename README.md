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
CLIENT=AWS
AWS_ENDPOINT_URL=http://localhost:4566
AWS_ACCESS_KEY=test
AWS_SECRET_KEY=test
AWS_REGION=us-east-1
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev
```

