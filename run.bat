cd ui

call npm run lib

call npm run build-app

cd ../madoc-editor

call mvn exec:java
