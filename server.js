require('dotenv').config()
var morgan = require('morgan')
var express = require('express')
var exphbs = require('express-handlebars')
// Requiring passport as we've configured it
// var passport = require('./config/passport')
var session = require('express-session')
var db = require('./models')

var app = express()
var PORT = process.env.PORT || 3000

// Middleware
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static('public'))

console.log(__dirname)

// Handlebars
app.engine(
  'handlebars',
  exphbs({
    defaultLayout: 'main'
  })
)
app.set('view engine', 'handlebars')
// We need to use sessions to keep track of our user's login status
app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true }))
// app.use(passport.initialize())
// app.use(passport.session())
// Routes
require('./routes/apiRoutes')(app)
require('./routes/htmlRoutes')(app)

var syncOptions = { force: true }

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === 'test') {
  syncOptions.force = true
}

// Starting the server, syncing our models ------------------------------------/
db.sequelize.sync(syncOptions).then(function () {
  app.listen(PORT, function () {
    console.log(
      '==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.',
      PORT,
      PORT
    )
  })
})

module.exports = app
