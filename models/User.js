const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, "Please enter a Username!"],
        unique: [true, "This username is not valid !!"],
    },
    password: {
        type: String,
        required: [true, "Please enter a Password!"],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

userSchema.pre("save", async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.statics.login = async function (username, password) {
    const user = await this.findOne({ username });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        } else {
            throw Error("Wrong Password");
        }
    } else {
        throw Error("This username doesnt exist");
    }
};

module.exports = mongoose.model("User", userSchema);
