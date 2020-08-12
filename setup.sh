#!/bin/bash

set -e

mvn clean install
mvn clean package

cd ui

npm install
npm run lib