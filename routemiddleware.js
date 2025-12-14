import express from "express";
import path from "path";

const PORT = 2000;
const app = express();
function checkAge(req,res,next){
    if(!req.query.age || req.query.age<18){
        res.send("your are not allowed to visit site")
    }else{
        next();
    }
}
app.use(checkAge);
// Home route
app.get("/", (req, res) => {
    res.send("You are in Home Page");
});

// About route
app.get("/about",checkAge, (req, res) => {
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