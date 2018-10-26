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

const productCatGET = async (req, res) => {
    const attemptAdd = await productDBMethods.getProductByCat(req.params.id)
    if(attemptAdd.status){
        res.status(201).json(attemptAdd) 
    } else {
        res.status(400).json(attemptAdd) 
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
        res.status(200).json(attemptGet) 
    } else {
        res.status(400).json(attemptGet) 
    } 
}
const usersPOST = async (req, res) => {

    const attemptCreate = await userDBMethods.AddUserToDB(req.body)
    if(attemptCreate.status){
        res.status(200).json(attemptCreate) 
    } else {
        res.status(400).json(attemptCreate) 
    } 
}
const userByIdGET = async (req, res) => {
    const attemptGet = await userDBMethods.getUserByID(req.params.id)
    if(attemptGet.status){
        res.status(200).json(attemptGet) 
    } else {
        res.status(400).json(attemptGet) 
    } 
}
const userByIdDELETE = async (req, res) => {
    const attemptGet = await userDBMethods.deleteUserByID(req.params.id)
    
    if(attemptGet.status){
        res.status(200).json(attemptGet) 
    } else {
        res.status(400).json(attemptGet) 
    } 
}
const userByIdPUT = async (req, res) => {
    const attemptGet = await userDBMethods.updateUserByID(req.params.id, req.body)
    if(attemptGet.status){
        res.status(200).json(attemptGet) 
    } else {
        res.status(400).json(attemptGet) 
    } 
}
const userLoginPOST = async (req, res) => {
    const attemptGet = await userDBMethods.attemptUserLogin(req.body)
    if(attemptGet.status){
        res.status(200).json({msg:attemptGet, userIsLoggedIn:true}) 
    } else {
        res.status(400).json({msg:attemptGet, userIsLoggedIn:false}) 
    } 
}

//
//  ROUTING
// 

app.route('/products/:id')
    .get(productByIDGET) 
    .put(productByIDPUT) // Pass a JSON object in the body containing any or all of the following properties to update it {name, desc, price,img,}
    .delete(productByIDDELETE) 

app.route('/products/')
    .get(productGET) 
    .post(productPOST) //Pass a JSON object in the body containing all of the following {name, desc, price,img} in order to create an item

app.route('/products/category/:id')
    .get(productCatGET) 

app.route('/users/:id')
    .get(userByIdGET) //GET USER PROFILE INFO (ALSO INCLUDES THEIR PASSWORD)
    .put(userByIdPUT) // UPDATE USER | pass a JSOn object with any of the following to update it {name,emailaddress,password, socialsecurity,mothersmaiden, fears[], cart [], roles[]} 
    .delete(userByIdDELETE) //DELETE USER 

app.route('/users/login/')
     .post(userLoginPOST) //login user | pass a username / pass in the body as a JSON object to get a IsLoggedIn object response back. Use this bool as a login token

app.route('/users/')
    .get(usersGET) //GET ALL USERS
    .post(usersPOST) //CREATE NEW USER post the following JSON object in the body {name,emailaddress,password, socialsecurity,mothersmaiden, fears[], cart [], roles[]} to create a user

app.listen(port, async () => console.log("Express listening on port: ", port))

