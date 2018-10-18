const dbMethods = require('./dbUserMethods')
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
//
//
//

const addProduct = async (res, req) => {
    console.log(await dbMethods.getUser("sfafas@gagsaf"))
}

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
    // const attemptById = await productDBMethods.getProductByID(req.params.id)
    // if(attemptById[0]){
    //     res.status(200).json(attemptById[1]) 
    // } else {
    //     res.status(404).json(attemptById[1]) 
    // } 
}


app.route('/products/:id')
    .get(productByIDGET)
    //.put(productByIDPUT)

app.route('/products/')
    .get(productGET)
    .post(productPOST)
    //.put((req, res) => {res.send("bob")})

    
app.listen(port, async () => console.log("Express listening on port: ", port))

