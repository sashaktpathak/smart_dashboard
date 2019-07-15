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
                    var insertQuery = "INSERT INTO users(username, password, type, active) VALUES(?, ?, ?, 1)"
                    connection.query(insertQuery, [newUserMysql.username, newUserMysql.password, u_type],
                        (err, rows) => {
                            newUserMysql.id = rows.insertId;
                            res.send("Success")
                        })
                }
            })
    })
    app.post('/getUsersProperty', function (req, res) {
        connection.query('USE ' + dbconfig.database)
        connection.query("SELECT * FROM user_property order by id", (err, rows, fields) => {
            if (err)
                console.log(err)
            res.send(rows)
        })
    })
    let reqPath = path.join(__dirname, '../')
    app.get('/', isLoggedIn, function (req, res) {
        res.render('home', { name: req.user.username, user_id: req.user.id })
    })

    //app.use('/home', express.static(reqPath + 'public_static'))

    app.get('/logout', function (req, res) {
        req.logout()
        res.redirect('/login')
    })

    app.get('/getLocations', function (req, res) {
        connection.query('USE ' + dbconfig.database)
        connection.query("SELECT * FROM locations order by id", (err, rows, fields) => {
            if (err)
                console.log(err)
            res.send(rows)
        })
    })
    app.get('/getGroupsCount', function (req, res) {
        connection.query('USE ' + dbconfig.database)
        connection.query("select count(distinct(group_id)) as gcount from groups g1 where g1.locationid = ? ", [req.query.location_id], (err, rows, fields) => {
            if (err)
                console.log(err)
            res.send(rows)
        })
    })
    app.post('/getSubGroupsCount', function (req, res) {
        connection.query('USE ' + dbconfig.database)
        connection.query("select count(distinct(subgroup_name)) as sgcount from subgroups where locationid = ? and parentgroup_id = ?; ", [req.body.location_id, req.body.parentgroup_id], (err, rows, fields) => {
            if (err)
                console.log(err)
            res.send(rows)
        })
    })
    app.post('/getGroups', function (req, res) {
        connection.query('USE ' + dbconfig.database)
        connection.query("select g.group_name, g.group_id, e.status, e.energy, g.subgroup from energy e , groups g where e.group_id = g.group_id and e.location = g.locationid and g.locationid = ? order by e.time desc limit ?;", [req.body.location_id, parseInt(req.body.count)], (err, rows, fields) => {
            if (err)
                console.log(err)
            res.send(rows)
        })
    })
    app.post('/getSubGroups', function (req, res) {
        connection.query('USE ' + dbconfig.database)
        connection.query(" select s.subgroup_id, s.parentgroup_id, s.locationid, se.time, s.subgroup_name, se.energy from subgroups s, subgroups_energy se where s.locationid = ? and s.subgroup_id = se.subgroup_id and s.subgroup_name = se.subgroup_name  and s.parentgroup_id = ? order by time desc limit ?;", [req.body.location_id, req.body.parentgroup_id, parseInt(req.body.sgcount)], (err, rows, fields) => {
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
    app.post('/deleteUserProperty', function (req, res) {
        connection.query('USE ' + dbconfig.database)
        connection.query("delete from user_property where user_id = ? and locationid = ?", [req.body.user_id, req.body.locationid], (err, rows, fields) => {
            if (err)
                console.log(err)
            res.send(rows)
        })
    })
    app.post('/insertUserProperty', function (req, res) {
        connection.query('USE ' + dbconfig.database)
        connection.query("select * from user_property where user_id = ? and locationid = ?", [req.body.user_id, req.body.locationid], (err1, rows1, fields1) => {
            if (!rows1.length) {
                connection.query("insert into user_property(user_id, locationid) values(?,?)", [req.body.user_id, req.body.locationid], (err, rows, fields) => {
                    if (err)
                        console.log(err)
                    res.send(rows)
                })
            }
            else {
                res.send(rows1)
            }
        })
    })
    app.post('/getMonthlyData', function (req, res) {
        connection.query('USE ' + dbconfig.database)
        connection.query("select sum(energy) as total, day(time) as day from energy where location = ? and group_id = ? and month(time) = ? group by day(time)", [req.body.locationid, req.body.groupid, req.body.weekid], (err, rows, fields) => {
            if (err)
                console.log(err)
            res.send(rows)
        })
    })
    app.post('/getMonthlyRoomsData', function (req, res) {
        connection.query('USE ' + dbconfig.database)
        connection.query("select sum(energy) as total, day(time) as day from rooms_data where location = ? and month(time) = ? and room_number = ? group by day(time)", [req.body.locationid, req.body.monthid, req.body.rmn], (err, rows, fields) => {
            if (err)
                console.log(err)
            res.send(rows)
        })
    })
    app.post('/getWeeklyRoomsData', function (req, res) {
        connection.query('USE ' + dbconfig.database)
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
    app.post('/getLinesData', function (req, res) {
        connection.query('USE ' + dbconfig.database)
        connection.query("select g.group_name, g.group_id,time(e.time) as time, e.energy, g.subgroup from energy e , groups g where e.group_id = g.group_id and e.location = g.locationid and g.locationid = ? and e.group_id = ? and date(e.time) = ? order by e.time desc", [req.body.locationid, req.body.group_id, req.body.date], (err, rows, fields) => {
            if (err)
                console.log(err)
            res.send(rows)
        })
    })
    app.post('/admin@allusers', function (req, res) {
        connection.query('USE ' + dbconfig.database)
        connection.query('SELECT id,username,type,active FROM users', (err, rows, fields) => {
            if (err)
                console.log(err)
            res.send(rows)
        })

    })
    app.post('/admin@deluser', function (req, res) {
        connection.query('USE ' + dbconfig.database)
        connection.query('DELETE FROM users where id = ?', [req.body.id], (err, rows, fields) => {
            if (err)
                console.log(err)
            res.send("Success")
        })

    })
    app.post('/admin@deactivate', function (req, res) {
        connection.query('USE ' + dbconfig.database)
        connection.query('UPDATE users SET active = 0 where id = ?', [req.body.id], (err, rows, fields) => {
            if (err)
                console.log(err)
            res.send("Success")
        })

    })
    app.post('/admin@activate', function (req, res) {
        connection.query('USE ' + dbconfig.database)
        connection.query('UPDATE users SET active = 1 where id = ?', [req.body.id], (err, rows, fields) => {
            if (err)
                console.log(err)
            res.send("Success")
        })

    })
    app.post('/apply_changes@password', function (req, res) {
        var npswd = bcrypt.hashSync(req.body.npwd, null, null)
        connection.query('USE ' + dbconfig.database)
        connection.query('UPDATE users SET password = ? WHERE id = ?', [npswd, req.body.id], (err, rows, fields) => {
            if (err)
                console.log(err)
            res.send("Success")
        })
    })
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
    app.post('/getWeeklyLinesData', function (req, res) {
        connection.query('USE ' + dbconfig.database)
        connection.query("select g.group_name, g.group_id,dayname(e.time) as dayname, e.energy from energy e , groups g where e.group_id = g.group_id and e.location = g.locationid and g.locationid = ? and e.group_id = ? and week(time) = ? order by e.time desc;", [req.body.locationid, req.body.group_id, req.body.weekid], (err, rows, fields) => {
            if (err)
                console.log(err)
            res.send(rows)
        })
    })

    app.post('/getMonthlyLinesData', function (req, res) {
        connection.query('USE ' + dbconfig.database)
        connection.query("select g.group_name, g.group_id,day(e.time) as day, e.energy from energy e , groups g where e.group_id = g.group_id and e.location = g.locationid and g.locationid = ? and e.group_id = ? and month(time) = ? order by e.time desc;", [req.body.locationid, req.body.group_id, req.body.monthid], (err, rows, fields) => {
            if (err)
                console.log(err)
            res.send(rows)
        })
    })
    app.post('/getCustomLinesData', function (req, res) {
        connection.query('USE ' + dbconfig.database)
        connection.query("select g.group_name, g.group_id, e.time as dates, e.energy from energy e , groups g where e.group_id = g.group_id and e.location = g.locationid and g.locationid = ? and e.group_id = ? and date(time) >= ? and date(time) <= ? order by e.time desc;", [req.body.locationid, req.body.group_id, req.body.fromdate, req.body.todate], (err, rows, fields) => {
            if (err)
                console.log(err)
            res.send(rows)
        })
    })
    app.post('/getSubLinesData', function (req, res) {
        connection.query('USE ' + dbconfig.database)
        connection.query("select * from subgroups_energy where locationid = ? and date(time) = ? and subgroup_name = ?", [req.body.locationid, req.body.date, req.body.subgroup_name], (err, rows, fields) => {
            if (err)
                console.log(err)
            res.send(rows)
        })
    })

    app.post('/getWeeklySubLinesData', function (req, res) {
        connection.query('USE ' + dbconfig.database)
        connection.query("select energy, subgroup_name, dayname(time) as dayname from subgroups_energy where locationid = ? and week(time) = ? and subgroup_name = ?", [req.body.locationid, req.body.weekid, req.body.subgroup_name], (err, rows, fields) => {
            if (err)
                console.log(err)
            res.send(rows)
        })
    })

    app.post('/getMonthlySubLinesData', function (req, res) {
        connection.query('USE ' + dbconfig.database)
        connection.query("select energy, subgroup_name, day(time) as day from subgroups_energy where locationid = ? and month(time) = ? and subgroup_name = ?", [req.body.locationid, req.body.monthid, req.body.subgroup_name], (err, rows, fields) => {
            if (err)
                console.log(err)
            res.send(rows)
        })
    })
    app.post('/getCustomSubLinesData', function (req, res) {
        connection.query('USE ' + dbconfig.database)
        connection.query("select energy, subgroup_name, date(time) as dates from subgroups_energy where locationid = ? and date(time) >= ? and date(time) <= ? and subgroup_name = ?", [req.body.locationid, req.body.fromdate, req.body.todate, req.body.subgroup_name], (err, rows, fields) => {
            if (err)
                console.log(err)
            res.send(rows)
        })
    })
    app.post('/AllData', function (req, res) {
        connection.query('USE ' + dbconfig.database)
        connection.query("select sum(energy) as sum, group_id as id, group_name as grpname from energy where location = ? and date(time) = ? group by group_id, group_name", [req.body.locationid, req.body.date], (err, rows, fields) => {
            if (err)
                console.log(err)
            res.send(rows)
        })
    })
    app.post('/AllWeeklyData', function (req, res) {
        connection.query('USE ' + dbconfig.database)
        connection.query("select sum(energy) as sum, group_id as id, group_name as grpname from energy where location = ? and week(time) = ? group by group_id, group_name", [req.body.locationid, req.body.week], (err, rows, fields) => {
            if (err)
                console.log(err)
            res.send(rows)
        })
    })
    app.post('/AllMonthlyData', function (req, res) {
        connection.query('USE ' + dbconfig.database)
        connection.query("select sum(energy) as sum, group_id as id, group_name as grpname from energy where location = ? and month(time) = ? group by group_id, group_name", [req.body.locationid, req.body.month], (err, rows, fields) => {
            if (err)
                console.log(err)
            res.send(rows)
        })
    })
    app.post('/AllCustomData', function (req, res) {
        connection.query('USE ' + dbconfig.database)
        connection.query("select sum(energy) as sum, group_id as id, group_name as grpname from energy where location = ? and date(time) >= ? and date(time) <= ? group by group_id, group_name", [req.body.locationid, req.body.date1, req.body.date2], (err, rows, fields) => {
            if (err)
                console.log(err)
            res.send(rows)
        })
    })
    app.get('/allroomscount', function (req, res) {
        connection.query('USE ' + dbconfig.database)
        connection.query("select count(distinct(subgroup_name)) as room_count from subgroups where parentgroup_id = 8 group by locationid", [req.body.locationid, req.body.date1, req.body.date2], (err, rows, fields) => {
            if (err)
                console.log(err)
            res.send(rows)
        })
    })
    app.get('/getdistinctsubgroups', function (req, res) {
        connection.query('USE ' + dbconfig.database)
        connection.query("select distinct(subgroup_name) from subgroups_energy where locationid = ?", [req.query.locationid], (err, rows, fields) => {
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