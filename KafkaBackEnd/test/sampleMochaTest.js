const chai = require('chai');

describe("sample Mocha test", () => {
    it("Array validation sample", () => {
        chai.assert(Array.isArray([1, 3]), 'Not an array');
    });
});

// Mocha is a Node back-end unit test library.
// For any testing library we need a proper assertion library, Node has a basic, Chai is  comprhensive assertion framework

// https://mochajs.org/
// https://www.youtube.com/watch?v=MLTRHc5dk6s // Intro To JavaScript Unit Testing With Mocha JS & Chai
// We can user any one of these three styles in app, assert or expect or should.
// https://www.chaijs.com/guide/styles/#assert
// But if we are going to assert asynchronus code, we need chai-http to do that.
// https://www.chaijs.com/plugins/chai-http/
// We can either use promise or callback async methods, check the documentation.