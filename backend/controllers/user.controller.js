import bcrypt from "bcrypt";
import { User } from "../src/models/user.model.js";

const registerUser = async (req, res) => {
    try {
        const { username, password, email } = req.body ?? {};

        if (
            typeof username !== "string" ||
            typeof email !== "string" ||
            typeof password !== "string" ||
            !username.trim() ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({ message: "Username, email, and password are required." });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const normalizedUsername = username.trim().toLowerCase();
        const existing = await User.findOne({
            $or: [{ email: normalizedEmail }, { username: normalizedUsername }],
        });

        if (existing) {
            return res.status(409).json({ message: "Username or email is already in use." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            username: normalizedUsername,
            email: normalizedEmail,
            password: hashedPassword,
        });

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: newUser.id,
                email: newUser.email,
                username: newUser.username,
            },
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ message: "Username or email is already in use." });
        }
        console.error("User registration failed:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
const loginUser = async (req, res) => {
    try {
        // checking if the user exists in the database
        const { email, password } = req.body ;
        const user = await User.findOne({ email:email.toLowerCase() });

        if (!user) return res.status(400).json({ message: "User not found" });

        //compare the password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
        res.status(200).json({ message: "Login successful", user: { id: user.id, email: user.email, username: user.username } });

    }catch (error) {
        res.status(500).json({ message: "Internal server error" });

    }
} 
const logoutUser = async(req,res) =>{
    try{
        const { email } = req.body;
        const user = await User.findOne({ email});
        if(!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json({ message: "Logout successful" });
    }catch(error){
        res.status(500).json({ message: "Internal server error",error });
    }
}
export { registerUser, loginUser, logoutUser };
