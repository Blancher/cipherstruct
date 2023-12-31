const express = require('express');
const fileUpload = require('../middleware/fileUpload');
const {check} = require('express-validator');
const userControllers = require('../controllers/userControllers');

const router = express.Router();

router.post('/signup', fileUpload.single('image'), [check('username').isLength({min: 1, max: 25}).withMessage(`Username can't be empty.`), check('email').normalizeEmail().isEmail().withMessage('Email is invalid'), check('password').isLength({min: 8}).withMessage('Password must be at least 8 characters.')], userControllers.signup);
router.post('/login', userControllers.login);

module.exports = router;