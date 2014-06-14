var Errors = require('./error');
var async = require('async');
var moment = require('moment');
var Hash = function(){
    this.size = 0;
    this.Data = {};
};

Hash.prototype.checkTtlValue = function(cb){
    if (this.size == 0) {
        return cb();
    }
    var self = this;
    async.forEach(Object.keys(this.Data), function (item, callback){
        console.log(self.Data[item]); // print the key
        if (self.Data[item] && self.Data[item].ttl !== null && self.Data[item].ttl < moment.utc().unix()){
            self.remove({index: item});
            callback(); // tell async that the iterator has completed
        }else {
            callback(); // tell async that the iterator has completed
        }


    }, function(err) {
        console.log('iterating done');
        cb(err);
    });

};

//args = {index: , value: , ttl: , time: ms/s/m/h/d/w}
Hash.prototype.insert = function(args) {
    var self = this;
    var time = args.time ? args.time : 'ms';

    if (!args || !args.value) {
        throw new Error(Errors.MissingParams);
    }

    //check if this index is taken
    if (!args.index || this.checkIfIndexExist({index: args.index})){
        args.index = this.generateIndex();
    }

    this.checkTtlValue(function(err){
        self.Data[args.index] = {
            value: args.value,
            ttl: moment().add(time,args.ttl).utc().unix() || null
        };

        self.size = this.size + 1;
        return;
    });
};

//args = {index: }
Hash.prototype.fetch = function(args) {

    if (!args || !args.index) {
        throw new Error(Errors.MissingParams);
    }
    var self = this;
    this.checkTtlValue(function(err){
        console.log('check ttl 2');
        console.log(err);
        if (!self.Data || !self.Data[args.index] || !self.Data[args.index].value){
            return null;
        }else {
            self.size = this.size - 1;
            return self.Data[args.index].value;
        }
    });

};

//args = {index: }
Hash.prototype.remove = function(args) {
    if (!args || !args.index) {
        throw new Error(Erros.MissingParams);
    }
    delete this.Data[args.index];
};


Hash.prototype.generateIndex = function() {
    var new_index = Math.abs(Math.round(Math.random() * 1000 * (new Date().getTime())));
    var check = this.checkIfIndexExist({index: new_index});
    if (check){
        var counter = 10;
        while(check){
            counter--;
            if (counter == 0){
                throw new Error(Errors.GenerateNewIndex);
            }
            new_index = Math.abs(Math.round(Math.random() * 10000 * (new Date().getTime())));
            check = this.checkIfIndexExist({index: new_index});
        }
        return new_index;
    }else {
        return new_index;
    }
};

Hash.prototype.checkIfIndexExist = function(args) {
    if (!args || !args.index){
        throw new Error(Errors.MissingParams);
    }

    if (!this.fetch(args)){
        return false;
    }
    else{
        return true;
    }
}

//return last value - look for last value
Hash.prototype.getLastValueInserted = function() {

};

//return (int)
Hash.prototype.getSize = function() {

};

//args = {index: , ttl: };
Hash.prototype.setTimeToLive = function(args) {
    if (!args || !args.index){
        throw new Error(Errors.MissingParams);
    }
};

//args = {index: (int) }
Hash.prototype.getValueByIndex = function(args) {
    // body...
};

module.exports = Hash;