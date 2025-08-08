const express = require('express');
const ejs = require('ejs');
const axios = require('axios'); // Added axios for HTTP requests

var app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));


const CRUDCRUD_BASE_BASE_URL = process.env.CRUDCRUD_API_URL || "https://crudcrud.com/api/cdb5b152b9b242468b958be1922e3468"; 
const USERS_ENDPOINT = `${CRUDCRUD_BASE_BASE_URL}/users`; 

let secrets = ["Jack Bauer is my hero."];
app.post("/register",async function(req, res){
    try{   
        const newUser = {
            email : req.body.username,
            password : req.body.password 
        };
        await axios.post(USERS_ENDPOINT, newUser);
        res.redirect("/secrets");
    }
    catch(err){
        console.log("Error registering user:", err.message);
        res.send("Error registering user. Please try again.");
    }
});

app.post("/login",async function(req, res){
      
    const username = req.body.username;
    const password = req.body.password;
    try{ 
        const response = await axios.get(USERS_ENDPOINT);
        const users = response.data;
        const foundUser = users.find(user => user.email === username);

        if(foundUser){
            if(foundUser.password === password){
                res.redirect("/secrets");
            }
            else{
                res.send("Incorrect password.");
            }   
        }
        else{
            res.send("User not found.");
        }
    }
    catch(err){
        console.log("Error logging in:", err.message);
        res.send("Error logging in. Please try again.");
    }
});
  



  




// Route definitions

app.get("/",function(req, res){
    res.render("home");
});

app.get("/login",function(req, res){
    res.render("login");
});

app.get("/register",function(req, res){
    res.render("register");
});
app.get("/secrets",(req, res) => res.render("secrets",{secret: secrets.join(". ")}));



app.get("/submit",(req, res) => res.render("submit"));
app.get("/logout",(req, res) => res.render("home"));




app.post("/submit", (req, res) => {
    const submittedSecret = req.body.secret?.trim();
    if (submittedSecret) {
        secrets.push(submittedSecret);
    }
    res.redirect("/secrets");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

