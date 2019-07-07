var mysql = require('mysql')
var dbconfig = require('../config/database')
var connection = mysql.createConnection(dbconfig.connection)
var express = require('express')
var path = require('path')
var mime = require('mime')
var bcrypt = require('bcrypt-nodejs')
var fs = require('fs')
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
    path: 'out.csv',
    header: [
        { id: 'chno', title: 'Channel No' },
        { id: 'timestamp', title: 'Time Stamp' },
        { id: 'status', title: 'Status' },
        { id: 'label', title: 'Label' },
        { id: 'location', title: 'Location' },
    ]
});
module.exports = function (app, passport) {
    /*app.get('/', function (req, res) {
        res.render('index.ejs')
    })*/
    app.get('/login', function (req, res) {
        res.render('login.ejs', { message: req.flash('loginMessage') })
    })
    app.get('/admin', isadminLoggedIn, function (req, res) {
        res.render('admin')
    })

    app.post('/login', passport.authenticate('local-login', {
        failureRedirect: '/login',
        failureFlash: true
    }),
        function (req, res) {
            if (req.body.remember) {
                req.session.cookie.maxAge = 100 * 60 * 3
            }
            else {
                req.session.cookie.expires = false
            }
            if (req.user.type == 1)
                res.redirect('/')
            else
                res.redirect('/admin?id=' + req.user.id)
        }
    )

    app.get('/signup', function (req, res) {
        res.render('signup.ejs', { message: req.flash('signupMessage') })
    })

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/',
        failureRedirect: '/signup',
        failureFlash: true
    }))
    app.post('/adduser', function (req, res) {
        connection.query('SELECT * FROM users where username = ?',
            [req.body.username], function (err, rows) {
                if (err)
                    console.log(err)
                if (rows.length) {
                    console.log("length error!")
                }
                else {
                    var newUserMysql = {
                        username: req.body.username,
                        password: bcrypt.hashSync(req.body.password, null, null)

                    }
                    var u_type = 1;
                    console.log('--=--=', req.body.type)
                    if (req.body.type == 'true') {
                        u_type = 0
                        console.log("sfds")
                    }
                    var insertQuery = "INSERT INTO users(username, password, type) VALUES(?, ?, ?)"
                    connection.query(insertQuery, [newUserMysql.username, newUserMysql.password, u_type],
                        (err, rows) => {
                            newUserMysql.id = rows.insertId;
                            res.send("Success")
                        })
                }
            })
    })

    let reqPath = path.join(__dirname, '../')
    app.get('/', isLoggedIn, function (req, res) {
        res.render('home', { name: req.user.username })
    })

    //app.use('/home', express.static(reqPath + 'public_static'))

    app.get('/logout', function (req, res) {
        req.logout()
        res.redirect('/login')
    })

    app.get('/getLocations', function (req, res) {
        connection.query('USE ' + dbconfig.database)
        connection.query("SELECT * FROM locations", (err, rows, fields) => {
            if (err)
                console.log(err)
            res.send(rows)
        })
    })
    app.post('/getData', function (req, res) {
        connection.query('USE ' + dbconfig.database)
        connection.query("SELECT * FROM energy where group_id = ? and location = ?", [req.body.groupid, req.body.locationid], (err, rows, fields) => {
            if (err)
                console.log(err)
            res.send(rows)
        })
    })
    app.post('/getTopData', function (req, res) {
        connection.query('USE ' + dbconfig.database)
        connection.query("select * from energy where location = ? order by time desc limit 12", [req.body.locationid], (err, rows, fields) => {
            if (err)
                console.log(err)
            res.send(rows)
        })
    })
    app.post('/getWeeklyData', function (req, res) {
        connection.query('USE ' + dbconfig.database)
        connection.query("select sum(energy) as total, day(time) as day, dayname(time) as dayname from energy where location = ? and group_id = ? and week(time) = ? group by day(time), dayname(time)", [req.body.locationid, req.body.groupid, req.body.weekid], (err, rows, fields) => {
            if (err)
                console.log(err)
            res.send(rows)
        })
    })
    app.post('/getWeeklyRoomsData', function (req, res) {
        connection.query('USE ' + dbconfig.database)
        console.log(req.body.locationid, req.body.weekid, req.body.rmn);
        connection.query("select sum(energy) as total, day(time) as day, dayname(time) as dayname from rooms_data where location = ? and week(time) = ? and room_number = ? group by day(time), dayname(time);", [req.body.locationid, req.body.weekid, req.body.rmn], (err, rows, fields) => {
            if (err)
                console.log(err)
            res.send(rows)
        })
    })
    app.post('/getRooms', function (req, res) {
        connection.query('USE ' + dbconfig.database)
        connection.query("select distinct(room_number) as rmn from rooms_data where location = ?", [req.body.locationid], (err, rows, fields) => {
            if (err)
                console.log(err)
            res.send(rows)
        })
    })
    app.post('/AllData', function (req, res) {
        connection.query('USE ' + dbconfig.database)
        connection.query("select sum(energy) as sum, group_id as id from energy where location = ? and date(time) = ? group by group_id;", [req.body.locationid, req.body.date], (err, rows, fields) => {
            if (err)
                console.log(err)
            res.send(rows)
        })
    })
    app.post('/getRoomsData', function (req, res) {
        connection.query('USE ' + dbconfig.database)
        connection.query("SELECT * FROM rooms_data where room_number = ? and location = ?", [req.body.rmn, req.body.locationid], (err, rows, fields) => {
            if (err)
                console.log(err)
            res.send(rows)
        })
    })
    app.post('/getTopRooms', function (req, res) {
        connection.query('USE ' + dbconfig.database)
        connection.query("select room_number, energy, status from rooms_data where location = ? order by time(time) desc limit 13;", [req.body.locationid], (err, rows, fields) => {
            if (err)
                console.log(err)
            res.send(rows)
        })
    })
}
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }

    res.redirect('/login')
}
function isadminLoggedIn(req, res, next) {
    if (req.user.type == 0) {
        return next()
    }

    res.redirect('/')
}

function getData3(loc, res) {
    connection.query('USE ' + dbconfig.database)
    connection.query("SELECT * FROM tb_status where chno >= 33 and chno <= 36 and location = (SELECT id from locations l WHERE l.location = ?)", [loc], (err, rows, fields) => {
        if (err)
            console.log(err)
        //console.log(rows)
        res.send(rows)
    })
}