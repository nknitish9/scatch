const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middlewares/isLoggedIn");
const productModel = require("../models/product-model");
const userModel = require("../models/user-model");

router.get("/", function(req, res, next){
    let error = req.flash("error");
    res.render("index.ejs", { error, loggedin: false });
});

router.get("/shop", isLoggedIn, async function(req, res) {
    let user = await userModel.findOne({ email: req.user.email });
    let products = await productModel.find();
    let success = req.flash("success");
    res.render("shop.ejs", { products, success, currentPage: "shop", user });
});

router.get("/addtocart/:productid", isLoggedIn, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email });
    user.cart.push(req.params.productid);
    await user.save();
    req.flash("success", "Added to Cart.");
    res.redirect("/shop");
});

router.get("/discart/:productid", isLoggedIn, async (req, res) => {
    try {
        let user = await userModel.findOne({ email: req.user.email});

        const productIndex = user.cart.indexOf(req.params.productid);

        if(productIndex > -1) {
            user.cart.splice(productIndex, 1);
            await user.save();
            req.flash("success", "Removed from Cart.");
        } else {
            req.flash("success", "Product not found in cart.");
        }

        res.redirect("/cart");
    } catch (error) {
        console.log(error);
        req.flash(
            "success",
            "An error occured while removing the product from the cart."
        );
        res.redirect("/shop");
    }
});

router.get("/cart", isLoggedIn, async function(req, res) {
    let user = await userModel
        .findOne({ email: req.user.email })
        .populate("cart");
    const success = req.flash("success");
    let discountamount = 0;
    let totalamount = 0;

    user.cart.forEach((product) => {
        discountamount += Number(product.discount);
        totalamount += Number(product.price);
    })

    let finalprice = totalamount - discountamount;

    res.render("cart.ejs", { user, success, currentPage: "cart", finalprice, discountamount, totalamount });
});

module.exports = router;