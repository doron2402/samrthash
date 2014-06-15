var SmartHash = require('smarthash').SmartHash;


var h = new SmartHash();
h.insert({index: 'doron', value: {phone_num: '1'}, ttl: 32, time: 's'});
h.insert({index: 'doron', value: {phone_num: '2'}, ttl: 3200});
h.insert({index: 'doron', value: {phone_num: '3'}, ttl: 33000});
h.insert({index: 'doron', value: {phone_num: '4'}, ttl: 23000});
h.insert({index: 'rachel', value: {phone_num: '5'}, ttl: 32200});
h.insert({index: 'rachel', value: {phone_num: '6'}, ttl: 53000});

var recursive = function () {
    console.log("It has been one second!");
    console.log(h.Data);
    h.fetch({index: 'doron'}, function(err, result){
        if (err)
            console.log(err);
        if (result)
            console.log(result);
    });
    setTimeout(recursive,400);
}
recursive();