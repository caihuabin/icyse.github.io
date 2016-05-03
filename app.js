var express = require('express');
var app = express();

// middleware
// uncomment after placing your favicon in /public
app.use(express.static(__dirname));
app.set('views', __dirname);
app.set('view engine', 'jade');

app.get('/', function(req, res, next){
    res.render('index');
});
app.get('/views/about/index', function(req, res, next){
    res.render('views/about/index');
});
app.get('/views/blog/index', function(req, res, next){
    res.render('views/blog/index');
});
app.get('/views/blog/show', function(req, res, next){
    res.render('views/blog/show');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.json({
            status: 'fail',
            error: err.message
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
