const server = require('./src/app.js');
require('dotenv').config();
const {
  DB_USER, DB_PASSWORD, DB_HOST,DB_NAME
} = process.env;
let conectionString = `mongodb://${DB_HOST}`;

if(DB_USER && DB_PASSWORD){
  conectionString = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/?authMechanism=DEFAULT`
}

server.listen(3001, () => {

  var MongoClient = require('mongodb').MongoClient;


MongoClient.connect(conectionString, function(err, db) {
  if (err) throw err;
  var dbo = db.db(DB_NAME);
  
  dbo.createCollection("Favoritos", function(err, res) {

  });

  dbo.createCollection("CustomPokemon", function(err, res) {
   
   // console.log("Collection created!");
    db.close();
  });
});
  console.log('%s listening at 3001'); // eslint-disable-line no-console
});
