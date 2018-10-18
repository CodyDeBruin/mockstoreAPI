
//
//  DB SETUP DONE HERE
//  Mongo is currently set up 
//

const username = "student"
const password = "password1"

const db = require('monk')(`mongodb://${username}:${password}@ds227853.mlab.com:27853/congress`);
const productDB = db.get('ecommerce') //product info
const userDB = db.get('fortKnox') //user info

//
// USER METHODS
//

const getUser = async (userid) => {
    const users = await userDB.find({})
    return users.reduce( (prev, next) => {return next.username == userid || next.emailaddress == userid ? next : prev} , null)
}



const createUser = async (newuser) => {
   const {username,emailaddress,password,activeCart} = newuser
}



module.exports = {
    getUser,
}