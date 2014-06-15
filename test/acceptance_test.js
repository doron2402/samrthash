var assert = require('assert');
var should = require('should');
var moment = require('moment');
var SmartHash = require('smarthash').SmartHash;
var h;

describe("SmartHash acceptance test", function() {
    describe("SmartHash - insert some fake data", function(){
        before(function(done){
            h = new SmartHash();
            h.insert({index: 'doron', value: {phone_num: '1'}, ttl: 1, time: 's'});
            h.insert({index: 'doron', value: {phone_num: '2'}, ttl: 3200});
            h.insert({index: 'doron', value: {phone_num: '3'}, ttl: 33000});
            h.insert({index: 'doron', value: {phone_num: '4'}, ttl: 23000});
            h.insert({index: 'rachel', value: {phone_num: '5'}, ttl: 32200});
            h.insert({index: 'rachel', value: {phone_num: '6'}, ttl: 53000});
            h.insert({index: 'doron1', value: {phone_num: '123'}, ttl: 53000});
            h.insert({index: 'test@test.com', value: {user_id: '123', email: 'test@test.com', last_login: 1402811273} });
            h.insert({index: 'test', value: {user_id: '123', email: 'test@test.com', last_login: 1402811273} });
            done();
        });

        after(function(done){
            delete h;
            done();
        });

        it("user 'doron' should be found in hash", function(done){
            h.fetch({index: 'doron'}, function(err, result){
                assert.ok(result.value);
                assert.ok(result.value.phone_num);
                assert.equal(result.value.phone_num, '1');
                done();
            });
        });

        it("user 'doron' should BE found in hash after 0.5 second", function(done){
            setTimeout(function(){
                assert.ok(h.Data['doron']);
                assert.equal(h.Data['doron'].value.phone_num, '1');
                done();
            }, 500);
        });

        it("user 'doron' should not be found in hash after 1.5 second", function(done){
            setTimeout(function(){
                h.fetch({index: 'doron'}, function(err, result){
                    assert.equal(result, undefined);
                    assert.equal(err, undefined);
                    done();
                });
            }, 1500);
        });

        it("index: test@test.com should not have ttl", function(done){
            h.fetch({index: 'test@test.com'}, function(err, result){
                assert.ok(result);
                assert.equal(result.value.user_id, '123');
                assert.equal(result.value.email, 'test@test.com');
                assert.equal(result.ttl, undefined);
                done();
            });
        });
    });
});