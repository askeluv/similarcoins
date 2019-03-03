#!/bin/bash

# log into GCP and set project
gcloud auth login
gcloud config set project similarcoins
# gcloud app deploy # TODO: go straight to this instead of via GCS and cloud shell

# sync files to GCS
gsutil rsync -r build/ gs://similarcoins-react/build
gsutil cp app.yaml gs://similarcoins-react/app.yaml

# print instructions (temporary solution)
echo "Paste the following 4 lines manually in the Cloud Shell:"
echo ""
echo ""
echo "mkdir -p similarcoins-react"
echo "gsutil rsync -r gs://similarcoins-react ./similarcoins-react"
echo "cd similarcoins-react"
echo "gcloud app deploy"
echo ""
echo ""

# log into cloud shell
gcloud alpha cloud-shell ssh
exit
