
const controller = require("./controller-admin")
module.exports = function (admin) {

    admin.route("/").get(controller.home)

    admin.route("/login").get(controller.login)

    admin.route("/loginverify").post(controller.loginverify)

    admin.route('/logout').get(controller.logout)

    admin.route('/viewallmembers').get(controller.viewallmembers)

    admin.route('/index').get(controller.index)

    admin.route('/viewfulldetails/:id').get(controller.viewfulldetails)

    admin.route('/viewallads').get(controller.viewallads)

    admin.route('/requestDetailsView/:id').get(controller.requestDetailsView)

    admin.route('/submitRequest').post(controller.submitRequest)

}