const db = require('../config/connection')
const collection = require('../config/collection')
const bcrypt = require('bcrypt')

module.exports = {
    doSignup:(userData) => {
        return new Promise( async(resolve,reject) => {
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({userName:userData.userName})
            let state ={
                user : null,
                userExist : false
            }
            if(!user){
                userData.password = await bcrypt.hash(userData.password,10)
                db.get().collection(collection.USER_COLLECTION).insertOne(userData).then(() => {
                    state.user = userData
                    resolve(state)
                })
            }else{
                state.userExist =true
                resolve(state)
            }
        })
    },
    doLogin:(userData) => {
        return new Promise(async(resolve,reject) => {
            let response = {}
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({userName:userData.userName})
            if(user){
                bcrypt.compare(userData.password,user.password).then((status) => {
                    if(status){
                        response.user = user
                        response.status = true
                    }else{
                        response.err = 'Incorrect Password'
                        response.status = false
                    }
                    resolve(response)
                })
            }else{
                response.err = 'Invalid ID Please create account'
                reject(response)
            }
        })
    }
}