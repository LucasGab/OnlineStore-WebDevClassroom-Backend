'use strict';
module.exports = function(app) {
    var bookHandlers = require('../controllers/bookController.js');
    app.route('/api/frontbooks')
        .get(bookHandlers.frontbooks);
    app.route('/api/book/:name')
        .get(bookHandlers.book);
};