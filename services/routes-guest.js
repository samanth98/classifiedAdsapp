const controller = require("./controller-guest")

module.exports = function(guest){

    guest.route("/").get(controller.home) 

    guest.route('/viewallads').get(controller.viewallads)

    guest.route('/viewFullDetails/:id').get(controller.viewFullDetails)

    guest.route('/contactMember/:id').get(controller.contactMember)

    guest.route('/sendMail').post(controller.sendMail)

}
