const User = require('../models/user');
const bcrypt = require('bcrypt');
const path = require('path');

exports.loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (!user) return res.status(400).send('Username not found');

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) return res.status(400).send('Incorrect password');

        req.session.user = user;


        return res.redirect('/home');
    } catch (err) {
        console.error(err);
        return res.status(500).send('Internal server error');
    }
};
