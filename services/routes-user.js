const controller = require("./controller-user")
const {body, checkSchema, check, validationResult } = require('express-validator')

module.exports = function(user){

    user.route("/").get(controller.home)

    user.route("/login").get(controller.login)

    user.route("/index").get(controller.index)

    user.route("/loginverify").post(controller.loginverify) 

    user.route('/logout').get(controller.logout)


    user.route('/register').get(controller.register)

    
    user.route("/addinguser").post(controller.addinguser)

    user.route('/forgot').get(controller.forgotView)

    user.route('/sendpassword').post(controller.sendPassword)

    user.route("/update/:id").get(controller.updateView)

    user.route("/updateuser").post(controller.updateuser)

    user.route("/updatepassword/:id").get(controller.updatepasswordView)

    user.route("/updateuserpassword").post(controller.updateuserpassword)

    user.route("/deletebyid/:id").get(controller.deleteuser)
    
    //Ad creating 
    
    //to load the ui
    user.route("/uploadview").get(controller.uploadView)

    //do the action from the form
    user.route("/uploadaction").post(controller.uploadAction)

    //to the ad image
    // user.route("/viewad/:id").get(controller.viewAd)

    user.route("/deleteAdbyid/:id").get(controller.deletAd)

    user.route("/viewad/:id").get(controller.viewallads)

    user.route("/deleteallads/:id").get(controller.deleteallads)

    user.route("/editAd/:id").get(controller.updateAdView)

    user.route("/updateAd").post(controller.updateAd)

    
    user.route("/reuploadImg/:id").get(controller.updateImgView)

    user.route("/reuploadImg").post(controller.updateImg)


}