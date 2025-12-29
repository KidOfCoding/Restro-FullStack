// Login and Sign in logic

import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import validator from "validator"
import axios from "axios"


// Login user
const loginUser = async (req, res) => {
    const { name, email, phone } = req.body;
    console.log(name, email, phone);

    try {
        const user = await userModel.findOne({ email })
        if (!user) {
            // If phone is not provided, do not create user -> Ask frontend to prompt user
            if (!phone) {
                return res.json({ success: false, message: "User not found", requireSignup: true });
            }

            const newUser = new userModel({
                name: name,
                email: email,
                phone: phone
            })
            const user = await newUser.save()
            const token = createToken(user._id)
            return res.json({ success: true, token })
        }

        const token = createToken(user._id)
        res.json({ success: true, token })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message || "Error" })
    }
}

// ... existing code ...



// Register User

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
}

const registerUser = async (req, res) => {
    const { name, password, email } = req.body;
    try {
        // Checking if user exist
        const exist = await userModel.findOne({ email });
        if (exist) {
            return res.json({ success: false, message: "User Already Exist!" })
        }

        //  Validating Email Format and Strong Password
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please Enter Valid Email!" })
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Enter Strong Password!" })
        }

        // Hashing User password using bcrypt
        const salt = await bcrypt.genSalt(10) //Can be set from 5 to 15 , higher the number higher the hashing 
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({
            name: name,
            email: email,
            password: hashedPassword
        })

        const user = await newUser.save()
        const token = createToken(user._id)
        res.json({ success: true, token })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Error" })
    }
}
const addPoints = async (req, res) => {
    try {
        const { email, amount } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "No user found" });
        }

        const prevPoints = user.points || 0;
        const roundNewPoints = Math.floor(amount / 50);
        const finalPoints = prevPoints + roundNewPoints;

        user.points = finalPoints;
        await user.save();

        return res.json({
            success: true,
            message: "Points added successfully",
            points: finalPoints
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


const getProfile = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await userModel.findById(userId);
        res.json({ success: true, userData: { points: user.points, name: user.name, email: user.email, phone: user.phone || "", address: user?.address, addresses: user.addresses || [] } });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

const updateProfile = async (req, res) => {
    try {
        const { userId, name, phone, address } = req.body;
        const user = await userModel.findByIdAndUpdate(userId, { name, phone, address }, { new: true });

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        res.json({ success: true, message: "Profile Updated", userData: { points: user.points, name: user.name, email: user.email, phone: user.phone || "", addresses: user.addresses || [] } });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error updating profile" });
    }
}

const getAddress = async (req, res) => {
    try {
        const { lat, lng } = req.query;
        if (!lat || !lng) {
            return res.json({ success: false, message: "Latitude and Longitude required" });
        }

        console.log(`Fetching address for Lat: ${lat}, Lng: ${lng}`);

        // Call Nominatim with strict User-Agent headers
        // Added a more descriptive User-Agent
        const response = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
            params: {
                format: 'json',
                lat: lat,
                lon: lng
            },
            headers: {
                'User-Agent': 'Restro77-App/1.0 (newak@example.com)'
            }
        });

        if (response.data && response.data.display_name) {
            res.json({ success: true, address: response.data.display_name });
        } else {
            console.log("Nominatim response missing display_name:", response.data);
            res.json({ success: false, message: "Address not found in Nominatim response" });
        }

    } catch (error) {
        console.error("Geocoding Proxy Error:", error.message);
        if (error.response) {
            console.error("Nominatim Status:", error.response.status);
            console.error("Nominatim Data:", error.response.data);
        }
        res.json({ success: false, message: "Error fetching address: " + error.message });
    }
}
const getUser = async (req, res) => {
    const { email } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
        res.json({ success: false, message: "User does not exist" });
    }
    res.json({ success: false, address: user?.address });
}
const updateaddress = async (req, res) => {
    const { email, address } = req.body;
    console.log(email);

    try {

        const user = await userModel.findOneAndUpdate(
            { email: email },        // 👈 filter must be an object
            { address: address },    // 👈 field to update
            { new: true }            // 👈 return updated document
        );

        console.log(user);

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        res.json({ success: true, message: "Profile Updated", userData: { points: user.points, name: user.name, email: user.email, phone: user.phone || "", address: user?.address } });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error updating profile" });
    }
}

const saveAddress = async (req, res) => {
    const { userId, address, label } = req.body;
    try {
        const user = await userModel.findById(userId);
        if (!user) return res.json({ success: false, message: "User not found" });

        if (!user.addresses) user.addresses = [];

        // Add new address
        user.addresses.push({ address, label: label || 'Home' });
        await user.save();

        res.json({ success: true, message: "Address Saved", addresses: user.addresses });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error saving address" });
    }
}

const deleteAddress = async (req, res) => {
    const { userId, addressId } = req.body;
    try {
        const user = await userModel.findById(userId);
        if (!user) return res.json({ success: false, message: "User not found" });

        // Filter out the address to delete
        // Check if addressId matches _id of subdocument
        user.addresses = user.addresses.filter(addr => addr._id.toString() !== addressId);
        await user.save();

        res.json({ success: true, message: "Address Deleted", addresses: user.addresses });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error deleting address" });
    }
}

export { loginUser, registerUser, addPoints, getProfile, updateProfile, getAddress, getUser, updateaddress, saveAddress, deleteAddress }