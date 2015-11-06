var express = require('express');
var Converter=require("csvtojson").core.Converter;
var fs=require("fs");
var router = express.Router();
var nodemailer = require('nodemailer');
var hbs = require('nodemailer-express-handlebars');
var options = {
     viewEngine: {
         extname: '.hbs',
         layoutsDir: 'views/',
         defaultLayout : 'layout',
         partialsDir : 'views/partials/'
     },
     viewPath: 'views/',
     extName: '.hbs'
 };
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@your-email.com',
        pass: 'youpassword'
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
        from: 'igo.lapa@construlink.com',
        to: 'igo.lapa@construlink.com',
        subject: 'hello',
        template: 'table',
        context: {
            records: data
        }
    }, function(err, response) {
        transporter.close();
    });
    transporter.close();
    res.status(200);
    res.send(data);
});

module.exports = router;
