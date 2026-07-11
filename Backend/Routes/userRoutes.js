const {CreateUser, GetAllUsers ,
    DeleteUser, LoginUser
} = require('../Controller/UserController');
const express = require('express');
const upload = require('../Midleware/UploadMidleware');
const { authMiddleware } = require('../Midleware/AuthMilderware');
const router = express.Router();

router.post('/signup', upload.single('image'), CreateUser);
router.get('/all', authMiddleware, GetAllUsers);
router.delete('/:id', authMiddleware, DeleteUser);
router.post('/login', LoginUser);
router.get('/me', authMiddleware, (req, res) => {
    res.status(200).json({ user: req.user });
});

module.exports = router;