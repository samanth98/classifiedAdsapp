const mongodb = require('mongodb')
const mongoClient = require('mongodb').MongoClient
const fs = require('fs')
var url = "mongodb://localhost:27017"
var db;

function loginUser(email, password){
    var collection = db.collection("user")
    var filter = {
        "email" : email,
        "password" : password
    }
    var userData = collection.findOne(filter)
    return userData;
}

function getUserByEmail(email){
    var collection = db.collection("user")
    var filter = {
        "email" : email
    }
    var userData = collection.findOne(filter)
  //  console.log(userData.password)
    return userData;
}
// //files
function insertAd(req, form, currloginUser)
{
    dbController.connection()
    console.log("inside controller")
    //getting collection
    var collection = db.collection("ad")

    form.parse(req, function(err, fields, files){
        console.log("inside formidable function")
        //collecting information about the file upload
        var oldPath = files.adimage.filepath; //temp location 
        var extension = files.adimage.originalFilename.split('.').pop()

        //adding text to db
        var name = fields.name
        var description = fields.description
        var price = fields.price
        var createdDateTime = Date.now();
 
        console.log("name : ",name )
        console.log("description : ", description)

       

        //insert to db
        var adData = {
            'userid': currloginUser._id.toString(),
            'name': name,
            'description': description,
            'image': extension,
            'createdDateTime': createdDateTime,
            'price': price
        }
        collection.insertOne(adData)
        var adId = adData._id //new id generated //_id.exten ::: for eg: 123123123123.png
        //u want to show a full details of ad
        //ip: ad._id
        //u can get the advertise detail from db using ad id
        //retrieved ad, u can get ad.image (extension)
        //_id.extension

        var newFileNameName = "./public/media/" + adId + "." + extension;

        //read
        fs.readFile(oldPath, function(err, data){
            if(err)
            {
                console.log("Error in upload : ", err)
                return
            }
            //write
            fs.writeFile(newFileNameName, data, function(err){
                if(err)
                {
                    console.log("Error in upload2 : ", err)
                    return   
                }
            })
        })

        /*
        if( extension === 'png' || extension === 'jpg' )
        {
            var newFileName = __dirname + "/media/" + files.adimage.originalFilename;
        }
        */
    })

}

function updateimgAd(req, form, currloginUser) {
    //getting collection
    dbController.connection()    
    form.parse(req, function (err, fields, files) {
        //collecting information about the file upload
        var collection = db.collection("ads")
        var selectedId = fields.id
        var filter = {
            "_id": mongodb.ObjectId(selectedId)
        }
        console.log("id to filter "+selectedId)
        var oldPath = files.filetoupload.filepath; //temp location 
        var extension = files.filetoupload.originalFilename.split('.').pop()
        console.log(extension)
        var adData = {
            $set: {
                'image': extension
            }
        }
        collection.updateMany(filter, adData, function (err, result) {
            if (err) {
                console.log("err in update")
                return
            }
        })
        var adId = fields.id
        var newFileNameName = "./public/media/" + adId + "." + extension;
        fs.readFile(oldPath, function (err, data) {
            if (err) {
                console.log("Error in upload : ", err)
                return
            }
            //write
            fs.writeFile(newFileNameName, data, function (err) {
                if (err) {
                    console.log("Error in upload : ", err)
                    return
                }
            })
        })

    })
}

// function insertAd(req, form,currloginUser)
// {
//    // dbController.connection()
//     console.log("inside controller")
//     //getting collection
//     var collection = db.collection("ad")

//     form.parse(req, function(err, fields, files){
//         console.log("inside formidable function")
//         //collecting information about the file upload
//         var oldPath = files.adimage.filepath; //temp location 
//         var extension = files.adimage.originalFilename.split('.').pop()

//         //adding text to db
//         var name = fields.name
//         var description = fields.description
 
//         console.log("name : ", name)
//         console.log("description : ", description)

//         //preparing time informartion
//         var timestamp = Date.now();
//         var currentDateTime = new Date();  

//            //insert to db
// //         var adData = {
// //             'userid': currloginUser._id.toString(),
// //             'name': name,
// //             'description': description,
// //             'image': extension,
// //             'createdDateTime': createdDateTime,
// //             'price': price
// //         }
//         //insert to db
//         var adData = {
//             'memberId' : req.session.loginuserId,
//             'name' : name,
//             'description' : description,
//             'image' : extension,
//             'createdDateTime': createdDateTime,
//             'price': price
//         }
//         collection.insertOne(adData)
//         var adId = adData._id //new id generated //_id.exten ::: for eg: 123123123123.png
//         //u want to show a full details of ad
//         //ip: ad._id
//         //u can get the advertise detail from db using ad id
//         //retrieved ad, u can get ad.image (extension)
//         //_id.extension

//         var newFileNameName = "./public/media/" + adId + "." + extension;

//         //read
//         fs.readFile(oldPath, function(err, data){
//             if(err)
//             {
//                 console.log("Error in upload : ", err)
//                 return
//             }
//             //write
//             fs.writeFile(newFileNameName, data, function(err){
//                 if(err)
//                 {
//                     console.log("Error in upload2 : ", err)
//                     return   
//                 }
//             })
//         })

//         /*
//         if( extension === 'png' || extension === 'jpg' )
//         {
//             var newFileName = __dirname + "/media/" + files.adimage.originalFilename;
//         }
//         */
//     })

// }




