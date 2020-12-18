const express = require('express'),
    app = express(),
    mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/personel_info', {useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
    console.log("DB Connected");
}).catch(err=>{
    console.log("Error : "+ err);
})

app.use(express.static(__dirname))
app.use(express.urlencoded({extended: true}))

var stuSchema = new mongoose.Schema({
    name: String,
    age: Number,
    dob: String,
    graduation: String,
    dept: String,
    year: Number,
    email: String,
    phone: String,
    gender: String
})

var Student = mongoose.model("Student", stuSchema);

app.get("/", (req, res)=>{
    res.sendFile(__dirname+"/main.html")
})

app.post("/", (req, res)=>{
    var data = {
        name: req.body.name,
        age: Number(req.body.age),
        dob: req.body.dob,
        graduation: req.body.gra,
        dept: req.body.dept,
        year: Number(req.body.year),
        email: req.body.email,
        phone: req.body.phone,
        gender: req.body.gender
    }
    var stu = new Student(data);
    stu.save();
    res.redirect("/")
})

app.post("/update", async(req, res)=>{
    var mail = req.body.email
    var ph = req.body.phone
    const up = await Student.updateOne({email: mail}, {phone: ph});
    res.send(`<h2>${up.nModified} document modified</h2>`)
})

app.post("/delete", async(req, res)=>{
    const del = await Student.deleteOne({email: req.body.email})
    res.send("<h2>Deleted</h2>")
})

app.post("/show", async(req, res)=>{
    const s = await Student.findOne({email:req.body.email})
    res.send(JSON.stringify(s))
})
app.get("/showall", async(req, res)=>{
    const s = await Student.find({})
    res.send(JSON.stringify(s))
})

app.listen(3000, ()=>{
    console.log("Server Started");
})