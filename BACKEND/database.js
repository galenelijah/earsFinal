// import { MongoClient, ServerApiVersion } from "mongodb";
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const URI =process.env.URI; 

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
let db;
const run = async () => {
 
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    db = client.db("SD_DB");
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
}

const getDB = ()=>{
    console.log("getDB called. Returning db instance:", db ? "db object" : "undefined/null");
    return db;
}
module.exports = {run, getDB};