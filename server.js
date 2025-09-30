//creating server in node js
const http=require("http");

const myServer=http.createServer((req,res)=>{
    console.log("new req receive");
    res.end("hello from server");
})
myServer.listen(8000,()=>{
    console.log("server started");
});
