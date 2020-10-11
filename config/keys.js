/*module.exports = {
    MONGOURI:"mongodb+srv://ramkiran:Bqt0UPeoQVNNxd94@cluster0.lzqgr.mongodb.net/<dbname>?retryWrites=true&w=majority",
    JWT_SECRET: "kjbsjfhgbfgjhb"
}
*/

// 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    it is a sendgrid api key used for sending mails


if(process.env.NODE_ENV==='production'){
    module.exports = require('./prod')
}else{
    module.exports = require('./dev')
}