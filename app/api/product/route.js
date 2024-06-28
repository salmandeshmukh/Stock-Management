import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {

    
   
// Replace the uri string with your connection string.
const uri = "mongodb+srv://mongodb:Mongosalman9527@cluster0.izktr06.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri);

// async function run() {
  try {
    const database = client.db('stock');
    const inventory = database.collection('inventory');

    // Query for a movie that has the title 'Back to the Future'
    const query = { };
    const products = await inventory.find(query).toArray();
    
    return NextResponse.json({success: true, products})
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
// }
// run().catch(console.dir);

}

export async function POST(request) {
   
    // Replace the uri string with your connection string.
    let body = await request.json()
    
    const uri = "mongodb+srv://mongodb:Mongosalman9527@cluster0.izktr06.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0?retryWrites=true&w=majority&appName=Cluster0";
    
    const client = new MongoClient(uri);
    
    // async function run() {
      try {
        const database = client.db('stock');
        const inventory = database.collection('inventory');        
        const product = await inventory.insertOne(body);    
        return NextResponse.json({product, ok:true})
      } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
      }
    // }
    // run().catch(console.dir);
    
    
    }