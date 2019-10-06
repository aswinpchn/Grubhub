const chai = require('chai');
const chatHttp = require('chai-http');
chai.use(chatHttp);

describe("User's API's", function() {
    it("Get a user by id", function(done) {
        chai.request('localhost:3001').get('/user/1').end((error, response) => {   // (err: any, res: request.Response) // Definiiton of this function. // Only program/network error will go to error, 200, 404, 500 all are treated as response only, we have to write handler for them.
            if(error) {
                chai.assert.fail(error); // Always fail assertion.
            } else {
                chai.expect(response).to.have.status(200);
                chai.expect(response.body).haveOwnProperty("name");
                chai.expect(response.body).haveOwnProperty("email");
                chai.expect(response.body).haveOwnProperty("phone");
            }
            done(); // to show it's async to chai and not the test case in tht first itself and wait for end-callback.
        });
    });

    it("Get a orders by userid", function(done) {
        chai.request('localhost:3001').get('/user/1/orders').end((error, response) => {   // (err: any, res: request.Response) // Definiiton of this function. // Only program/network error will go to error, 200, 404, 500 all are treated as response only, we have to write handler for them.
            if(error) {
                chai.assert.fail(error); // Always fail assertion.
            } else {
                chai.expect(response).to.have.status(200);
                chai.assert(response.body.hasOwnProperty("numberoforders"));
                chai.assert(Array.isArray(response.body.orders));
                chai.assert(response.body.orders[0].hasOwnProperty("cost"));
                chai.assert(response.body.orders[0].hasOwnProperty("status"));
                chai.assert(Array.isArray(response.body.orders[0].menu));
            }
            done(); // to show it's async to chai and not the test case in tht first itself and wait for end-callback.
        });
    });
});