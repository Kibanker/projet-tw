const express = require('express');
const PORT = 3000;

const app = express();

app.get('/ping', (req, res) => res.sendStatus(200));

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
  })