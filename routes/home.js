const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.sendFile('index1.html', { root: path.join(__dirname, '../public') });
});

module.exports = router;
