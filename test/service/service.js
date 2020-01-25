// var assert = require('assert');
// var userService = require('../../src/service/userService')
// // describe('Basic Mocha String Test', function () {
// //     it('should return number of charachters in a string', function () {
// //            assert.equal("Hello".length, 5);
// //        });
// //     it('should return first charachter of the string', function () {
// //            assert.equal("Hello".charAt(0), 'H');
// //        });
// //    });

//    describe('Basic Mocha Test',function()
//    {
//     it('should return number of charachters in a string', function (done) {
//        // assert.equal("Hello".length, 5);
//        const payloadForTest ={
//            "id":1,
//            "first_name":"mrunal",
//            "last_name":"ghorpade",
//            "email_address":"csye@gmail.com",
//            "password":"12345"
//         }

//        userService.createUser(payloadForTest,function(created)
//        {
//            assert.equal(created.dataValues.firstName,payloadForTest.first_name);
//            done()
//        })
//     });
//    })