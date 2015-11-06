var express = require('express');
var Converter=require("csvtojson").core.Converter;
var fs=require("fs");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index');
});

module.exports = router;
