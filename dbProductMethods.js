
//
//  DB SETUP DONE HERE
//  Mongo is currently set up 
//

const username = "student"
const password = "password1"

const db = require('monk')(`mongodb://${username}:${password}@ds227853.mlab.com:27853/congress`);
const { id } = require('monk')
const productDB = db.get('ecommerce') //product info

//
// Product methods
//
//
//  Objects stored in the DB follow the following structure:
//  {name, desc, price,img, productid(randomnumbers, used for storing in cart. this is set on the server)}
//

 
const getProductByID = async (pid) => {
    //check if PID can be converted to an object id
    if(typeof pid == 'string' && pid.length === 12 || pid.length === 24) {
            const product = await productDB.findOne(id(pid)).catch(err=>{}) //.then(()=> console.log("helpme")).catch(()=> console.log("help"))
            if( product ){
                return [true, product]
            } else {
                return [false, "Product ID not found!"]
            }  
    } else {
        return [false, "Not a PID!"]
    }
}

const getAllProducts = async (pid) => {
    const product = await productDB.find({}) //.then(()=> console.log("helpme")).catch(()=> console.log("help"))
    if( product ){
        return [true, product]
    } else {
        return [false, "Could not found products!"]
    }  
}

const addProductToDB = async (product) => {
    const {name, desc, price, img, category} = product
    let pid = ''
    await productDB.insert({  
                        name, 
                        desc, 
                        price,
                        img, 
                        category }).then ((res) => pid = res._id).catch (err => {console.log(err); return [false, "Unable to insert Product into DB"]})
    return [true, pid]
}

const getProductByWildCard = async (searchparam) => {
    const products = await productDB.find({})
    const filteredProducts = products.filter( (val) => {
        if (val.name.toLowerCase().search(searchparam) != -1 || val.desc.toLowerCase().search(searchparam) != -1 ){
             return true
        } else return false;
    }) 
    if(filteredProducts.length>0) { 
     return [true, filteredProducts]
    } else return [false, "Product not found!"]
}


module.exports = {
    getProductByID,
    addProductToDB,
    getProductByWildCard,
    getAllProducts,
}