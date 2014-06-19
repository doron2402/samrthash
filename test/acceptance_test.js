var assert = require('assert');
var should = require('should');
var moment = require('moment');
var SmartHash = require('smarthash').SmartHash;
var h;

describe("SmartHash acceptance test", function() {
    var size;
    before(function(done){
        h = new SmartHash();
        h.insert({index: 'doron', value: {phone_num: '1', test_field: 'some field'}, ttl: 1, time: 's'});
        h.insert({index: 'doron', value: {phone_num: '2'}, ttl: 3200});
        h.insert({index: 'doron', value: {phone_num: '3'}, ttl: 33000});
        h.insert({index: 'doron', value: {phone_num: '4'}, ttl: 23000});
        h.insert({index: 'rachel', value: {phone_num: '5'}, ttl: 32200});
        h.insert({index: 'rachel', value: {phone_num: '6'}, ttl: 53000});
        h.insert({index: 'doron1', value: {phone_num: '123'}, ttl: 53000});
        h.insert({index: 'test@test.com', value: {user_id: '123', email: 'test@test.com', last_login: 1402811273} });
        h.insert({index: 'test', value: {user_id: '123', email: 'test@test.com', last_login: 1402811273} });
        setTimeout(function(){
            done();
        }, 200);
    });

    after(function(done){
        delete h;
        done();
    });

    it("user 'doron' should be found in hash", function(done){
        h.fetch({index: 'doron'}, function(err, result){
            assert.ok(result.value);
            result.value.should.have.property('phone_num','1');
            result.value.should.have.property('test_field','some field');
            done();
        });
    });

    it("user 'doron' should BE found in hash after 0.5 second", function(done){
        setTimeout(function(){
            assert.ok(h.Data['doron']);
            h.Data['doron'].value.should.have.property('phone_num','1');
            h.Data['doron'].value.should.have.property('test_field','some field');
            done();
        }, 500);
    });

    it("user 'doron' should not be found in hash after 1.5 second", function(done){
        setTimeout(function(){
            h.fetch({index: 'doron'}, function(err, result){
                assert.equal(result, undefined);
                assert.equal(err,'Value is not found.');
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

    describe("When using fetch and remove", function(){

        it("should fetch and remove the value from the hash", function(done){
            size = h.getSize();
            h.fetchAndRemove({index: 'test'}, function(err, result){
                assert.ok(result);
                assert.equal(result.value.user_id, '123');
                assert.equal(result.value.email, 'test@test.com');
                done();
            });
        });

        it("size should be -1 than before", function(done){
            assert.ok(size > h.getSize());
            done();
        });

        it("index 'test' should be missing", function(done){
            h.fetch({index: 'test'}, function(err, result){
                assert.equal(result, null);
                done();
            });

        });
    });

    describe("When using same index twice SmartHash will generate a new index id for the latest index", function(){
        var id1;
        var id2;
        var random_id;
        var random_value;
        var random_value2;

        before(function(done){
            random_id = 'random_id';
            random_value = { name: 'random user', email: 'random@email.com' };
            random_value2 = { name: 'second random user', email: 'random_second@email.com' };
            h.insert({index: random_id, value: random_value }, function(err, result){
                id1 = result.id;
                h.insert({index: random_id, value: random_value2 }, function(err, result2){
                    assert.equal(id1, random_id);
                    assert.notEqual(result2.id, random_id);
                    id2 = result2.id;
                    done();
                });
            });
        });

        after(function(done){
            h.fetchAndRemove({index: id1}, function(err, res1){
                h.fetchAndRemove({index: id2}, function(err, res2){
                    done();
                });
            });
        });

        it ("id " + id1 + " should have the values", function(done){
            h.fetch({index: id1}, function(err, result){
                assert.ok(result);
                assert.equal(result.value.name, random_value.name);
                assert.equal(result.value.email, random_value.email);
                done();
            });
        });
        it("id " + id2 + " should have `second random user`", function(done){
            h.fetch({index: id2}, function(err, result){
                assert.ok(result);
                assert.equal(result.value.name, random_value2.name);
                assert.equal(result.value.email, random_value2.email);
                done();
            });
        });
    });

    describe("When an index is already created don't create another one", function(){
        var user1 = {
            index: 'user_index',
            value: {username: 'user1'}
        };
        var user2 = {
            index: 'user_index',
            value: {username: 'user1'}
        };
        after(function(done){
            h.fetchAndRemove({index: user1.index}, function(err, res){
                done();
            });
        });
        it("Should add a new index to hash", function(done){
            h.insert(user1, function(err, result){
                assert.equal(result.id, user1.index);
                done();
            });
        });
        it("Should return that index is already being used", function(done){
            h.checkIfIndexExist(user1, function(err, res){
                res.should.be.a.Boolean;
                res.should.be.true;
                done();
            });
        });
        it("Should NOT add user2 becuase they both have the same index", function(done){
            h.checkIfIndexExist(user1, function(err, res){
                res.should.be.true;
                if (res) {
                    done();
                }
            });
        });
        it("Should generate a new ID for user2", function(done){
            h.insert(user2, function(err, res){
                res.should.be.an.instanceOf(Object).and.have.property('id');
                res.obj.value.should.be.an.instanceOf(Object).and.have.property('username','user1');
                res.id.should.not.equal(user1.index);
                done();
            });
        });
    });
});