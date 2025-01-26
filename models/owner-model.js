const mongoose = require("mongoose");

const ownerSchema = mongoose.Schema({
    fullname: {
        type: String,
        minlength: 3,
        trim: true,
    },
    email: String,
    password: String,
    products: {
        type: Array,
        default: [],
    },
    picture: String,
    gstin: String,
    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("owner", ownerSchema);