const db = require('../config/connection')
const collection = require('../config/collection')
const objectId = require('mongodb').ObjectId

module.exports = {
    addGames: (game, callBack) => {
        db.get().collection(collection.GAME_COLLECTION).insertOne(game).then((data) => {
            callBack(data.insertedId)
        })
    },
    allGames: () => {
        return new Promise(async (resolve, reject) => {
            let games = await db.get().collection(collection.GAME_COLLECTION).find().toArray()
            resolve(games)
            reject('Error in view all games')
        })
    },
    deleteGame: (gameId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.GAME_COLLECTION).remove({ _id: objectId(gameId) }, 1)
                .then((res) => {
                    resolve(res)
                })
        })
    },
    getGameDetails: (getId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.GAME_COLLECTION).findOne({ _id: objectId(getId) })
                .then((product) => {
                    resolve(product)
                })
        })
    },
    updateGame: (gameId, gameDetails) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.GAME_COLLECTION).updateOne({ _id: objectId(gameId) },
                {
                    $set: {
                        gameName: gameDetails.gameName,
                        gameTitle: gameDetails.gameTitle,
                        gamePrice: gameDetails.gamePrice
                    }
                }).then((res) => {
                    resolve()
                })
        })
    },
    doLogin: (adminData) => {
        return new Promise(async (resolve, reject) => {
            let response = {
                admin : null,
                err : null,
                status : false
            }
            let admin = await db.get().collection(collection.ADMIN_COLLECTION).findOne({ userName: adminData.userName })
            if (admin) {
                if(admin.password === adminData.password){
                  response.admin = admin
                  response.status = true
                  resolve(response)
                }else{
                    response.err = 'incorrect password !'
                    resolve(response)
                }
            } else {
                response.err = 'incorrect User name !'
                reject(response)
            }
        })
    },

    // users  //

    allUsers:() => {
        return new Promise(async (resolve, reject) => {
            let users = await db.get().collection(collection.USER_COLLECTION).find().toArray()
            resolve(users)
            reject('Error in view all games')
        })
    },
    deleteUser: (userId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).remove({ _id: objectId(userId) }, 1)
                .then(() => {
                    resolve()
                })
        })
    },
    getUserDetails: (getId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).findOne({ _id: objectId(getId) })
                .then((details) => {
                    resolve(details)
                })
        })
    },
    updateUser: (userId, userDetails) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).updateOne({ _id: objectId(userId) },
                {
                    $set: {
                        fullName: userDetails.fullName,
                        email: userDetails.email,
                        userName: userDetails.userName
                    }
                }).then((res) => {
                    resolve()
                })
        })
    }
}