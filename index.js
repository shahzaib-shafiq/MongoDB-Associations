const express = require('express')
// const cookieParser = require('cookie-parser')
// const bcrypt = require('bcrypt');
// const saltRounds = 10;
// const myPlaintextPassword = 's0/\/\P4$$w0rD';
// const someOtherPlaintextPassword = 'not_bacon';
const app = express()
const path=require('path')
// const jwt=require('jsonwebtoken')
// app.set("view engine","ejs")
// app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,'public')));

const userModel=require('./models/user')
const postModel=require('./models/posts')

app.get("/create",async function(req,res){
  let user= userModel.create({
    username:"SS",
    email:"s@gmail.com",
    age:32,
  });
  res.send("A")
})

app.get("/post/create",async function(req,res){
let post =await postModel.create({
  postData:"Hello ooooooooooooooooooooooooo",
  user:"6700cc05029ac049ac985af4"
})
let user=await userModel.findOne({_id:"6700cc05029ac049ac985af4"})
user.posts.push(post._id)
await user.save()
res.send({post,user})
})


app.listen(3000)