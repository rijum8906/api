const express = require("express");
const users = require("./users.json");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/",(req, res, next)=>{
  res.send("Hello World");
});

app.put("/register-user",(req,res,next)=>{
   const { name, email, username, password } = req.body;
   if (!name || !email || !username || !password) {
     return res.status(401).json({
       message:"insufficient data",
       status: false
     });
   }
   users.push({name, email, password, username });
     res.status(200).json({
       message:"user created successfully",
       status: true
     });
});

app.post("/login-user",(req,res,next)=>{
   
     res.status(200).json({
       message:"user loged in successfully",
       status: true
     });
});
app.delete("/delete-user",(req,res,next)=>{
   const { username, password } = req.body;
   if (!username || !password) {
     return res.status(401).json({
       message: "insufficient data",
       status: false
     });
   }
   const index = users.findIndex(u=> u.username === username && u.password === password);
     if (index === -1) {
       return res.status(401).json({
         message:"invalid credentials",
         status: false
       });
     }
     users.splice(index, 1);
     res.status(200).json({
       message:"user deleted successfully",
       status: true
     });
});

app.get("/get-users",(req,res,next)=>{
   res.status(200).json(users);
});
app.patch("/update-user",(req,res,next)=>{
   const { username, password } = req.body;
   if (!username || !password) {
     return res.status(401).json({
       message: "insufficient data",
       status: false
     });
   }
   const index = users.findIndex(u=> u.username === username && u.password === password);
     if (index === -1) {
       return res.status(401).json({
         message:"invalid credentials",
         status: false
       });
     }
     users[index] = {...users[index],...req.body};
     res.status(200).json({
       message:"user updated successfully",
       status: true
     });
});

app.listen(80,()=>{
  console.log("app is running at port 80");
});
