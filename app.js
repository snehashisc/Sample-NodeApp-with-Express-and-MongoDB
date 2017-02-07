var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');
var mongojs = require('mongojs');
var db = mongojs('mycustomers', ['customers']);

var app = express();


//View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


//Set Static Path
app.use(express.static(path.join(__dirname, 'public')));

//Global Vars

app.use(function(req,res,next){
  res.locals.errors = null;
    next();
    
})

// Express Validator Middleware

app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;
 
    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

var users = [{
  first_name: 'Snehashis',
   last_name: 'Chattopadhyay',
   email: 'snehashisc@gmail.com'
},
{
  first_name: 'Sneh',
   last_name: 'Chat',
   email: 'sneha.com'
}



]


app.get('/', function(req, res) {

    db.customers.find(function(err, docs){
  res.render('index', {
   title: 'Customers',
users: docs
});       

})

});

app.post('/users/add', function (req,res){
    req.checkBody('first_name', 'First Name is required').notEmpty();
    req.checkBody('last_name', 'Last Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    
    var errors = req. validationErrors();
    
    if(errors){
res.render('index', {
   title: 'Customers',
   users: users,
   errors:errors
});

}else {
    var newUser = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email

}
db.customers.insert(newUser, function(err, result){
    if(err){
console.log(err);
}
    res.redirect('/');
    
});
}
})

app.listen(3000, function() {
console.log('Server started on port 3000...');

})