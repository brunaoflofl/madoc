call mvn clean install
call mvn clean package
cd ui
call npm install
call npm run lib
cd ..
