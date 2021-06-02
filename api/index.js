var express = require('express');
var r = express.Router();

// load pre-trained model
const model = require('./sdk/model.js');

// Bot Setting
const TelegramBot = require('node-telegram-bot-api');
const token = '1453271226:AAElPSXVwocc2cqEKZN6ymuyFZoyzmbzggU'
const bot = new TelegramBot(token, {polling: true});


// bots
bot.onText(/\/start/, (msg) => { 
    console.log(msg)
    bot.sendMessage(
        msg.chat.id,
        `Assalamualaikum ${msg.chat.first_name}, have a nice day everyone!\n
        click  /predict to know about i and v`
    );   
});


state = 0;
bot.onText(/\/predict/, (msg) => { 
    bot.sendMessage(
        msg.chat.id,
        `input nilai i|v contohnya 4|3`
    );   
    state = 1;
});

bot.on('message', (msg) => {
    if(state == 1){
        s = msg.text.split("|");
        i = parseFloat(s[0])
        r = parseFloat(s[1])
        model.predict(
            [
                i, // string to float
                r
            ]
        ).then((jres)=>{
            v = jres[0]
            p = jres[1]
            
            cls_model.classify([i, r, v, p]).then((jres2)=>{
                          
            bot.sendMessage(
                    msg.chat.id,
                    `nilai v yang diprediksi adalah ${v} volt`
             );   
            bot.sendMessage(
                    msg.chat.id,
                    `nilai p yang diprediksi adalah ${p} watt`
             );
            bot.sendMessage(
                    msg.chat.id,
                    `klasifikasi Tegangan ${jres2}`
                  );   
             })
        })
    }else{
        state = 0
    }
})

// routers
r.get('/classify/:i/:r', function(req, res, next) {    
    model.predict(
        [
            parseFloat(req.params.i), // string to float
            parseFloat(req.params.r)
        ]
    ).then((jres)=>{
        res.json(jres);
    })
});

// routers
r.get('/prediction/:i/:r', function(req, res, next) {    
    model.predict(
        [
            parseFloat(req.params.i), // string to float
            parseFloat(req.params.r)
        ]
    ).then((jres)=>{
        cls_model.classify(
            [
                parseFloat(req.params.i), // string to float
                parseFloat(req.params.r),
                parseFloat(jres[0]),
                parseFloat(jres[1])
            ]  
        ).then((jres)=>{
            res.json(jres_)
        })
    })
});

module.exports = r;
