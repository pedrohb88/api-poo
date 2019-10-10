let express = require('express');
let app = express();

app.get('/', function (req, res) {
  res.send('API para Gerenciamento de Farmácias');
});

app.listen(3000, function () {
  console.log('Listening on port 3000');
});
