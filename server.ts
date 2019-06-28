import express = require('express')
import session = require('express-session')
import cookieParser = require('cookie-parser')
import bodyParser = require('body-parser')
const app: express.Application = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)


var passport = require('passport')
var flash = require('connect-flash')
var MySQLEvents = require('mysql-events');
var dsn = {
    host: 'localhost',
    user: 'ecom',
    password: 'password_123',
};
var mysqlEventWatcher = MySQLEvents(dsn);

require('./config/passport')(passport);
app.engine('html', require('ejs').renderFile);
app.use(cookieParser())
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(session({
    secret: "whateversecre",
    resave: true,
    saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use(express.static(__dirname + '/public_static'))

app.set('view engine', 'ejs');

io.on('connection', function (socket: any) {
    var watcher = mysqlEventWatcher.add(
        'try2.tb_status',
        function (oldRow: any, newRow: any, event: any) {
            console.log("Old Row: ", oldRow)
            console.log("New Row: ", newRow)

            if (newRow)
                socket.emit('trydata', newRow.fields);
        },
        'match this string or regex'
    );
    console.log('User Active')
});

require('./app/routes.js')(app, passport)

var port = process.env.PORT || 1337;
http.listen(port, function () {
    console.log(`App listening at ${port}`)
})