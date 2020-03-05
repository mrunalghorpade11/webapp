var assert = require('assert');
var userDao = require('../../src/Dao/userDao')
const expect = require('chai').expect;
const uuidv4 = require('uuid/v4');
const bcrypt = require('bcrypt');

const payloadForTest = {
    "id": uuidv4(),
    "first_name": "mrunal",
    "last_name": "ghorpade",
    "email_address": "csye@gmail.com",
    "password": "12345"
}
describe("insertUser method present", function () {
    it('should have a function "createUser" defined', function () {
        expect(typeof userDao.createUsers).equals("function");
    })
})
// describe("Should save user in DB", function () {
//     it("Should save a user to the DB", function (done) {
//         var hashedPassword = bcrypt.hashSync(payloadForTest.password, 8);
//         delete payloadForTest.password;
//         payloadForTest.password = hashedPassword

//         userDao.createUsers(payloadForTest, function (error, result) {
//             if (error == 'user alread exists') done();
//             else if (error)
//                 done(error)
//             else done();
//         })
//     });
// })