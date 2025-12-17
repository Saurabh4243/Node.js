import express from "express"; 
import { MongoClient } from "mongodb";

const app = express();
app.use(express.urlencoded({ extended: true }));

const dbName = "student";
const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

let db;

// Connect to DB once at startup
client.connect().then(() => {
    db = client.db(dbName);
    console.log("MongoDB connected");
}).catch(err => console.log(err));

// Home route
app.get("/", (req, res) => {
    res.send("Welcome to Home Page");
});

// Fetch students
app.get("/api", async (req, res) => {
    const collection = db.collection("result");
    const students = await collection.find().toArray();
    res.send(students);
});

// Form UI
app.get("/add", (req, res) => {
    res.send(`
        <center>
        <h1>Student Enrollment Form</h1>
            <form method="post" action="/add-student">
                <input type="text" name="name" placeholder="Enter your name">
                <br><br>
                <input type="number" name="age" placeholder="Enter your age">
                <br><br>
                <input type="email" name="email" placeholder="Enter your email">
                <br><br>
                <button>Submit</button>
            </form>
        </center>
    `);
});

// Handle form POST
app.post("/add-student", async (req, res) => {
    console.log(req.body);

    const collection = db.collection("result");
    await collection.insertOne(req.body);

    res.send("Student data saved successfully!");
});

// Start server
app.listen(3100, () => {
    console.log("Server started on port 3100");
});