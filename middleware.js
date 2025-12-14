import express from "express";
import path from "path";

const PORT = 4000;
const app = express();


app.use((req,res,next)=>{
    console.log("user is accessing "+req.url+ "page")
    next();

})
// Home route
app.get("/", (req, res) => {
    res.send("You are in Home Page");
});

// About route
app.get("/about", (req, res) => {
    res.send("About Page");
});

// 404 handler (must be last)
app.use((req, res) => {
    const abspath = path.resolve('view/404.html');
    res.status(404).sendFile(abspath);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server started successfully at http://localhost:${PORT}`);
});