//const app = require('../index');  // Including this will trigger node to run app.js file in mentioned server.
const chai = require('chai');
const chatHttp = require('chai-http');
chai.use(chatHttp);

describe("Restaurant's API's", function() {
    it("Get a restaurant by ownerid", function(done) {
        chai.request('localhost:3001').get('/restaurant/owner/23').end((error, response) => {   // (err: any, res: request.Response) // Definiiton of this function. // Only program/network error will go to error, 200, 404, 500 all are treated as response only, we have to write handler for them.
            if(error) {
                chai.assert.fail(error); // Always fail assertion.
            } else {
                chai.expect(response).to.have.status(200);
                chai.expect(response.body).haveOwnProperty("name");
                chai.expect(response.body).haveOwnProperty("zip");
                chai.expect(response.body).haveOwnProperty("cuisine");
            }
            done(); // to show it's async to chai and not the test case in tht first itself and wait for end-callback.
        });
    });

    it("Get all restaurants", function(done) {
        chai.request('localhost:3001').get('/restaurant/').end((error, response) => {   // (err: any, res: request.Response) // Definiiton of this function. // Only program/network error will go to error, 200, 404, 500 all are treated as response only, we have to write handler for them.
            if(error) {
                chai.assert.fail(error); // Always fail assertion.
            } else {
                chai.expect(response).to.have.status(200);
                chai.assert(Array.isArray(response.body), "Response is not an array");
                chai.assert(response.body[0].hasOwnProperty("name"));
                chai.assert(response.body[0].hasOwnProperty("zip"));
                chai.assert(response.body[0].hasOwnProperty("cuisine"));
            }
            done(); // to show it's async to chai and not the test case in tht first itself and wait for end-callback.
        });
    });

    it("Get a orders by restaurantid", function(done) {
        chai.request('localhost:3001').get('/restaurant/7/orders').end((error, response) => {   // (err: any, res: request.Response) // Definiiton of this function. // Only program/network error will go to error, 200, 404, 500 all are treated as response only, we have to write handler for them.
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



/*

const chai = require('chai');
const app = require('../index');  // Including this will trigger node to run app.js file in mentioned server.
const chatHttp = require('chai-http');
chai.use(chatHttp);

describe("restaurant's API's", function() {
    it("Get a restaurant by ownerid", function(done) {
        chai.request(app).get('/restaurant/owner/23').end((error, response) => {   // (err: any, res: request.Response) // Definiiton of this function. // Only program/network error will go to error, 200, 404, 500 all are treated as response only, we have to write handler for them.
            if(error) {
                chai.assert.fail(error); // Always fail assertion.
            } else {
                chai.expect(response).to.have.status(200);
                chai.expect(response.body).haveOwnProperty("name");
                chai.expect(response.body).haveOwnProperty("zip");
                chai.expect(response.body).haveOwnProperty("cuisine");
            }
            done(); // to show it's async to chai and not the test case in tht first itself and wait for end-callback.
        });
    });

    // it("Get a restaurant by ownerid", function() {  // IDK how this promise method works, as we just send response and not promise in the server, wierd
    //     return chai.request(app).get('/restaurant/owner/23').then((response) => {
    //         //console.log(error.status);
    //         //console.log(response.status);
    //         console.log('in success');
    //     }).catch(error=> {
    //         console.log('in error');
    //         console.log(error);
    //     });
    // });
});

*/