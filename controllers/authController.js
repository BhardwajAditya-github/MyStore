import JWT from "jsonwebtoken";
import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
export const registerController = async (req, res) => {
    try {
        const { name, email, password, phone, address } = req.body
        if (!name) {
            return res.send({ message: "Name is required" });
        }
        if (!email) {
            return res.send({ message: "Email is required" });
        }
        if (!password) {
            return res.send({ message: "Password is required" });
        }
        if (!phone) {
            return res.send({ message: "Phone is required" });
        }
        if (!address) {
            return res.send({ message: "Address is required" });
        }
        // EXISTING USER
        const existingUser = await userModel.findOne({ email })
        if (existingUser) {
            return res.status(200).send({
                success: false,
                message: "Already registered please login"
            })
        }

        // REGISTER USER
        const hashedPassword = await hashPassword(password)
        const user = await new userModel({ name, email, phone, address, password: hashedPassword }).save();
        res.status(201).send({
            success: true,
            message: "User registered Successfully",
            user
        })
    }
    catch (error) {
        console.log(error)
        res.status(500).send({
            succes: false,
            message: "Error in registration",
            error
        })
    }
}

// POST LOGIN
export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(404).send({
                success: false,
                message: 'Invalid email or password'
            })
        }
        // CHECK USER
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).send({
                succes: false,
                message: "Email is not registered"
            })
        }
        const match = await comparePassword(password, user.password)
        if (!match) {
            return res.status(200).send({
                succes: false,
                message: "Invalid Password"
            })
        }
        // TOKEN
        const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.status(200).send({
            success: true,
            message: "Login Successfully",
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address
            },
            token
        })
    }
    catch {
        console.log(error);
        res.status(500).send({
            succes: false,
            message: "Error in Login",
            error
        })
    }
}

// TEST CONTROLLER
export const testController = (req, res) => {
    res.send("PROTECTED ROUTE");
}