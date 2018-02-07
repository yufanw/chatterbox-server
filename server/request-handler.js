var counter = 1;
var messages = [];
var url = '/classes/messages';


var headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'application/json'
};

var sendResponse = function(response, data, statusCode) {
  statusCode = statusCode || 200;
  response.writeHead(statusCode, headers);
  response.end(JSON.stringify(data));
};

var collectData = function(request, callback) {
  var data = '';
  request.on('data', function(chunk) {
    data += chunk;
  });
  request.on('end', function() {
    callback(JSON.parse(data));
  });
};

var makeActionHandler = function(actionMap) {
  return function(request, response) {
    var action = actionMap[request.method];
    if (action && request.url === url) {
      action(request, response);
    } else {
      sendResponse(response, 'Not Found', 404);
    }
  };
};

var actions = {
  'GET': function(request, response) {
    sendResponse(response, {results: messages});
  },
  'POST': function(request, response) {
    collectData(request, function(message) {
      message.objectId = ++counter;
      messages.push(message);
      sendResponse(response, {objectId: message.objectId}, 201);
    });
  },
  'OPTIONS': function(request, response) {
    sendResponse(response, null);
  }
};

exports.requestHandler = makeActionHandler(actions);
