const mongoose = require('mongoose')

const stocksSchema = new mongoose.Schema({
    id:{
        type: String,
    },
    trade_type: {
        type: String,
    },
    quantity: {
        type: String,
    },
    price:{
        type: String,
    }
})

module.exports = mongoose.model('stocksdetails',stocksSchema);