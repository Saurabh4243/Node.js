import express from "express"; 
import { MongoClient } from "mongodb";

const app=express();

const dbName="student";
const url="mongodb://localhost:27017"


const client=new MongoClient(url);
async function dbConnectivity(){
    await client.connect()
    const db= client.db(dbName);
    const collection=db.collection('result');
    
    const result=await collection.find().toArray()
    console.log(result)
}
dbConnectivity();


app.get("",(req,res)=>{
    res.send("This is home page");
})

app.listen(3100,()=>{
    console.log("server started successfully")
})