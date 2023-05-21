
const { dbConnection } = require('../configurations');
const { userValidator } = require('../validators');
const {hashSync, compareSync} = require('bcryptjs')

class User{
    constructor(userData) {
        this.userData = userData;
    }

    static valid(userData){
        return userValidator.signupSchema.validate(userData)
    }

    static validLogin (loginData){
        return userValidator.loginSchema.validate(loginData)
    }

    static login(loginData){
        return new Promise((resolve, reject) => {
            const validation = User.validLogin(loginData);
            if (validation.error){
                resolve({
                    status: false,
                    message: validation.error.message,
                    code: 400
                })
            }else{
                dbConnection('users', async (collection) => {
                    try {
                        const user = await collection.findOne({
                            email: loginData.email,
                        }, {
                            projection: {firstName:1, lastName: 1, email: 1, password: 1, _id: 1}
                        });

                        if (user){
                            if (compareSync(loginData.password, user.password)) {
                                resolve({
                                    status: true,
                                    data: user
                                })
                            }else {
                                resolve({
                                    status: false,
                                    code: 401,
                                    message: "Login Failed: Incorrect password"
                                })
                            }
                        }else {
                            resolve({
                                status: false,
                                code: 401,
                                message: "Login Failed: email is not exist!"
                            })
                        }


                    }catch (e) {
                        reject({
                            statue: false,
                            message: e.message
                        })
                    }
                })
            }
        })
    }

    add(spy){
           dbConnection('users', async (collection) => {
               try { // handle callback errors with callback
                   this.userData.password = hashSync(this.userData.password);
                   await collection.insertOne(this.userData)
                   spy({
                       status: true
                   })
               }catch (e){
                   console.log(e.message)
                   spy({
                       status: false,
                       messages: e.message
                   })
               }
           })
    }

    isExist(){
        return new Promise( (resolve, reject) => {
            //handling callback with promise
            dbConnection('users', async (collection) => {
                const user = await collection.findOne({
                    '$or': [
                        {email: this.userData.email},
                        {
                            '$and':  [
                                {firstName: this.userData.firstName},
                                {lastName: this.userData.lastName}
                            ]
                        }
                    ]
                });
                if (!user){
                    resolve({
                        existence: false
                    });
                }else{
                    if (user.email === this.userData.email){
                        resolve({
                            existence: true,
                            message: "email is already exist!"
                        })
                    }else {
                        resolve({
                            existence: true,
                            message: "there is a user with the same first and last name!"
                        })
                    }
                }

            })
        })
    }
}
// let data = {
//     firstName: "Braa",
//     lastName: "GH",
//     email: "bra2@gmail.com",
//     password: "123456"
// }
// const user = new User(data);
// user.isExist().then(r => {
//     console.log(r)
// }).catch(e => {
//     console.log(e)
// })



module.exports = User;













