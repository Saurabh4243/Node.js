import express from "express";
import path from "path";

const PORT = 1000;
const app = express();

// Home route
app.get("/", (req, res) => {
    res.send1("You are in Home Page");
});

// About route
app.get("/about", (req, res) => {
    res.send("About Page"); // ✅ fixed
});

// 404 handler (must be last)
app.use((req, res) => {
    const abspath = path.resolve("view/404.html");
    res.status(404).sendFile(abspath);
});

// Error handling middleware
app.use((error, req, res, next) => {
    res.status(error.status || 500).send("We are working on website");
});

// Start server
app.listen(PORT, () => {
    console.log(`Server started successfully at http://localhost:${PORT}`);
});