var SmartHash = require('smarthash').SmartHash;


var h = new SmartHash();
h.insert({index: 'doron', value: {phone_num: '1'}, ttl: 3200});
h.insert({index: 'doron', value: {phone_num: '2'}, ttl: 3200});
h.insert({index: 'doron', value: {phone_num: '3'}, ttl: 33000});
h.insert({index: 'doron', value: {phone_num: '4'}, ttl: 23000});
h.insert({index: 'rachel', value: {phone_num: '5'}, ttl: 32200});
h.insert({index: 'rachel', value: {phone_num: '6'}, ttl: 53000});
console.log(h.fetch({index: 'doron'}));
console.log(h.fetch({index: 'rachel'}));
console.log(h.Data);
var recursive = function () {
    console.log("It has been one second!");
    console.log(h.Data);
    console.log(h.fetch({index: 'doron'}));
    setTimeout(recursive,200);
}
recursive();