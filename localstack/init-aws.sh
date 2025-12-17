#!/usr/bin/env bash

set -eou pipefail

LOCALSTACK_HOST=localhost
REGION=us-east-1
BUCKET_NAME="test-bucket"

createBucket() {
  local BUCKET_TO_CREATE=$1
  awslocal --endpoint-url=http://${LOCALSTACK_HOST}:4566 s3api create-bucket --bucket ${BUCKET_TO_CREATE} --region ${REGION}
}

getBuckets() {
  awslocal --endpoint-url=http://${LOCALSTACK_HOST}:4566 s3api list-buckets
}

echo "creating bucket $BUCKET_NAME"
BUCKET_URL=$(createBucket ${BUCKET_NAME})
echo "created bucket: $BUCKET_URL"