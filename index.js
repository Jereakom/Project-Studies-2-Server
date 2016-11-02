require('dotenv').config();

var express = require('express');

var app = express();

var port = process.env.PORT || 8080;

var models = require('./models');

var cors = require('cors');
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

// models.User.sync({force: true});
// models.sequelize.sync({force: true});

app.get('/', function(req, res) {
  res.send('Hello world!');
});

app.get('/users', function(req, res) {
  models.User.findAll({
    attributes:{
      exclude:['password', 'createdAt', 'updatedAt']
    }
  }).then(function(user){
    res.json(user);
  });
});

app.get('/users/:id', function(req, res) {
  models.User.findOne({
    where:{
      id: req.params.id
    },
    attributes: {
      exclude: ['password', 'createdAt', 'updatedAt']
    }
  }).then(function(user){
    res.json(user);
  });
});

app.post('/register', function(req, res, err){
  // res.send(req.body);
  var username = req.body.username.toLowerCase();
  var user = models.User.build({
    username: username
  });
  user.password = user.generateHash(req.body.password);
  user.save().then(function(user){
    res.send("User created successfully!");

  }).catch(function(err){
    res.send("User already exists!");
  });
});

app.post('/login', function(req, res, err){
  // res.send(req.body);
  var username = req.body.username.toLowerCase();
  models.User.findOne({
    where:{
      username: username
    }
  }).then(function(user){
    var comparison = user.validPassword(req.body.password);
    if (comparison)
    {
      res.send(user);
    }
    else
    {
      res.send("Invalid password or username");
    }
  }).catch(function(err){
    console.log(err);
    res.send("Cannot log in!");
  });
});

app.post('/users/:id/games', function(req, res, err){
  models.User.findOne({
    where:{
      id: req.params.id
    }
  }).then(function(user){
    user.games = user.games + 1;
    if (req.body.win == 1)
    {
      user.wins = user.wins + 1;
      user.save();
    }
    user.save();
    res.send("Game logged successfully");
  }).catch(function(err){
    console.log(err);
    res.send("Couldn't log game!");
  });
});

app.get('/leaderboards', function(req,res, err){
  models.User.findAll({
    where:{
      games: {
        gt:0
      }
    },
    attributes:{
      exclude: ['password', 'createdAt', 'updatedAt', 'id']
    },
    order:[
      ['wins', 'DESC']
    ]
  }).then(function(user){
    res.send(user);
  });
});

app.get('*', function (req, res){
  res.redirect('/');
});

app.listen(port, function(){
  console.log('App listening on port ' + port);
});
