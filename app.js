const express = require('express');

const app = express();
const port = 3000;

app.use('/api/v1', require('./api/v1/index'));

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
