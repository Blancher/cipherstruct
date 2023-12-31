const express = require('express');
const {check} = require('express-validator');
const cipherControllers = require('../controllers/cipherControllers');
const checkAuth = require('../middleware/checkAuth');

const router = express.Router();

router.get('/', cipherControllers.getCiphers);
router.get('/:cipherId', cipherControllers.getCipherById);
router.use(checkAuth);
router.post('/', [check('title').isLength({min: 1, max: 15}).withMessage('Title length must be between 1 and 20 characters.'), check('string').matches(/^([+-]\d)+$/).withMessage('Encryption string must match format on home page.')], cipherControllers.createCipher);
router.patch('/:cipherId', [check('title').isLength({min: 1, max: 15}).withMessage('Title length must be between 1 and 20 characters.'), check('string').matches(/^([+-]\d)+$/).withMessage('Encryption string must match format on home page.')], cipherControllers.updateCipher);
router.delete('/:cipherId', cipherControllers.deleteCipher);
router.patch('/like/:cipherId', cipherControllers.likeCipher);
router.patch('/unlike/:cipherId', cipherControllers.unlikeCipher);
router.patch('/dislike/:cipherId', cipherControllers.dislikeCipher);
router.patch('/undislike/:cipherId', cipherControllers.undislikeCipher);

module.exports = router;