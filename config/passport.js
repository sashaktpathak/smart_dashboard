var LocalStrategy = require("passport-local").Strategy
var mysql = require('mysql')
var bcrypt = require('bcrypt-nodejs')
var dbconfig = require('./database')
var connection = mysql.createConnection(dbconfig.connection)

connection.query('USE ' + dbconfig.database)

module.exports = function (passport) {
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    })

    passport.deserializeUser(function (id, done) {
        connection.query('SELECT * FROM users WHERE id = ?', [id], (err, rows, fields) => {
            done(err, rows[0])
        })

    })

    passport.use('local-signup', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    },
        function (req, username, password, done) {
            connection.query('SELECT * FROM users where username = ?',
                [username], function (err, rows) {
                    if (err)
                        return done(err)
                    if (rows.length) {
                        return done(null, false, req.flash("signupMessage", "That is already Taken"))
                    }
                    else {
                        var newUserMysql = {
                            username: username,
                            password: bcrypt.hashSync(password, null, null)

                        }
                        var u_type = 1;
                        if (req.body.type)
                            u_type = 0
                        var insertQuery = "INSERT INTO users(username, password, type) VALUES(?, ?, ?)"
                        connection.query(insertQuery, [newUserMysql.username, newUserMysql.password, u_type],
                            (err, rows) => {
                                newUserMysql.id = rows.insertId;

                                return done(null, newUserMysql)
                            })
                    }
                })
        }
    )
    )

    passport.use('local-login',
        new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true
        },
            function (req, username, password, done) {
                connection.query("SELECT * FROM users where username = ?", [username],
                    function (err, rows) {
                        if (err)
                            return done(err)
                        if (!rows.length) {
                            return done(null, false, req.flash('loginMessage', 'No User Found'))
                        }
                        if (!bcrypt.compareSync(password, rows[0].password))
                            return done(null, false, req.flash('loginMessage', 'Wrong Password'))
                        if (!rows[0].active)
                            return done(null, false, req.flash('loginMessage', 'User Deactivated, Contact Administrator.'))
                        return done(null, rows[0])
                    })
            }))
}