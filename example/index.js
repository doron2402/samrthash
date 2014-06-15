var SmartHash = require('smarthash').SmartHash;
var h = new SmartHash();
var counter = 0;

h.insert({index: 'doron', value: {phone_num: '1'}, ttl: 32, time: 's'});
h.insert({index: 'doron', value: {phone_num: '2'}, ttl: 3200});
h.insert({index: 'doron', value: {phone_num: '3'}, ttl: 33000});
h.insert({index: 'doron', value: {phone_num: '4'}, ttl: 23000});
h.insert({index: 'rachel', value: {phone_num: '5'}, ttl: 32200});
h.insert({index: 'rachel', value: {phone_num: '6'}, ttl: 53000});
h.insert({index: 'doron1', value: {phone_num: '123'}, ttl: 53000});
h.insert({index: 'test@test.com', value: {user_id: '123', email: 'test@test.com', last_login: 1402811273} });
h.insert({index: 'test', value: {user_id: '123', email: 'test@test.com', last_login: 1402811273} });

var recursive = function () {
    counter++;
    console.log("It has been one second!");
    console.log(h.Data);
    setTimeout(recursive,400);
}
recursive();