var request = require('request');

// select * from html where url='https://tw.dictionary.yahoo.com/dictionary?p=女朋友' and xpath='//span[@id=\'term\'] | //div[contains(@class, \'explain\')]'

// https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D'https%3A%2F%2Ftw.dictionary.yahoo.com%2Fdictionary%3Fp%3Djizz'%20and%20xpath%3D'%2F%2Fspan%5B%40id%3D%5C'term%5C'%5D%20%7C%20%2F%2Fdiv%5Bcontains(%40class%2C%20%5C'explain%5C')%5D'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys

var queryWord = "girlfriend";
//var queryWord = "taiwan";
//var queryWord = "女朋友";
//var queryWord = "work";

var queryDictionary = function(word, callback) {
    var encodedQueryWord = encodeURIComponent(word);
    //console.log("q:"+word);
    //console.log("->"+encodedQueryWord);
    
    var queryURL = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D'https%3A%2F%2Ftw.dictionary.yahoo.com%2Fdictionary%3Fp%3D" + encodedQueryWord + "'%20and%20xpath%3D'%2F%2Fspan%5B%40id%3D%5C'term%5C'%5D%20%7C%20%2F%2Fdiv%5Bcontains(%40class%2C%20%5C'explain%5C')%5D'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
    //console.log(queryURL);
    var defaultResult = {
        "q": word
    };

    request(queryURL, function(error, response, body){
   
        if (error) {
            callback(true, defaultResult); 
        } else if (response.body.error) {
            callback(true, defaultResult);
        } else {
            var error = false;
            var result;
            try {
                result = JSON.parse(body);
                result = result["query"]["results"];
            } catch (e) {
                console.log("QAQ");
                error = true;
                callback(true, defaultResult);
            }
            if (!error && result) {
                //console.log(result); 
                var resultWord = result["span"]["content"];
                var explains = result["div"];
                if (explains) {
                    var a = explains["div"];
                    var b = {};
                    var c = explains["ul"];
                    var d = "";
                    var e = [];
                    if (a) {
                        if (a[0] === undefined) {
                            var n = a["h3"]["span"]["content"];
                            if (n) {
                                b[0] = n;
                            }
                        } else {
                            for (var i = 0; i < a.length; i++) {
                                var gg = a[i];
                                var n = gg["h3"]["span"]["content"];
                                if (n) {
                                    b[i] = n;
                                }
                            } 
                        }
                        //console.log(b);
                    }

                    if (c) {
                        if (c[0] === undefined) {
                            c = [c];
                        }
                        for (var i = 0; i < c.length; i ++) {
                            var gg = c[i];
                            gg = gg["li"];
                            if (b && b[i] && gg) {
                                d = d + b[i] + "\n";
                            }
                            //console.log(gg);
                            if (gg[0] == undefined) {
                                gg = [gg];
                            }
                            //console.log(gg);
                            for (var j = 0; j < gg.length; j++ ) {
                                var jizz = gg[j]["h4"];
                                //console.log(jizz);
                                if (jizz) {
                                    d = d + jizz + "\n";
                                } 
                            }
                            e.push(d);
                            d = "";
                        }
                        //console.log(c);
                    
                    }
                    //console.log(d);
                    //console.log(e);
                }

                defaultResult["r"] = resultWord;
                defaultResult["e"] = e;
                //console.log(defaultResult);
                callback(false, defaultResult);
            } else {
                callback(true, defaultResult);
            }
        }
    });
};

// test
/*
queryDictionary(queryWord, function(error, result){

    //console.log("callback called");
    if (error) {
        console.log("GG");
    } else {
    
    }

});
*/

module.exports = {
    "queryDictionary": queryDictionary
};
