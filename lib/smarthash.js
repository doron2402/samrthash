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
        validate_args: function(callback) {
            if (!args || !args.value) {
               callback(Errors.MissingParams,null);
            } else {
                callback(null, true);
            }
        },
        check_if_index_is_used: function(callback) {
            if (!args.index){
                args.index = self.generateIndex();
            } else {
                self.fetch(args, function(err, result){
                    if (result == null){
                        callback(null,args.index);
                    }
                    else {
                        args.index = self.generateIndex();
                        callback(null,args.index);
                    }
                });
            }
        },
        update_hash_size: function(callback) {
            self.size++;
            callback(null, self.size);
        },
        insert_value: function(callback) {
            self.Data[args.index] = {
                value: args.value,
                ttl: moment().add(time,args.ttl).utc().unix() || null
            };
            callback(null,args.index);
        },
        check_ttl_index: function(callback) {
            self.checkTtlValue(function(err) {
                callback(err, null);
            });
        }
    },
    function(err, results) {
        if (err) {
            console.log(err);
        }
        if (typeof(cb) == 'function'){
            return cb(err, self.Data[results.insert_value]);
        } else {
            return self.Data[results.insert_value];
        }
    });
};

//args = {index: }
Hash.prototype.fetch = function(args, cb) {
    var self = this;
    async.series({
        validate_args: function(callback) {
            if (!args || !args.index) {
                callback('need an index to fetch', null);
            }
            callback(null, null);
        },
        check_hash_size: function(callback) {
            if (self.size == 0){
                callback('Hash is empty', null);
            }
            callback(null, null);
        },
        fetch: function(callback) {
            if (self.Data[args.index]) {
                callback(null,args.index);
            }else {
                callback(null,null);
            }
        },
        check_ttl_index: function(callback) {
            self.checkTtlValue(function(err) {
                callback(err, null);
            });
        }
    },
    function(err, results) {
        if (err) {
            console.log(err);
        }
        if (typeof(cb) == 'function') {
            return cb(err, self.Data[results.fetch]);
        } else {
            return self.Data[results.fetch];
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
    var check;
    var new_index = Math.abs(Math.round(Math.random() * 1000 * (new Date().getTime())));

    if (self.fetch({index: new_index}) === null) {
        check = true;
    }else {
        check = false;
    }

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