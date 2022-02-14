const express = require('express');
const app = express();
const connectToMongo = require('./db');
const stocksModel = require('./models/stocks');
const cors = require('cors');

connectToMongo();

app.use(express.json());
app.use(cors());

app.get('/getStock', (req, res)=>{
    stocksModel.find({},(err,result)=>{
        if(err){
            res.json(err);
        }else{
            res.json(result);
        }
    });
});

let averagePrice = 0;
let totalStock = 0;

app.post('/createStock', async(req, res)=>{
    const stquantity = [];
    const stprice = [];

    for (let index = 1; index < req.body.length; index++) {
        let id = req.body[index][0];
        let trade_type = req.body[index][1];
        let quantity = req.body[index][2];
        let price = req.body[index][3];

        
        if (trade_type === "BUY") {
            totalStock += parseInt(quantity);
            stquantity.push(parseInt(quantity));
            stprice.push(parseInt(price)); 
        }else if (trade_type === "SELL") {
            totalStock -= parseInt(quantity); 
        }

        const details = {id: id, trade_type: trade_type, quantity: quantity,price: price};
        const newDetails = new stocksModel(details);
        await newDetails.save();
    }
    let stock = totalStock;
    for (let index = stprice.length-1; index >= 1; index--) {
        if (stquantity[index]<=stock) {
            averagePrice += stprice[index]*stquantity[index];
            stock-=stquantity[index];
        }
        else{
            averagePrice += stprice[index]*stock;
            break;
        }
    }
    averagePrice = averagePrice/totalStock;
    res.json({
        averagePrice:averagePrice,
        totalStock:totalStock
    })
})

const deleteStock = async() =>{
    try {
        const result = await stocksModel.deleteMany({});
        console.log(result);
    } catch (error) {
        console.error(error);
    }
}

app.delete('/reset',async(req,res)=>{
    try {
        const result = await stocksModel.deleteMany({});
        totalStock = 0;
        averagePrice = 0;
        res.status(200).json({
            totalStock: totalStock,
            averagePrice: averagePrice
        })
    } catch (error) {
        console.error(error);
    }
})

app.listen(8080,()=>{
    console.log('listening on port 8080');
})