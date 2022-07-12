require('dotenv').config();
const { MongoClient } = require('mongodb');

async function dbConnectCollection(collectionName){

  const {
    DB_USER, DB_PASSWORD, DB_HOST,DB_NAME
  } = process.env;
  let conectionString = `mongodb://${DB_HOST}`;
  if(DB_USER && DB_PASSWORD){
    conectionString = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/?authMechanism=DEFAULT`
  }
  const client = new MongoClient(conectionString);

  await client.connect();
  console.log('Connected successfully to server');
  const db = client.db(DB_NAME);
  const collection = db.collection(collectionName);
  
  // the following code examples can be pasted here...

  return collection;
}

async function createCollection() {
  const {
    DB_USER, DB_PASSWORD, DB_HOST,DB_NAME
  } = process.env;
  let conectionString = `mongodb://${DB_HOST}`;
  if(DB_USER && DB_PASSWORD){
    conectionString = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/?authMechanism=DEFAULT`
  }
  const client = new MongoClient(conectionString);

  await client.connect();
  console.log('Connected successfully to server');
  const db = client.db(DB_NAME);

  db.createCollection("CustomPokemon");

  db.createCollection("Favoritos", function(err, res) {
    client.close();
  });
}
module.exports = {
  dbConnectCollection,
  createCollection
};
