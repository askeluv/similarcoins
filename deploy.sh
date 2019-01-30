#!/bin/bash
gsutil rsync -x ".git/*" -R . gs://www.similarcoins.com

