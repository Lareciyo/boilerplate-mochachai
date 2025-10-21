const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const Browser = require('zombie');
Browser.site = 'http://localhost:3000/';

// -----------------------------
// In-memory data for explorers
// -----------------------------
const explorers = [
  { surname: 'Colombo', name: 'Cristoforo' },
  { surname: 'da Verrazzano', name: 'Giovanni' },
  { surname: 'Vespucci', name: 'Amerigo' },
];

// -----------------------------
// Functional Tests with chai-http
// -----------------------------
suite('Functional Tests', function () {
  this.timeout(5000);

  suite('Integration tests with chai-http', function () {
    // #1 Test GET /hello with no name
    test('Test GET /hello with no name', function (done) {
      chai
        .request(server)
        .get('/hello')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { greeting: 'hello Guest' });
          done();
        });
    });

    // #2 Test GET /hello with a name
    test('Test GET /hello with your name', function (done) {
      chai
        .request(server)
        .get('/hello?name=Lareciyo')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { greeting: 'hello Lareciyo' });
          done();
        });
    });

    // #3 Send {surname: "Colombo"}
    test('Send {surname: "Colombo"}', function (done) {
      const explorer = explorers.find(e => e.surname === 'Colombo');
      chai
        .request(server)
        .post('/travellers')
        .send({ surname: 'Colombo' })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, explorer);
          done();
        });
    });

    // #4 Send {surname: "da Verrazzano"}
    test('Send {surname: "da Verrazzano"}', function (done) {
      const explorer = explorers.find(e => e.surname === 'da Verrazzano');
      chai
        .request(server)
        .post('/travellers')
        .send({ surname: 'da Verrazzano' })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, explorer);
          done();
        });
    });
  });
});

// -----------------------------
// Functional Tests with Zombie.js
// -----------------------------
suite('Functional Tests with Zombie.js', function () {
  this.timeout(5000);
  const browser = new Browser();

  suite('Headless browser', function () {
    test('should have a working "site" property', function () {
      assert.isNotNull(browser.site);
    });
  });

  suite('"Famous Italian Explorers" form', function () {
    before(function (done) {
      browser.visit('/', done);
    });

    // #5 Submit the surname "Colombo" in the HTML form
    test('Submit the surname "Colombo" in the HTML form', function (done) {
      browser.fill('surname', 'Colombo').pressButton('submit', function () {
        browser.assert.success();
        browser.assert.text('span#name', 'Cristoforo');
        browser.assert.text('span#surname', 'Colombo');
        browser.assert.element('span#dates', 1);
        done();
      });
    });

    // #6 Submit the surname "Vespucci" in the HTML form
    test('Submit the surname "Vespucci" in the HTML form', function (done) {
      browser.fill('surname', 'Vespucci').pressButton('submit', function () {
        browser.assert.success();
        browser.assert.text('span#name', 'Amerigo');
        browser.assert.text('span#surname', 'Vespucci');
        browser.assert.element('span#dates', 1);
        done();
      });
    });
  });
});
