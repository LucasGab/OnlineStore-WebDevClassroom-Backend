'use strict';
module.exports = function(app) {
    var userHandlers = require('../controllers/userController.js');
    app.route('/api/tasks')
        .post(userHandlers.loginRequired, userHandlers.profile);
    app.route('/api/auth/register')
        .post(userHandlers.register);
    app.route('/api/auth/sign_in')
        .post(userHandlers.sign_in);
};