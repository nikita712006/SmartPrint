const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

/* SIGNUP API */

app.post("/signup",(req,res)=>{

const {name,email,mobile,password}=req.body;

const sql="INSERT INTO users(name,email,mobile,password) VALUES(?,?,?,?)";

db.query(sql,[name,email,mobile,password],(err,result)=>{

if(err){
res.send(err);
}else{
res.send("User registered");
}

});

});

/* LOGIN API */

app.post("/login",(req,res)=>{

const {email,password}=req.body;

const sql="SELECT * FROM users WHERE email=? AND password=?";

db.query(sql,[email,password],(err,result)=>{

if(result.length>0){
res.send(result[0]);
}else{
res.send("Invalid login");
}

});

});

/* PRINT BOOKING */

app.post("/book-print",(req,res)=>{

const {user_id,title,pdf_name,pages,copies,color,binding,shop,slot}=req.body;

const sql=`INSERT INTO print_jobs
(user_id,title,pdf_name,pages,copies,color,binding,shop,slot)
VALUES(?,?,?,?,?,?,?,?,?)`;

db.query(sql,[user_id,title,pdf_name,pages,copies,color,binding,shop,slot],
(err,result)=>{

if(err){
res.send(err);
}else{
res.send("Print booked");
}

});

});

app.listen(5000,()=>{
console.log("Server running on port 5000");
});