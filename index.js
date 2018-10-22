const userDBMethods = require('./dbUserMethods')
const productDBMethods = require('./dbProductMethods')

//
//  EXPRESS CONNECTION / SETUP DONE HERE
// 
// 
//
//

const cors = require('cors')
const express = require('express')
const app = express()
const port = 443

//middleware, parses json body into the req.body property
app.use(express.json());
app.use(cors())

//
//
//  PRODUCT RESPONSES
//
//
const productPOST = async (req, res) => {

    const attemptAdd = await productDBMethods.addProductToDB(req.body)

    if(attemptAdd[0]){
        res.status(201).json(attemptAdd[1]) 
    } else {
        res.status(400).json(attemptAdd[1]) 
    }
  
}
const productGET = async (req, res) => {

    //gets all products
    const attemptGet = await productDBMethods.getAllProducts()

    if(attemptGet[0]){
        res.status(200).json(attemptGet[1]) 
    } else {
        res.status(400).json(attemptGet[1]) 
    }
  
}
const productByIDGET = async (req, res) => {
    const attemptById = await productDBMethods.getProductByID(req.params.id.toLowerCase()).catch(err=>console.log(err))

    if(attemptById[0]){
        res.status(200).json(attemptById[1]) 
    } else {
        
        const attemptByWildCard = await productDBMethods.getProductByWildCard(req.params.id.toLowerCase()).catch(err=>console.log(err))

        if (attemptByWildCard[0]){ 
             res.status(200).json(attemptByWildCard[1]) 
        } else {
            res.status(404).json(attemptByWildCard[1]) 
        }
    }
}
const productByIDPUT = async (req, res) => {
    const attemptById = await productDBMethods.updateProductByID(req.params.id, req.body)
    if(attemptById[0]){
        res.status(200).json(attemptById[1]) 
    } else {
        res.status(404).json(attemptById[1]) 
    } 
}
const productByIDDELETE = async (req, res) => {
    const attemptById = await productDBMethods.deleteProductByID(req.params.id)
    if(attemptById[0]){
        res.status(200).json(attemptById[1]) 
    } else {
        res.status(404).json(attemptById[1]) 
    } 
}
//
//
//  USER RESPONSES
//
//
const usersGET = async (req, res) => {

    const attemptGet = await userDBMethods.getUsers()
    if(attemptGet.status){
        res.status(200).json(attemptGet.msg) 
    } else {
        res.status(400).json(attemptGet.msg) 
    } 
}
const usersPOST = async (req, res) => {

    const attemptCreate = await userDBMethods.AddUserToDB(req.body)
    if(attemptCreate.status){
        res.status(200).json(attemptCreate.msg) 
    } else {
        res.status(400).json(attemptCreate.msg) 
    } 
}
const userByIdGET = async (req, res) => {
    const attemptGet = await userDBMethods.getUserByID(req.params.id)
    if(attemptGet.status){
        res.status(200).json(attemptGet.msg) 
    } else {
        res.status(400).json(attemptGet.msg) 
    } 
}
const userByIdDELETE = async (req, res) => {
    const attemptGet = await userDBMethods.deleteUserByID(req.params.id.toLowerCase())
    if(attemptGet.status){
        res.status(200).json(attemptGet.msg) 
    } else {
        res.status(400).json(attemptGet.msg) 
    } 
}
const userByIdPUT = async (req, res) => {
    const attemptGet = await userDBMethods.updateUserByID(req.params.id, req.body)
    if(attemptGet.status){
        res.status(200).json(attemptGet.msg) 
    } else {
        res.status(400).json(attemptGet.msg) 
    } 
}
const userLoginPOST = async (req, res) => {
    const attemptGet = await userDBMethods.attemptUserLogin(req.body)
    if(attemptGet.status){
        res.status(200).json({msg:attemptGet.msg, userIsLoggedIn:true}) 
    } else {
        res.status(400).json({msg:attemptGet.msg, userIsLoggedIn:false}) 
    } 
}

//
//  ROUTING
// 

app.route('/products/:id')
    .get(productByIDGET)
    .put(productByIDPUT)
    .delete(productByIDDELETE)

app.route('/products/')
    .get(productGET)
    .post(productPOST)


app.route('/users/:id')
    .get(userByIdGET) //GET USER PROFILE INFO (ALSO INCLUDES THEIR PASSWORD)
    .put(userByIdPUT) // UPDATE USER
    .delete(userByIdDELETE) //DELETE USER 

app.route('/users/login/')
     .post(userLoginPOST) //login user

app.route('/users/')
    .get(usersGET) //GET ALL USERS
    .post(usersPOST) //CREATE NEW USER

app.listen(port, async () => console.log("Express listening on port: ", port))

