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
        if (self.Data[item] && self.Data[item].ttl !== null && self.Data[item].ttl <= moment().utc().unix()){
            self.remove({index: item},callback);
        }else {
            callback(); // tell async that the iterator has completed
        }
    }, function(err) {
        cb(err);
    });

};

//args = {index: , value: , ttl: , time: ms/s/m/h/d/w}
Hash.prototype.insert = function(args, cb) {
    var self = this;
    var time = args.time ? args.time : 'ms';
    async.series({
        validate_args: function(callback){
            if (!args || !args.value) {
               callback(Errors.MissingParams,null);
            } else {
                callback(null, true);
            }
        },
        check_if_index_is_used: function(callback){
            if (!args.index){
                args.index = self.generateIndex
            } else if (args.index && self.fetch(args) != null) {

            } else {
                callback(args.index);
            }
        }
    },
    function(err, results) {
        // results is now equal to: {one: 1, two: 2}
    });



    //check if this index is taken
    if (!args.index || this.checkIfIndexExist(args)){
        args.index = this.generateIndex();
        console.log(args.index);
    }
    console.log(args.index);





    this.checkTtlValue(function(err){
        self.Data[args.index] = {
            value: args.value,
            ttl: moment().add(time,args.ttl).utc().unix() || null
        };
        console.log('self.Data...............');
        console.log(self.Data);
        console.log('self.Data....................');
        self.size = this.size + 1;
        return cb(null, self.Data[args.index]);
    });
};

//args = {index: }
Hash.prototype.fetch = function(args) {

    if (!args || !args.index) {
        throw new Error(Errors.MissingParams);
    }

    if (this.size == 0){
        return null;
    }

    var self = this;
    this.checkTtlValue(function(err){
        if (!self.Data || !self.Data[args.index] || !self.Data[args.index].value){
            return null;
        }else {
            self.size = this.size - 1;
            return self.Data[args.index].value;
        }
    });
};

//args = {index: }
Hash.prototype.remove = function(args,cb) {

    if (!args || !args.index) {
        throw new Error(Erros.MissingParams);
    }
    var index = args.index;
    delete this.Data[index];
    cb(null,index);
};


Hash.prototype.generateIndex = function() {
    var self = this;
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
            if (self.fetch({index: new_index}) == null){
                return new_index;
            }

            self.checkIfIndexExist({index: new_index} , function(err, res){
                check = res;
            });
            console.log(check);
        }
        return new_index;
    }else {
        return new_index;
    }
};

Hash.prototype.checkIfIndexExist = function(args, cb) {
    console.log(args);
    if (!args || !args.index){
        throw new Error(Errors.MissingParams);
    }

    if (this.fetch(args) === null){
        return cb(null, false);
    }
    else{
        return cb(null, true);
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