const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    fullname: {
        type: String,
        minlength: 3,
        trim: true,
    },
    email: String,
    password: String,
    cart: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product",
        }
    ],
    order: {
        type: Array,
        default: [],
    },
    contact: {
        type: Number,
        default: +91,
        minLength: 10,
    },
    picture: {
        type: Buffer,
        default: Buffer.alloc(0),
    },
    address: {
        village: {
            type: String,
            default: ""
        },
        post: {
            type: String,
            default: ""
        },
        district: {
            type: String,
            default: ""
        },
        state: {
            type: String,
            default: ""
        }
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("user", userSchema);