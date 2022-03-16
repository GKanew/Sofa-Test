module.exports.isLoggedIn = (req, res, next) => {
    //console.log("User: ", req.user)
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    next();
}

