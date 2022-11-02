const express = require('express');

const router = express.Router();

router.use('/portfolio', require('./portfolio'));


module.exports = router;