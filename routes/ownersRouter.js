const express = require("express");
const router = express.Router();
const ownerModel = require("../models/owner-model");

const bcrypt = require("bcrypt");
const isLoggedIn = require("../middlewares/isLoggedIn");
const userModel = require("../models/user-model");

if(process.env.NODE_ENV === "development"){
    router.post("/create", async function(req, res) {
        let owners = await ownerModel.find();
        if(owners.length > 0) {
            return res.status(503).send("You don't have permission to create new owner.");
        }
        
        let {fullname, email, password} = req.body;

        bcrypt.genSalt(10, (err, salt)=>{
            bcrypt.hash(password, salt, async (err, hash) => {
                let createdOwner = await ownerModel.create({
                    fullname,
                    email,
                    password,
                });

                res.status(201).send(createdOwner);
            });
        });
    });
}

router.get("/admin", isLoggedIn, async function (req, res) {
    let user = await userModel.findOne({ email: req.user.email });
    let success = req.flash("success");
    res.render("createproducts.ejs", { success, user, currentPage: "Admin" });
});

module.exports = router;