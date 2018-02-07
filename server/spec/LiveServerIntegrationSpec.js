var request = require('request');
var expect = require('chai').expect;
var requestParams = [
  {
    method: 'POST',
    url: 'http://127.0.0.1:3000/classes/messages',
    json: {
      username: 'Jono',
      text: 'Do my bidding!',
      roomname: 'test'
    }
  },
  {
    method: 'POST',
    url: 'http://127.0.0.1:3000/classes/messages',
    json: {
      username: 'Yufan',
      text: '?',
      roomname: 'test'
    }
  },
  {
    method: 'POST',
    url: 'http://127.0.0.1:3000/classes/messages',
    json: {
      username: 'Paula',
      text: '!',
      roomname: 'test'
    }
  }
];

describe('server', function() {
  it('should respond to GET requests for /classes/messages with a 200 status code', function(done) {
    request('http://127.0.0.1:3000/classes/messages', function(error, response, body) {
      expect(response.statusCode).to.equal(200);
      done();
    });
  });

  it('should send back parsable stringified JSON', function(done) {
    request('http://127.0.0.1:3000/classes/messages', function(error, response, body) {
      expect(JSON.parse.bind(this, body)).to.not.throw();
      done();
    });
  });

  it('should send back an object', function(done) {
    request('http://127.0.0.1:3000/classes/messages', function(error, response, body) {
      var parsedBody = JSON.parse(body);
      expect(parsedBody).to.be.an('object');
      done();
    });
  });

  it('should send an object containing a `results` array', function(done) {
    request('http://127.0.0.1:3000/classes/messages', function(error, response, body) {
      var parsedBody = JSON.parse(body);
      expect(parsedBody).to.be.an('object');
      expect(parsedBody.results).to.be.an('array');
      done();
    });
  });

  it('Should 200 when asked for OPTIONS', function(done) {
    var requestArg = {
      method: 'OPTIONS',
      url: 'http://127.0.0.1:3000/classes/messages'
    };
    request(requestArg, function(error, response, body) {
      expect(response.statusCode).to.equal(200);
      done();
    });
  });

  it('should accept POST requests to /classes/messages', function(done) {
    request(requestParams[0], function(error, response, body) {
      expect(response.statusCode).to.equal(201);
      done();
    });
  });

  it('should respond with messages that were previously posted', function(done) {

    request(requestParams[0], function(error, response, body) {
      // Now if we request the log, that message we posted should be there:
      request('http://127.0.0.1:3000/classes/messages', function(error, response, body) {
        var messages = JSON.parse(body).results;
        expect(messages[messages.length - 1].username).to.equal('Jono');
        expect(messages[messages.length - 1].text).to.equal('Do my bidding!');
        done();
      });
    });
  });

  it('Should add all messages to the messages object', function(done) {
    var messages = [];
    for (var i = 0; i < requestParams.length; i++) {
      request(requestParams[i], function(error, response, body) {
        request('http://127.0.0.1:3000/classes/messages', function(error, response, body) {
          var message = JSON.parse(body).results;
          messages.push(message);
          expect(messages[i].username).to.equal(requestParams[i].username);
          expect(messages[i].text).to.equal(requestParams[i].text);
        });
      });
    }
    done();
  });

  it('Should 404 when asked for a nonexistent endpoint', function(done) {
    request('http://127.0.0.1:3000/arglebargle', function(error, response, body) {
      expect(response.statusCode).to.equal(404);
      done();
    });
  });

});
