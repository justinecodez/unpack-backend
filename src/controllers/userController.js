const User = require("../models/User");
const jwt = require('jsonwebtoken');
const db = require('../util/db');
const { v4: uuidv4 } = require('uuid');
const END_NUMBER = 1000000;
const cloudinary = require('../util/cloudinary');

module.exports = {
    registerUser: async (req, res) => {
        const { username, phone, password, confirm, location, expoPushToken, status } = req.body;
        
        if (!username || !phone || !password || !confirm || !status) {
            return res.json({ success: false, message: "Fill empty fields" });
        }
        if (password !== confirm) {
            return res.json({ success: false, message: "Password must match" });
        } else {
            try {
                const user = await User.findOne({ phone: phone });
                if (user) {
                    return res.json({ success: false, message: `${username} is not available.` });
                } else {
                    //Validation
                    const userCount = await db.users.countDocuments({ });
                    const newUser = new User({
                        userId: `U-${uuidv4()}-${END_NUMBER + userCount + 1}`,
                        username,
                        phone,
                        location,
                        password,
                        status,
                        deliveries: [],
                        expoPushToken
                    });
                    await newUser.save();
                    return res.status(201).send({ success: true, data: newUser });
                }
            } catch (error) {
                return res.json({ success: false, message: error.message });
            }
        }
    },

    loginUser: async (req, res) => {
        const { username, password } = req.body;
        try {
            const user = await User.findOne({ username });
            const isMatch = await user.comparePassword(password);
            if (!user) {
                return res.json({ success: false, error: 'Incorrect username.' });
            }

            if (!isMatch) {
                return res.json({ success: false, error: 'Incorrect password.' });
            }
            const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET_CODE, { expiresIn: '30d'});
            return res.json({ success: true, userID: user._id, token, expoPushToken: user.expoPushToken, profilePhoto: user.profilePhoto });
        } catch (error) {
            return res.json({ success: false, error: error.message });
        }
    },

    uploadProfilePicture: async (req, res) => {
        const { userId } = req;
        try {
        const profilePhotObj = await cloudinary.uploader.upload(
            req.file.path,
            {
                public_id: `Rbesha01_profile`,
                width: 500,
                height: 500, 
                crop: 'fill'
            }
        )
        await db.users.updateOne({ username: 'Rbesha01'}, {$set : { profilePhoto: profilePhotObj.secure_url }});
        res.json({ success: true, message: 'Profile picture successfully updated.', body: {
            profileUrl: profilePhotObj.secure_url
        }})
        } catch (error) {
            res.json({ success: false, message: error.message})
        }
    },

     updateUserInfo: async (req, res) => {
        const { userId } = req.body;
        try {
            await db.users.updateOne(
                { _id: userId },
                {
                    $set: {
                        ...req.body
                    }
                }
            );
            return res.json({ success: true, message: 'Partner info has updated successfully.' });
        } catch (error) {
            return res.json({ success: false, message: error.message });
        }
    }
};