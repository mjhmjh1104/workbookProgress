var express         = require('express');
var path            = require('path');
var app             = express();
var mongoose        = require('mongoose');
var passport        = require('passport');
var session         = require('express-session');
var flash           = require('connect-flash');
var async           = require('async');
var bodyParser      = require('body-parser');
var methodOverride  = require('method-override');


mongoose.connect('mongodb://' + process.env.MONGO_DB + '@ds111063.mlab.com:11063/workbookprogress', { useNewUrlParser: true });

var db = mongoose.connection;
db.once('open', function() {
  console.log('Database Connected');
});
db.on('error', function(err) {
  console.log('Database Error Occurred: ', err);
});

var userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  nickname: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
var User = mongoose.model('user', userSchema);

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(flash());

app.use(session({ secret: 'workbookProgressProjectSecretKeyIsSecretYouCannotStealThisKeyHahahaThisIsSecretKey' }));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

var LocalStrategy = require('passport-local').Strategy;
passport.use('localLogin',
  new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, function(req, email, password, done) {
    User.findOne({ 'email': email }, function(err, user) {
      if (err) return done(err);
      if (!user || user.password != password) {
        req.flash('email', req.body.email);
        return done(null, false, req.flash('loginError', 'Please check your email and password.'));
      }
      return done(null, user);
    });
  })
);

app.get('/', function(req, res) {
  res.render('main/main', { user: req.user });
});

app.get('/login', function(req, res) {
  res.render('login/login', { email: req.flash('email')[0], loginError: req.flash('loginError') });
});

app.post('/login',
  function(req, res, next) {
    req.flash('email');
    if (req.body.email.length === 0 || req.body.password.length === 0) {
      req.flash('email', req.body.email);
      req.flash('loginError', 'Please check your email and password.');
      res.redirect('/login');
    } else next();
  }, passport.authenticate('localLogin', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  })
);

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

app.get('/users/new', function(req, res) {
  res.render('users/new', {
    formData: req.flash('formData')[0],
    emailError: req.flash('emailError')[0],
    nicknameError: req.flash('nicknameError')[0],
    passwordError: req.flash('passwordError')[0],
    passwordConfigurationError: req.flash('passwordConfigurationError')[0]
  });
});

app.post('/users', function(req, res, next) {
  var isValid = true;
  if (req.body.user.email.length === 0) {
    req.flash('emailError', 'Email is required');
    isValid = false;
  }
  if (req.body.user.nickname.length === 0) {
    req.flash('nicknameError', 'Nickname is required');
    isValid = false;
  }
  if (req.body.user.password.length === 0) {
    req.flash('passwordError', 'Password is required');
    isValid = false;
  } else if (req.body.user.password != req.body.user.passwordConfiguration) {
    req.flash('passwordConfigurationError', "Password doesn't match with configuration");
    isValid = false;
  }
  if (!isValid) {
    req.flash('formData', { email: req.body.user.email, nickname: req.body.user.nickname });
    res.redirect('/users/new');
  }
  else next();
}, checkUserRegValidation, function(req, res) {
  User.create(req.body.user, function(err, user) {
    if (err) return res.json({ success: false, message: err });
    res.redirect('/login');
  });
});

app.get('/users/:id', function(req, res) {
  User.findById(req.params.id, function(err, user) {
    if (err) return res.json({ success: false, message: err });
    var modifiable = false;
    if (req.isAuthenticated() && req.user._id == req.params.id) modifiable = true;
    res.render('users/show', { user: user, modifiable: modifiable });
  });
});

app.get('/users/:id/edit', hasEqualId, function(req, res) {
  User.findById(req.params.id, function(err, user) {
    if (err) return res.json({ success: false, message: err });
    req.flash('formData', user);
    res.render('users/edit', {
      user: user,
      formData: req.flash('formData')[0],
      emailError: req.flash('emailError')[0],
      nicknameError: req.flash('nicknameError')[0],
      passwordError: req.flash('passwordError')[0],
      newPasswordError: req.flash('newPasswordError')[0],
      newPasswordConfigurationError: req.flash('newPasswordConfigurationError')[0]
    });
  });
});

app.put('/users/:id', hasEqualId, function(req, res, next) {
  var isValid = true;
  if (req.body.user.email.length === 0) {
    req.flash('emailError', 'Email is required');
    isValid = false;
  }
  if (req.body.user.nickname.length === 0) {
    req.flash('nicknameError', 'Nickname is required');
    isValid = false;
  }
  if (req.body.user.newPassword.length != 0 && req.body.user.newPassword != req.body.user.newPasswordConfiguration) {
    req.flash('newPasswordConfigurationError', "Password doesn't match with configuration");
    isValid = false;
  }
  if (!isValid) {
    req.flash('formData', { email: req.body.user.email, nickname: req.body.user.nickname });
    res.redirect('/users/' + req.params.id + '/edit');
  }
  else next();
}, checkUserRegValidation, function(req, res) {
  User.findById(req.params.id, req.body.user, function(err, user) {
    if (err) return res.json({ success: false, message: err });
    if (req.body.user.password == user.password) {
      if (req.body.user.newPassword.length != 0) req.body.user.password = req.body.user.newPassword;
      else delete req.body.user.password;
      User.findByIdAndUpdate(req.params.id, req.body.user, function(err, user) {
        if (err) return res.json({ success: false, message: err });
        res.redirect('/users/' + req.params.id);
      });
    } else {
      req.flash('formData', { email: req.body.user.email, nickname: req.body.user.nickname });
      req.flash('passwordError', 'Invalid password');
      res.redirect('/users/' + req.params.id + '/edit');
    }
  });
});

function checkUserRegValidation(req, res, next) {
  var isValid = true;
  async.waterfall([
    function(callback) {
      User.findOne({ email: req.body.user.email, _id: { $ne: mongoose.Types.ObjectId(req.params.id) } },
        function(err, user) {
          if (user) {
            isValid = false;
            req.flash('emailError', 'This email already exists');
          }
          callback(null, isValid);
        }
      );
    }, function(isValid, callback) {
      User.findOne({ nickname: req.body.user.nickname, _id: { $ne: mongoose.Types.ObjectId(req.params.id) } },
        function(err, user) {
          if (user) {
            isValid = false;
            req.flash('nicknameError', 'This nickname already exists');
          }
          callback(null, isValid);
        }
      );
    }
  ], function(err, isValid) {
    if (err) return res.json({ success: "false", message: err });
    if (isValid) return next();
    else {
      req.flash('formData', { email: req.body.user.email, nickname: req.body.user.nickname });
      res.redirect('back');
    }
  });
}

app.delete('/users/:id', hasEqualId, function(req, res) {
  User.findByIdAndRemove(req.params.id, req.body.user, function(err, user) {
    if (err) return res.json({ success: false, message: err });
    res.redirect('/');
  });
});

function hasEqualId(req, res, next) {
  if (req.isAuthenticated() && req.user._id == req.params.id) next();
  else {
    res.status(403).json({ success: false, message: '403 Forbidden' });
  }
}

app.listen(process.env.PORT || 3000, function() {
  console.log('Server on');
});
