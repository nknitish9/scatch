const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    image: String,
    name: String,
    price: Number,
    discount: {
        tupe: Number,
        default: 0,
    },
    bgcolor: String,
    panecolor: String,
    textcolor: String
});

module.exports = mongoose.model("product", productSchema);