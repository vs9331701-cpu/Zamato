const User = require('../Models/UserModel');
const { generateToken } = require('../Midleware/AuthMilderware');

const CreateUser = async (req, res) => {
    try {
        const { mobile, password } = req.body;
        const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

        if (!mobile || !password) {
            return res.status(400).json({ error: 'Mobile and password are required' });
        }

        const existingUser = await User.findOne({ where: { mobile } });
        if (existingUser) {
            return res.status(409).json({ error: 'User already exists' });
        }

        const newuser = await User.create({
            mobile,
            password,
            image: imagePath,
        });

        const token = generateToken(newuser);

        res.status(201).json({ message: 'User created successfully', user: newuser, token });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}


const GetAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }   
};

const DeleteUser = async (req, res) => {
    try{
        const user = await User.findByPk(req.params.id);
        if(user){
            await user.destroy();
            res.status(200).json({message: 'User deleted successfully'});
        }
        else{
            res.status(404).json({error: 'User not found'});
        }
    }
    catch(error){
        res.status(500).json({error: error.message});
    }
};


const LoginUser = async (req, res) => {
    try {
        const { mobile, password } = req.body;

        if (!mobile || !password) {
            return res.status(400).json({ error: 'Mobile and password are required' });
        }

        const user = await User.findOne({ where: { mobile } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        else if (user.password !== password) {
            return res.status(401).json({ error: 'Invalid password' });
        }
        else{
            const token = generateToken(user);
            res.status(200).json({ message: 'Login successful', user, token });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = { CreateUser, GetAllUsers, DeleteUser, LoginUser };