var dbController = {
    connection : function(){
        mongoClient.connect(url, function(err, database){
            if(err)
            {
                console.log("Err in database server connection")
                return
            }
            db = database.db("task")
            console.log("Mongo db connected")
        })
    },
    addinguser: function (data) {
        //adding logic
        var collection = db.collection("user")
        collection.insertOne(data, function (err, result) {
            if (err) {
                console.log("err in adding staff")
                return
            }
            console.log("New user registered successfully")
        })
    },
    updateView: function (id, res) {
        var collection = db.collection("user")
        var newId = mongodb.ObjectId(id)
        var filter = {
            "_id": newId
        }
        var userData = null;
        collection.find(filter).toArray(function (err, result) {
            if (err) {
                console.log("err")
                return
            }
            result.forEach(element => {
                userData = element
            })
            res.render("update", { title: "view", userdata:userData })
        })
    },
    updatebook: function (data, res) {

        var selectedId = data.id
        var collection = db.collection("user")
        var filter = {
            "_id": mongodb.ObjectId(selectedId)
        }
        var jsonData = {
            $set: {
                //
                fname: data.fname,
                lname:data.lname,
                mobile:data.mobile,
                gender:data.option,
                address:data.address,
                email: data.email,
                gender:data.gender,
                password: data.password, 
                //
                // name: data.name,
                // email: data.email,
                // password: data.password,
            }
        }
        console.log("in db",jsonData)
        collection.updateMany(filter, jsonData, function (err, result) {
            if (err) {
                console.log("err in update")
                return
            }
            console.log("user details updated successfully")
        })
    },
    
    updatepasswordView: function (id, res) {
        var collection = db.collection("user")
        var newId = mongodb.ObjectId(id)
        var filter = {
            "_id": newId
        }
        var userData = null;
        collection.find(filter).toArray(function (err, result) {
            if (err) {
                console.log("err")
                return
            }
            result.forEach(element => {
                userData = element
            })
            res.render("update-userpassword", { title: "view", userdata:userData })
        })
    },
    update_password_book: function (data, res) {

        var selectedId = data.id
        var collection = db.collection("user")
        var filter = {
            "_id": mongodb.ObjectId(selectedId)
        }
        var jsonData = {
            $set: {
            
                password: data.password, 
                //
                // name: data.name,
                // email: data.email,
                // password: data.password,
            }
        }
        collection.updateMany(filter, jsonData, function (err, result) {
            if (err) {
                console.log("err in update")
                return
            }
            console.log("user Password details updated successfully")
        })
    },


    deleteuser: function (id) {
        var newId = mongodb.ObjectId(id)
        var collection = db.collection("user")
        var filter = {
            "_id": newId
        }
        collection.deleteOne(filter, function (err, result) {
            if (err) {
                console.log("Err in delete ", err)
                return
            }
            console.log("useraccount deleted with id : ", id)
        })
    },
 


    // getAdById: async function(res,id)
    // {
    //     var collection = db.collection("ad")
    //     var newId = id
    //     var filter = {
    //         'memberId' : newId
    //     }
    //     var ad 
    //     var userData = null;
    //   ad = await collection.find(filter).sort({createdDateTime: -1 }).toArray(function (err, result) {
          
    //         result.forEach(element => {
    //             userData = element
    //         })    
    //         console.log("Befor return ",userData)
    //         ad=userData
    //         console.log("after return",userData)
    //         console.log("ad",ad)
     
    //         return ad
         
    //        // res.render("liststasks", { title: "List Of Tasks", taskData: result,show: true,isStudent:false })
    //     }) 
    // }


    //getAdById, viewAds,
    deleteOneAd: function (id) {
        var newId = mongodb.ObjectId(id)
        var collection = db.collection("ad")
        var filter = {
            "_id": newId
        }
        collection.deleteOne(filter, function (err, result) {
            if (err) {
                console.log("Err in delete ", err)
                return
            }
            console.log("Ad deleted with id : ", id)
        })
    },
    
    viewallads: function (res, id) {
        var collection = db.collection("ad")
        var filter = {
            "userid": id
        }
        collection.find(filter).sort({ createdDateTime: -1 }).toArray(function (err, result) {
            if (err) {
                console.log("Error")
                return
            }
            res.render("listsads", { title: "List Of Ads", taskData: result, isMember: true })
        })
    },
    
    deleteallads: function (res, id) {
        var collection = db.collection("ad")
        var filter = {
            "userid": id
        }

        collection.deleteMany(filter, function (err, result) {
            if (err) {
                console.log("Err in delete ", err)
                return
            }
            console.log("ads deleted with member id : ", id)

        })
        res.redirect("/user/viewad/" + id)

    },
    updateAdView: function (id, res) {
        var collection = db.collection("ad")
        var newId = mongodb.ObjectId(id)
        var filter = {
            "_id": newId
        }
        var adData = null;
        collection.find(filter).toArray(function (err, result) {
            if (err) {
                console.log("err")
                return
            }
            result.forEach(element => {
                adData = element
            })            
            res.render("updatead", { title: "view", data: adData })
        })
    },
    updateAd: function (data, res) {

        var selectedId = data.id
        var collection = db.collection("ad")
        var filter = {
            "_id": mongodb.ObjectId(selectedId)
        }
        var jsonData = {
            $set: {
                title: data.title,
                description: data.description,
                price: data.price,
                createdDateTime: Date.now()
            }
        }
        collection.updateMany(filter, jsonData, function (err, result) {
            if (err) {
                console.log("err in update")
                return
            }
            console.log("ad details updated successfully")
        })
    },
        
    updateimgView: function (id, res) {
        var collection = db.collection("ad")
        var newId = mongodb.ObjectId(id)
        var filter = {
            "_id": newId
        }
        var adData = null;
        collection.find(filter).toArray(function (err, result) {
            if (err) {
                console.log("err")
                return
            }
            result.forEach(element => {
                adData = element
            })
            res.render("updateImg", { title: "view", data: adData })
        })
    }




}
module.exports = {dbController, updateimgAd,insertAd, loginUser, getUserByEmail}