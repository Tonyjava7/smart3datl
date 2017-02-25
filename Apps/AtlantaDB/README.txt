# INSTALL MONGO
npm install mongo --save

# RUN MONGO
mongod --dbpath data/db

# IMPORT DATA
mongoimport -d smart3datl_db -c avl_otpdata --type csv --file data/avl_otpdata_month.csv --headerline

sudo npm -g install mongodb-rest

mongodb-rest

http://localhost:3000/smart3datl_db/avl_otpdata/?query={"calendar_day":"31-JAN-17"}