# SmartHash.js

## RELEASE NOTES:

0.0.1 - First version :) June 14, 2014

SmartHash is a utility module which provides straight-forward, powerful hash tool
that able you to:
a. insert data.
b. fetch data.
c. check if data exist.
d. generate dynamic index.
e. set TTL to each of the value.
f. set TTL `ms`, `s` - seconds, `m` - minutes, `h` - hour, `d` - days, `w` - week


## Quick Examples
```
var SmartHash = require('smarthash').SmartHash;


var h = new SmartHash();
h.insert({index: 'doron', value: {phone_num: '1'}, ttl: 32, time: 's'}); //index doron, ttl 32 second
h.insert({index: 'doron', value: {phone_num: '2'}, ttl: 1, time: 'h'}); //index doron is taken generate new one, ttl 1 hour
h.insert({index: 'doron', value: {phone_num: '3'}, ttl: 33000}); //index doron is taken generate new one
h.insert({index: 'doron', value: {phone_num: '4'}, ttl: 23000}); //index doron is taken generate new one
h.insert({index: 'rachel', value: {phone_num: '5'}, ttl: 32200}); //index rachel - ttl 32200 ms
h.insert({index: 'rachel', value: {phone_num: '6'}, ttl: 53000}); //index rachel is taken generate new one ttl 53000ms

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
```

## Common Pitfalls

## Download
The source is available for download from
[GitHub](https://github.com/doron2402/samrthash).
[NPM](https://www.npmjs.org/package/smarthash).

you can install it using `npm i smarthash`

## Dependacies

a. Moment.js
b. async