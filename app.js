var express = require('express');
var routes = require('./routes');
var http = require('http');
var db = require('./db.js');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var mongo_store_session = require('connect-mongo')(session);
var bodyParser = require('body-parser');
var passport = require('passport');
var passportLocal = require('passport-local');
var my_schema = require('./schemas/schema_1');


var app = express();

var port = process.env.PORT || 5000;
//-------------------------------------------------------------------------------------------------------
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());        //this recieves cookies from browser

app.use(session({
  secret:process.env.SESSION_secret || 'secret',          //this is actually the encrypt of your data
    store: new mongo_store_session({                      //this is where we store sessions
      mongooseConnection: db
    }),
  resave:false,
  saveUninitialized:false
}));


app.use(passport.initialize());
app.use(passport.session());

passport.use(new passportLocal.Strategy(function(username,password,done){
  // done(null,user);
  // done(null,null);
  // done(new Error('ouch!'));
  // if (username === "admin" && password === "admin" ) {
      
  //     return done({id:username, username: username});     //this is ???user??? object
  //   }
    
  //   return done(false);


  my_schema.findOne({
        'username': username, 
      }, function(err, user,res) {
          if (err) {
            
            return done(err);
          }

          if (!user) {
            console.log('wrong username!');
            return done(null, false);
          }

          if (user.pass_1 != password) {
            console.log('wrong password');
            return done(null, false);
          }

          return done(null, user);
      });




}));

//Serialize function determine what data from the user object should be stored in the session. 
//The result of the serializeUser method is attached to the session as req.session.passport.user = {} 
//here for instance it would be(as we provide id as key) req.session.passport.user = {id:'xyz'}
passport.serializeUser(function(user, done) {
  done(null,user);       
});


//So your whole object is retrieved with help of that key.
//That key here is id(key can be any key of the user object ie name,email etc)
//In deserialize function that key is matched with in memory array / database or any data resource
passport.deserializeUser(function(user, done) {
  //query database or cashe here
  done(null,user);                     
                 //|______________>user object attaches to the request as req.user                                        

});



app.use(express.static(__dirname + '/public'));

//view engine
app.set('view engine', 'ejs');

//==================routes===================================================================
app.get('/', function (req, res) {
  res.render('login_page', { 
    title: 'Login',
    isAuthenticated: req.isAuthenticated(),
    user: req.user
  });
});

app.get('/login',ensureAuthenticated, function (req, res) {
  res.render('home', { 
    title: 'SS Messenger',
    port_new: port
  });
});

app.get('/signup', function (req, res) {
  res.render('signup_page', { 
    title: 'signup',
    port_new: port
  });
});

app.get('/chatting',ensureAuthenticated, function (req, res) {

  res.render('chatting_page', {
    title: 'chatting',
    username_new: req.user.username,
    port_new: port
  });
});


// route for logging out
app.get('/logout', function(req, res) {
    req.session.destroy(function(e){
        req.logout();
        res.redirect('/');
    });
});

app.get('/loginFailure', function(req, res, next) {
  res.send('Failed to authenticate ');
});

// <a href="http://127.0.0.1:3000/">login</a>

// app.get('/process_post'function(req, res) {
//   if (req.session.passport.user === undefined) {
//     res.redirect('/signup');
//     console.log('heeeeeeeeeeeell no!');
//   } else {
//     res.render('chatting_page', {title: 'chatting',
//       user: req.user
//     })
//   }
// });


//============login====POST=================================================================
app.post('/', passport.authenticate('local',{
    successRedirect: '/chatting',
    failureRedirect: '/loginFailure'
  })

    //res.end(JSON.stringify(login_data));
);

//============signup====POST=================================================================
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.post('/hello', urlencodedParser, function (req, res) {

   // Prepare output in JSON format
   signup_data = {
       full_name:req.body.input_3,
       username:req.body.input_4,
       email:req.body.input_5,
       pass_1:req.body.input_6,
       pass_2:req.body.input_7
   };
   //console.log(signup_data);

   if (req.body.input_3.length<3|| req.body.input_4.length<3 || req.body.input_5.length<3 || req.body.input_6.length<3||req.body.input_7.length<3) {
      console.log('length of inputs is under than 3!');
   } else{
       var record = new my_schema(signup_data);

     record.save(function(err) {
        if(err){
          console.log('error with storing in db!');
          res.redirect('/signup');
          console.log('err');
        }else {
          console.log('data sent to database!'); 
          res.redirect('/');
        }

     });
   };



   //res.end(JSON.stringify(signup_data));
});
//------------------------------------------------------------------------------------




//------------------qqqqueeeeeeeeeeeery-----------------------------------------------
// app.get('/new', function (req,res){
// 	my_schema.find()
// 	.setOptions({sort:'full_name'})
// 	.exec(function(err,data){
// 		if (err) {
// 			console.log('err for querying data from database!');
// 		}else{
//       req.session.username  = "admin";//data.username;
//       req.session.pass_1 = "admin";//data.username;
// 			console.log(data);
// 			console.log('hello');
// 		}
// 	})
// });

//-------------------------------------------------------------------------------------


function ensureAuthenticated(req, res, next){
  if( req.isAuthenticated() ) {
    return next();
  }else{
    res.redirect('/');
  }
}

// var server = app.listen(3000, function(){
// 	console.log('listening on port 3000');
// });





var io = require('socket.io').listen(app.listen(port, function(){
  console.log('listening on port '+ port);
}));

io.sockets.on('connection', function (socket) {
	console.log('a user connected'); 
    socket.emit('message', { message: 'welcome to the chat' });
    socket.on('send', function (data) {
        io.sockets.emit('message', data);
    });
});










