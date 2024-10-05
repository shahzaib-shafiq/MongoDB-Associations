const express = require('express')
const cookieParser = require('cookie-parser')
const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';
const app = express()
const path=require('path')
const userModel=require('./models/user')
const jwt=require('jsonwebtoken')
app.set("view engine","ejs")
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,'public')));


app.get("/",function(req,res){
  res.render("index")
})

app.post("/create",  function(req,res){

  let {username,email,password,age}=req.body
  
  bcrypt.genSalt(10,(err,salt)=>{
    bcrypt.hash(password,salt,async (err,hash)=>{
      let Createduser= await userModel.create({
        username,email,password:hash,age
          })
          let token=jwt.sign({email},"secret")
          res.cookie("token",token)
          res.send(Createduser)
    })
  })

 
})

app.get("/login",  function(req,res){

  
res.render('login')
 
})

app.post("/login", async function(req, res) {
  const { email, password } = req.body;

  try {
      const findUser = await userModel.findOne({ email });
      
      if (!findUser) {
          return res.status(401).send("User not found");
      }  

      const isMatch = await bcrypt.compare(password, findUser.password);
      
      if (isMatch) {
          const token = jwt.sign({ email: findUser.email }, "secret", { expiresIn: '1h' });
          res.cookie("token", token);
          return res.send("Login Successful");
      } else {
          return res.status(401).send("Invalid password");
      }
  } catch (error) {
      console.error(error);
      return res.status(500).send("Something went wrong");
  }
});

// app.post("/login",async  function(req,res){

//   let {email,password}=req.body
//   let findUser=await userModel.findOne({email})
//   if (!findUser)
//   {
//    return res.send("Something went Wrong")
//   }  

  
//   bcrypt.compare(req.body.password,findUser.password,function(err,result){

// if (result)
// {
//   let token=jwt.sign({email:findUser.email},"secret")
// res.cookie("token",token)
//   res.send("Login Sucessful")
// }
// else
// {
//  return res.send("Something went wrong")
// }
//   })
//   return res.render('login')
 
// })

app.get("/logout",  function(req,res){
  res.cookie("token","")
  res.redirect("/")
})

// app.get('/cookie', function (req, res) {
//   res.cookie("name","SS")
//   res.send("Done")
// })


// app.get('/hash', function (req, res) {

//   bcrypt.genSalt(saltRounds, function(err, salt) {
//     bcrypt.hash(myPlaintextPassword, salt, function(err, hash) {
//         res.send(hash)
//     });
//   });})



// app.get('/read', function (req, res) {

//   res.send("Done")
// })

app.listen(3000)