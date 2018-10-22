
//
//  DB SETUP DONE HERE
//  Mongo is currently set up 
//

const username = "student"
const password = "password1"

const db = require('monk')(`mongodb://${username}:${password}@ds227853.mlab.com:27853/congress`);
const { id } = require('monk')
const userDB = db.get('fortKnox') //user info

//
// User methods
//
//
//  Objects stored in the DB follow the following structure:
//  {name,emailaddress,password, socialsecurity,mothersmaiden, fears[], cart [], roles[]} 
//

const getUsers = async () => {       
    const users = await userDB.find({})     
    if (users) {
        return {status:true, msg: users}
    }  else {
        return {status:false, msg:"Unable to access DB!"}
    }  
}

const getUserByID = async (id) => {
    const userlist = await userDB.find({})
    if( userlist ) {
        if( typeof id == 'string') {
                const adjid = id.toLowerCase()
                const user = userlist.reduce( (previous, next ) => {return ( next.emailaddress === adjid || next.username === adjid ) ? next : previous}, null);
                if (user) {
                    return {status:true, msg: user}
                }  else {
                    return {status:false, msg:"Unable to locate user!"}
                } 
        } else {
                const user = userlist.reduce( (previous, next ) => {return ( next.emailaddress === id.username || next.username === id.username || next.emailaddress === id.emailaddress || next.username === id.emailaddress ) ? next : previous}, null);
                if (user) {
                    return {status:true, msg: user}
                }  else {
                    return {status:false, msg:"Unable to locate user!"}
                } 
        } 
    } else {
        return {status:false, msg:"Unable to access DB!"}
    } 
}

const getUserByPassword = async (password) => {
    const userlist = await userDB.find({})
    if( userlist ) {
        const user = userlist.reduce( (previous, next ) => { return (next.password === password ) ? next : previous}, null);
        if (user) {
            return {status:true, msg: user}
        }  else {
            return {status:false, msg:"Password is not in use!"}
        } 
    } else {
        return {status:false, msg:"Unable to access DB!"}
    } 
}

const AddUserToDB = async (userob) => {

    if (!userob.username || !userob.emailaddress || !userob.password){
        return {status:false, msg:"Email/User/Password are all required."}
    }

    const testUser = await getUserByID(userob)
    const usedpass = await getUserByPassword(userob.password)
    
    if( testUser.status ){
        return {status:false, msg:"User exists"}
    } else if(usedpass.status ) {
        return {status:false, msg:`${usedpass.msg.username} is already using that password, please use a different one!`}
    } else {

        let userTemplate = {
            username:'',
            emailaddress:'',
            password:'', 
            socialsecurity:'',
            mothersmaiden:'', 
            fears:[], 
            cart:[], 
            roles:[]
        } 

        for (let prop in userob) { //replace the template
                userTemplate[prop]=userob[prop] 
        } 

        userTemplate.username = userTemplate.username.toLowerCase()
        userTemplate.emailaddress = userTemplate.emailaddress.toLowerCase()

        userDB.insert(userTemplate)
        return {status: true, msg: `User added: ${userTemplate.username} | ${userTemplate.emailaddress}`}
    }
}

const deleteUserByID = async (id) => {
    const theuser = getUserByID(id)
    if( theuser.status ) {
        await userDB.findOneAndDelete(id(theuser.msg._id))
            .catch(err => {console.log(err); return {status:false, msg:"Unable to delete user from DB"}}) 
        return {status:true, msg:"User was deleted!"}
    } else {
        return {status:false, msg:"Unable to locate user!"}
    }
}


const updateUserByID = async (id, updatedobj) => {

    const olduser = getUserByID(id)

    if( olduser.status ) {
        
        // loop through and set the updated fields
        for( let prop in updatedobj) {
            olduser.msg[prop] = updatedobj[prop]
        }

        const {username, emailaddress, password, socialsecurity, mothersmaiden, fears, cart, roles} = olditem[1]

        await productDB.findOneAndUpdate(id(olduser.msg._id), {$set: {username, emailaddress, password, socialsecurity, mothersmaiden, fears, cart, roles}})
            .catch(err => {console.log(err); return [false, "Unable to update User into DB"]}) 
        return {status:true, msg:"User was updated!"}
    } else {
        return {status:false, msg:"Unable to locate user!"}
    }
}

const attemptUserLogin = async (logininfo) => {

    const theuser = await getUserByID(logininfo.username)
    console.log( theuser )
    console.log( logininfo )
    if( theuser.status ) {
      if( theuser.msg.password == logininfo.password ) {
        return {status:true, msg:"Password correct!"}
      } else {
        return {status:false, msg:"Password incorrect!"}
      }
    } else {
      return {status:false, msg:"Unable to locate user!"}
    }
}

module.exports = {
    getUsers,
    getUserByID,
    getUserByPassword,
    AddUserToDB,
    deleteUserByID,
    updateUserByID,
    attemptUserLogin,
}