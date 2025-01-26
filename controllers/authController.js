const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/generateToken");

module.exports.registerUser = async function(req, res) {
    let {email, password, fullname} = req.body;

    let user = await userModel.findOne({ email: email });
    if(user) {
        req.flash("error", "You already have an account, please login.");
        return res.redirect("/");
    }
    
    try {
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(password, salt, async function (err, hash){
                if(err) return res.send(err.message);
                else {
                    let user = await userModel.create({
                        email,
                        password: hash,
                        fullname,
                    });
                    
                    let token = generateToken(createdUser);
                    req.flash("message", "You have registered Successfully.");
                    res.cookie("token", token);
                    res.redirect("/shop")
                }
            });
        });
    } catch (err) {
        res.send(err.message);
    }
};

module.exports.loginUser = async function (req, res) {
    let { email, password } = req.body;
    let user = await userModel.findOne({ email: email });

    if(!user) {
        req.flash("error", "Email or Password incorrect");
        return res.redirect("/");
    }

    bcrypt.compare(password, user.password, function(err, result){
        if(result) {
            let token = generateToken(user);
            res.cookie("token", token);
            res.redirect("/shop");
        } else {
            req.flesh("error", "Email or Password incorrect");
            return res.redirect("/");
        }
    });
};

module.exports.logout = function (req, res) {
    res.cookie("token", "");
    res.redirect("/");
};

module.exports.user = async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.user.email });
        if(!user) {
            req.flash("error", "User not found.");
            return res.redirect("/");
        } else {
            let error = req.flash("error");
            res.render("user.ejs", { user, logedin: true, error});
        }
    } catch (error) {
        req.flash("error", "Something went Wrong.");
        return res.redirect("/");
    }
};

module.exports.userupload = async function (req, res) {
    const buffer = req.file.buffer;
    await userModel.findOneAndUpdate(
        { email: req.user.email },
        { picture: buffer },
        { new: true }
    );

    res.redirect("/users/profile");
}

module.exports.user;