import { MongoClient } from 'mongodb';

const url = `mongodb://${process.env.DBHOST}:${process.env.DBPORT}`;
const dbName = process.env.DBNAME

let client;
let db;

export default async function Connection() {
  if (db) return db;

  try {
    client = new MongoClient(url);
    await client.connect();
    console.log('Connected successfully to server');
    db = client.db(dbName);
    return db;
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    throw err;
  }
}
