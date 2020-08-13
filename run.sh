#!/bin/bash

set -e

cd ui

npm run build-app

cd ../madoc-editor

mvn exec:java
