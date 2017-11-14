var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/basic_mongoose');
app.use(bodyParser.urlencoded({ extended: true }));
var path = require('path');
app.use(express.static(path.join(__dirname, './static')));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
var FoxSchema = new mongoose.Schema({
 name: String,
 description: String
});
mongoose.model('Fox', FoxSchema);
var Fox = mongoose.model('Fox');

app.get('/', function(req, res) {
	Fox.find({}, function(err, foxes) {
    	if (err){
			console.log(err);
		}
		else {
			res.render('index', {foxes: foxes});
		}
	})  
});

app.post('/', function(req, res) {
	var fox = new Fox({name: req.body.name, description: req.body.description});
	fox.save(function(err) {
		if(err) {
			console.log('something went wrong');
		}
		else {
			console.log('successfully added a fox!');
			res.redirect('/');
		}
	})  
});

app.get('/foxes/new', function(req, res) {
	res.render('new');  
});

app.get('/foxes/edit/:_id', function(req, res) {
	Fox.findById(req.params._id, function(err, fox) {
		if(err){

		}
		else {
			console.log(fox);
			res.render('edit', {fox: fox});
		}
	});
	
});

app.post('/foxes/destroy/:_id', function(req, res) {
	Fox.remove({_id: req.params._id}, function(err){
		if(err){

		}
		else {
			res.redirect('/')
		}
	})
})

app.get('/foxes/:_id', function(req, res) {
	Fox.findById(req.params._id, function(err, fox) {
		if(err){

		}
		else {
			console.log(fox);
			res.render('show', {fox: fox});
		}
	});
	
});

app.post('/foxes/:_id', function(req, res) {
	Fox.findById(req.params._id, function(err, fox) {
		if(err){

		}
		else {
			fox.name = req.body.name;
			fox.description = req.body.description;
			fox.save(function(err){

			})
			res.redirect('/');
		}
	});
	
});

app.listen(8000, function() {
    console.log("listening on port 8000");
});