var express = require('express');
var app = express();

app.get('/api/jsontest*', function (req, res) {
  res.send('{"status":200, "message": "success"}');
});

app.listen(8080, function () {
  console.log('Lowtea listening on port 8080!');
});

app.use(express.static('../front/dist'));
