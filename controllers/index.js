var express = require('express');
var Converter=require("csvtojson").core.Converter;
var fs=require("fs");
var router = express.Router();
var nodemailer = require('nodemailer');
var hbs = require('nodemailer-express-handlebars');
var options = {
     viewEngine: {
         extname: '.handlebars',
         layoutsDir: 'views/',
         defaultLayout : 'layouts/main',
         partialsDir : 'views/partials/'
     },
     viewPath: 'views/',
     extName: '.handlebars'
 };
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@your-email.com',
        pass: 'you-pass'
    }
});

/* GET home page. */
router.get('/', function(req, res, next) {
	//Converter Class
	var Converter=require("csvtojson").core.Converter;
	var fs=require("fs");

	var csvFileName="public/upload/objectivos.csv";
	var fileStream=fs.createReadStream(csvFileName);
	//new converter instance
	var csvConverter=new Converter({constructResult:true, delimiter: ';'});

	//end_parsed will be emitted once parsing finished
	csvConverter.on("end_parsed",function(jsonObj){
        var data = {
            "records": jsonObj
        }
		res.render('index', {data: data});
	});

	//read from file
	fileStream.pipe(csvConverter);
});

router.post('/kpi.json', function(req, res, next) {
    var data = req.body;
    transporter.use('compile', hbs(options));
    transporter.sendMail({
        from: 'igo.lapa@gatewit.com',
        to: 'igo.lapa@gatewit.com',
        subject: 'hello',
        template: 'table',
        context: {
            records: data
        }
    }, function(err, response) {
        console.log(err);
        transporter.close();
    });
    transporter.close();
    res.status(200);
    res.send(data);
});

module.exports = router;
