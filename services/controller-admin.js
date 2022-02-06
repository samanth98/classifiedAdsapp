const dbController = require("./db-admin")
const emailController = require("./mail-service")

dbController.dbController.connection()
var currloginUser;
var controller = {
    home: function (req, res) {

        if (req.session.login) {
            res.render("admin-home", { title: "Admin Home Page"})
        }
        else {
            res.render("admin-login", { title: "Admin Login Page" })
        }
    },

    index: function (req, res) {
        res.render("admin-home", { title: "Admin Home Page", userData: currloginUser })
    },

    login: function (req, res) {
        res.render("admin-login", { title: "Admin Login Page" })
    },

    loginverify: async function (req, res) {
        
        var email = req.body.email
        var password = req.body.password
        console.log("Email : ", email)
        console.log("Password : ", password)
        
        var userData = await dbController.loginUser(email, password)
        console.log("userData : ", userData)
        currloginUser = userData
        if (userData != null) {
            res.render("admin-home", { title: "Admin Home Page", userData: userData })
        }
        else {
            res.render("admin-login", { title: "Admin Login Page" })
        }
    },

    logout: function (req, res) {
        req.session.destroy(function (err) {
            console.log("session destroyed")
        })
        res.render("admin-login", { title: "Admin Login Page" })
    },    

    viewallmembers: function (req,res) {
        dbController.dbController.viewallmembers(res)        
    },    

    viewfulldetails: function(req,res,id){
        var id = req.params.id
        dbController.dbController.viewfulldetails(res,id)
    },

    viewallads: function (req, res) {        
        dbController.dbController.viewallads(res)
    },

    requestDetailsView: function(req,res){
        var id = req.params.id
        dbController.dbController.requestDetailsView(id, res)
    },  

    submitRequest: function (req, res) {
        var memberData = {            
            mid: req.body.mid,
            name: req.body.name,
            email: req.body.email,
            message: req.body.message
        }
        var adData = {
            aid: req.body.aid,
            title:req.body.title
        }
        mailBody = "Hi "+memberData.name+", " + "<br><p> Admin has made a request on your product titled <b>"+ adData.title + "</b></p>. </br><p>Message:<b>" + memberData.message + "</b</p>"
        emailController.sendwithoutcc(memberData.email, "ashokraj.kp@otomeyt.ai", "Message Request", mailBody)
        res.redirect("/admin/viewallads")
    }
}

module.exports = controller