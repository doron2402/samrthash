var SmartHash = require('smarthash').SmartHash;


var h = new SmartHash();
h.insert({index: 'doron', value: {phone_num: '1'}, ttl: 200});
h.insert({index: 'doron', value: {phone_num: '2'}, ttl: 200});
h.insert({index: 'doron', value: {phone_num: '3'}, ttl: 200});
h.insert({index: 'doron', value: {phone_num: '4'}, ttl: 200});
h.insert({index: 'rachel', value: {phone_num: '5'}, ttl: 200});
h.insert({index: 'rachel', value: {phone_num: '6'}, ttl: 200});
console.log(h.fetch({index: 'doron'}));
console.log(h.fetch({index: 'rachel'}));
console.log(h.Data);
setTimeout(function(){
    console.log(h.Data);
}, 100);
setTimeout(function(){
    console.log(h.Data);
}, 400);
setTimeout(function(){
    console.log(h.Data);
}, 800);
