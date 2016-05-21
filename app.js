var express = require('express');
var app = express();

var request = require('request');
var bodyParser = require('body-parser');
var https = require('https');
var http = require('http');
var fs = require('fs');

var yd = require('./yd');
var libGFConfig = require("./config");

// Add middleware
// for parsing application/json
app.use(bodyParser.json());

// GET
app.get('/', function(req, res){
    // just let me know server is working
    res.send('libGirlfriendFramework is work. ^_^');
    console.log('yo /');
    // test send message directly
    sendTextMessage(libGFConfig.masterId, "首頁被戳了喔:p");
});

// GET webhook for fb
app.get('/webhook/', function(req, res){
    console.log('/webhook/ did get');
    if (req.query['hub.verify_token'] === libGFConfig.verifyToken) {
        res.send(req.query['hub.challenge']);
    }
    res.send('Error, wrong validation token');
});

app.post('/webhook/', function (req, res) {
    console.log('webhook did post');
    if (req.body) {
        //console.log(req.body);
        messaging_events = req.body.entry[0].messaging;
        for (i = 0; i < messaging_events.length; i++) {
            event = req.body.entry[0].messaging[i];
            sender = event.sender.id;
            console.log(event);
            if (event.message && event.message.text) {
                text = event.message.text;
                // Handle a text message from this sender
                console.log('message received');
                console.log(text);
                sendTextMessage(sender, "嗯嗯");
                if (text == "--help") {
                    sendGenericMessage(sender); 
                } else {
                    yd.queryDictionary(text, function(error, result){
                        if (error) {
                            sendTextMessage(sender, "妹子知道，但妹子不說。");
                        } else if (result.e && result.e.length > 0){
                            for (var i = 0 ;i < result.e.length; i++) {
                                sendTextMessage(sender, result.e[i]);
                            } 
                        } else {
                            sendTextMessage(sender, "妹子知道，但妹子不說>///<");
                        } 
                    });
                }
                //sendTextMessage(sender, "呵\n呵");
                //sendTextMessage(sender, "洗澡掰");
                //sendTextMessage(sender, "現在時間：" + new Date());
            }
        }

    }
    res.sendStatus(200);
});

function sendTextMessage(sender, text) {
    messageData = {
        text:text
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:libGFConfig.accessToken},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
}

function sendGenericMessage(sender) {
    messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "First card",
                    "subtitle": "Element #1 of an hscroll",
                    "image_url": "http://messengerdemo.parseapp.com/img/rift.png",
                    "buttons": [{
                        "type": "web_url",
                        "url": "https://www.messenger.com/",
                        "title": "Web url"
                    }, {
                        "type": "postback",
                        "title": "Postback",
                        "payload": "Payload for first element in a generic bubble",
                    }],
                },{
                    "title": "Second card",
                    "subtitle": "Element #2 of an hscroll",
                    "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
                    "buttons": [{
                        "type": "postback",
                        "title": "Postback",
                        "payload": "Payload for second element in a generic bubble",
                    }],
                }]
            }
        }
    };
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:libGFConfig.accessToken},
        method: 'POST',
        json: {
            recipient: {id:sender},
        message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
}


var options = {
    key: fs.readFileSync(libGFConfig.keyPath),
    cert: fs.readFileSync(libGFConfig.certPath)
};

https.createServer(options,app).listen(3000);

// send message to @qcl eachtime
sendTextMessage(libGFConfig.masterId, "May the force be with you");

