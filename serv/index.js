/**
 * @file serv
 */

var logger = require('koa-logger');
var route = require('koa-route');
var serve = require('koa-static');
var koa = require('koa');
var app = koa();

// "database"

var db = require('./lib/data');

// middleware

app.use(logger());

// route middleware

app.use(route.get('/list', list));
app.use(route.get('/list/:id', list));
app.use(route.get('/thing/:key', thing));

// serve files from ./public
app.use(serve(require('path').dirname(__dirname) + '/fe'));

// route definitions
function *list(page) {
    this.body = JSON.stringify(yield db.list(page));
}

function *thing(key) {
    this.body = JSON.stringify(yield db.get(key));
}

// listen
app.listen(8830);
console.log('listening on port 8830');