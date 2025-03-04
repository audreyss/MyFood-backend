var express = require('express');
var router = express.Router();

const Diet = require('../models/diets');


// ROUTE GET /DIETS/
router.get('/', (req, res) => {
    Diet.find()
        .then(data => {
            if (data) {
                res.json({ result: true, diets: data })
            } else {
                res.json({ result: false })
            }
        })
        .catch(error => res.json({result:false, error}))
});

module.exports = router;
