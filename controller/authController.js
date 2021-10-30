const User = require("../models/User");
const jwt = require("jsonwebtoken");
const maxAge = 60 * 60 * 24;

const createToken = (id) => {
    return jwt.sign({ id }, "secret key", { expiresIn: maxAge });
};

const login = async (req, res, next) => {
    const { username, password } = req.body;
    try {
        const user = await User.login(username, password);
        const token = user.generate;
        res.cookie("cookie", token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({
            success: true,
            user: user,
        });
    } catch (err) {
        res.status(400).json({
            error: err.message,
        });
    }
};

const register = async (req, res, next) => {
    const { username, password } = req.body;
    try {
        const user = await User.create({
            username,
            password,
        });
        res.status(201).send(user);
    } catch (err) {
        if (err.code === 11000) {
            res.status(404).json({
                error: "Please enter a valid username",
            });
        }
    }
};

const logout = (req, res) => {
    res.cookie("cookie", "", { maxAge: 1 });
    res.send("Log Out");
};

module.exports = { login, register, logout };
