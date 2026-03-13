const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "mysecretkey";

// register (render form)
exports.registerPage = (req, res) => res.render("register");

// login (render form)
exports.loginPage = (req, res) => res.render("login");

// register
exports.register = async (req, res) => {
    try {

        const { username, password } = req.body;

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            password: hashedPassword
        });

        await user.save();

        res.redirect("/auth/login");

    } catch (err) {
        res.render("register", { error: err.message });
    }
};



// login (POST) — trả về redirect thay vì JSON
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.render("login", { error: "Invalid username or password" });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "1d" });

        // Lưu token vào cookie (hoặc session)
        res.cookie("token", token, { httpOnly: true });
        res.redirect("/");
    } catch (err) {
        res.render("login", { error: err.message });
    }
};