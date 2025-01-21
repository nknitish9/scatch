const jwt = require("jsonwebtoken");
const userModel = require("../models/user-model");

module.exports = async function (req, res) {
    if(!req.cookies.token) {
        req.flash("error", "you needto login first");
        return res.redirect("/");
    }

    try {
        let decode = jwt.verify(req.cookies.token, process.env.JWT_KEY);
        let user = await userModel
            .findOne({ email: email })
            .select("-password");

        req.user = user;

        next();
    } catch (err) {
        req.flash("error", "something went wrong.");
        res.redirect("/");
    }
};