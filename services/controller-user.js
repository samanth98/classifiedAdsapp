const dbController = require("./db-user")
const emailController = require("./mail-service")
//const sgMail = require('@sendgrid/mail')
const formidable = require('formidable') //npm install formidable
const fs = require('fs')
dbController.dbController.connection()
var currloginUser;
var controller = {

    home: function (req, res) {
        if (req.session.loginuserId) {
            res.render("user-home", { title: "user Home Page" })
        }
        else {
            res.render("user-login", { title: "user Login Page" })
        }
    },

    index: function (req, res) {
        res.render("user-home", { title: "User Home Page", userData: currloginUser })
    },
    login: function (req, res) {
        res.render("user-login", { title: "user Login Page" })
    },
    
    loginverify: async function (req, res) {
        //colletion data from req (form)
        var email = req.body.email
        var password = req.body.password
        console.log("Email : ", email)
        console.log("Password : ", password)
        /*
        //call a method from db-staff :: to check whether any user with given email and password
        dbController.dbController.getLoingUser(email, password, req, res)
        */
        var userData = await dbController.loginUser(email, password)
        console.log("userData : ", userData)
        currloginUser = userData
        if (userData != null) {
            
            req.session.loginuserId = userData._id;
            req.session.loginuserEmail = userData.email
            res.render("user-home", { title: "user Home Page", userData: userData })
        }
        else {
            res.render("user-login", { title: "user Login Page" })
        }
    },
    logout: function (req, res) {
        req.session.destroy(function (err) {
            console.log("session destroyed")
        })
        res.render("user-login", { title: "user Login Page" })
    },
    forgotView: function (req, res) {
        res.render("user-forgot-password", { title: "User Forgot Password Page" })
    },
    register: function (req, res) {
        res.render("reg", { title: "Register User" })
    },
    addinguser: function (req, res) {
        var userData = {
            fname: req.body.fname,
            lname:req.body.lname,
            mobile:req.body.mobile,
            gender:req.body.option,
            address:req.body.address,
            email: req.body.email,
            password: req.body.password,

        }
        dbController.dbController.addinguser(userData)
        res.render("user-login",{title : "Login Page"})
    },  

    sendPassword: async function (req, res) {
        var email = req.body.email
       
        var user = await dbController.getUserByEmail(email)
        if (user == null) {
            res.send("Invalid email address")
        }
        else {
            var password = user.password
            var name = user.name
            //send this email
            mailBody = "Hi "+name+","+"<br> Your password is : <b>"+ password+"</b"     
            console.log(email)    
            console.log(mailBody)    
            emailController.sendwithoutcc(email, "ashokraj.kp@otomeyt.ai", "Password Recovery", mailBody)
            res.render("user-login", { title: "Staff Login Page" })
        }

    },
    
    updateView : function(req,res){
        var id = req.params.id 
        dbController.dbController.updateView(id,res)
        
    },

    updateuser : async function (req,res) {
        var userData = {   
            id : req.body.id, 
            fname: req.body.fname,
            lname:req.body.lname,
            mobile:req.body.mobile,
            gender:req.body.option,
            address:req.body.address,
            email: req.body.email,
            password: req.body.password,        
        }
        currloginUser.name = userData.fname
        console.log(userData)
        dbController.dbController.updatebook(userData)
        await res.redirect("/user/index")
    },
    
    updatepasswordView : function(req,res){
        var id = req.params.id 
        dbController.dbController.updatepasswordView(id,res)
        
    },

    updateuserpassword: async function (req,res) {
        var userData = {   
            id : req.body.id, 
            password: req.body.password,        
        }
        dbController.dbController.update_password_book(userData)
        await res.redirect("/user/index")
    },
    

    deleteuser: function (req, res) {
        var id = req.params.id
        dbController.dbController.deleteuser(id)
        res.redirect("/user/login")
    },

    ////////////////////////////////////////////

    uploadView : function(req, res){
        if( req.session.loginuserId )
        {
            res.render("user-upload-view", {title : "Form with upload"})
        }
        else
        {
            res.render("user-login", {title : "user Login Page"})
        }
    },
    uploadAction : async function(req, res){
        console.log("inside controller function")
        var form = new formidable.IncomingForm();
        dbController.insertAd(req, form, currloginUser) 
        var userData = currloginUser
   
        await res.redirect("/user/index")
    },
    viewAd : async function(req, res){
        //read the id from url
        var id = req.params.id
        var ad = await dbController.getAdById(id)
        //ad-view.ejs
        //form the url of the image
        if( ad != null )
        {
            var imageUrl = "/media/" + ad._id + "." + ad.image
            console.log("Image url : ", imageUrl)
            res.render("ad-view", {'title' : "Ad full view", 'adData' : ad, 'imageUrl' : imageUrl})
        }
        else
        {
            var userData = currloginUser
            res.render("user-home", {title : "user Home Page", userData: userData})
        }

    },

    deletAd: async function (req, res) {
        var id = req.params.id
        await dbController.dbController.deleteOneAd(id)
        res.redirect("/user/viewad"+currloginUser._id.toString())
    },
    viewallads: async function (req, res) {
        var id = req.params.id
        await dbController.dbController.viewallads(res, id,currloginUser)
    },
    deleteallads: function (req, res) {
        var id = req.params.id
        dbController.dbController.deleteallads(res, id)            
    },//updateAdView
    updateAdView : function(req,res){
        var id = req.params.id 
        dbController.dbController.updateAdView(id,res)        
    },
    
    updateAd : async function (req,res) {
        
        var adData = {   
            id : req.body.id,         
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            image: req.body.image
        }        
        await dbController.dbController.updateAd(adData)
        res.redirect("/user/viewallads/"+currloginUser._id.toString()) 
    },
    updateImgView:function(req,res){
        var id = req.params.id 
        dbController.dbController.updateimgView(id,res)        
    },

    updateImg : async function (req,res) {
        var form = new formidable.IncomingForm()
        await dbController.updateimgAd(req,form,currloginUser)
        res.redirect("/user/viewad/"+currloginUser._id.toString()) 
    },



    
}

module.exports = controller