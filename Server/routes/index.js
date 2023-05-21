const newsRouter = require('./news')
const authRouter = require('./auth')
module.exports = (app) => {
    app.get('/', (req,res,next) => {
        res.redirect('/news')
    })
    app.use('/news', newsRouter)
    app.use('/auth', authRouter)
}
