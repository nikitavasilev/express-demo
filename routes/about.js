const express = require('express');
const router = express.Router();

router.get('/about', (req, res) => {
  res.render('about', { title: 'My about page', message: 'Hello' });
});

module.exports = router;
