'use strict';
module.exports = function(app) {
    var userHandlers = require('../controllers/userController.js');
    app.route('/api/user')
        .get(userHandlers.loginRequired, userHandlers.user)
    app.route('/api/user/:id')
        .patch(userHandlers.loginRequired, userHandlers.modifyUser);
    app.route('/api/wishList')
        .post(userHandlers.loginRequired, userHandlers.addWishList)
        .get(userHandlers.loginRequired, userHandlers.wishList)
    app.route('/api/wishList/:book_id')
        .delete(userHandlers.loginRequired, userHandlers.deleteWishList);
    app.route('/api/auth/register')
        .post(userHandlers.register);
    app.route('/api/auth/sign_in')
        .post(userHandlers.sign_in);
};