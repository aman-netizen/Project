const mongoose = require('mongoose')
const stocksModel = require('./models/stocks');

const MongoURL = 'mongodb://localhost:27017/newproject';

const connectToMongo = ()=>{
    mongoose.connect(MongoURL,()=>{
        console.log('connected to mongoDB');
    })
}


module.exports = connectToMongo;