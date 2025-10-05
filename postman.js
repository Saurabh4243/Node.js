const express = require("express");
const users = require("./MOCK_DATA.json");
const fs=require("fs");
const app = express();
const port = 8000;
app.use(express.urlencoded({extended:false}));

// Middleware
app.use(express.json());

// routes
app.get("/users", (req, res) => {
  const html = `
    <ul>
      ${users.map(user => `<li>${user.first_name}</li>`).join('')}
    </ul>
  `;
  res.send(html);
});

// JSON endpoint
app.get("/api/users", (req, res) => {
  return res.json(users);
});

// Dynamic route for user by ID
app
  .route("/api/users/:id")
  .get((req, res) => {
    const id = req.params.id;
    const user = users.find(user => user.id == id);
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json(user);
  })
  .patch((req, res) => {
    // edit user with id (to be implemented)
    return res.json({ status: "pending" });
  })
  .delete((req, res) => {
    // delete user with id (to be implemented)
    return res.json({ status: "pending" });
  });

// Create new user
app.post("/api/users", (req, res) => {
  // add new user (to be implemented)
  const body=req.body;
  users.push({...body,id:body.length});
  fs.writeFile("./MOCK_DATA.json",JSON.stringify(users),(err,data)=>{
    return res.json({ status: "pending" });
  });
  
});

app.listen(port, () => console.log(`✅ Server started at port ${port}`));