const {validationResult} = require('express-validator');
const Cipher = require('../models/cipher');
const sum = require('../util/sum');

exports.getCiphers = async(req, res, next) => {
    try {
        const ciphers = await Cipher.find();
        const populatedCiphers = await Promise.all(ciphers.map(cipher => cipher.populate('creator')));
        return res.status(200).json({ciphers: populatedCiphers.map(cipher => cipher.toObject({getters: true}))});
    } catch(err) {
        return res.status(500).json({message: 'Getting ciphers failed.'});
    }
};

exports.getCipherById = async(req, res, next) => {
    const cipherId = req.params.cipherId;

    try {
        const cipher = await Cipher.findById(cipherId);

        if (!cipher) {
            return res.status(404).json({message: 'Cipher not found.'});
        }

        return res.status(200).json({cipher: cipher.toObject({getters: true})});
    } catch(err) {
        return res.status(500).json({message: 'Getting cipher failed.'});
    }
};

exports.createCipher = async(req, res, next) => {
    const errors = validationResult(req);
    const {title, string} = req.body;

    if (!sum(string)) {
        return res.status(422).json({message: 'Sum of numbers must be between -26 and 26 characters.'});
    }
    if (!errors.isEmpty()) {
        return res.status(422).json({message: errors.array().map(error => error.msg)});
    }

    try {
        const cipher = new Cipher({title, string, creator: req.userId, likes: [], dislikes: []});
        await cipher.save();
        return res.status(201).json({message: 'Cipher created successfully.'});
    } catch(err) {
        return res.status(500).json({message: 'Creating cipher failed.'});
    }
};

exports.updateCipher = async(req, res, next) => {
    const cipherId = req.params.cipherId;
    const errors = validationResult(req);
    const {title, string} = req.body;

    if (!sum(string)) {
        return res.status(422).json({message: 'Encryption string must be between -26 and 26 characters.'});
    }
    if (!errors.isEmpty()) {
        return res.status(422).json({message: errors.array().map(error => error.msg)});
    }

    try {
        const cipher = await Cipher.findById(cipherId);
        
        if (!cipher) {
            return res.status(404).json({message: 'Cipher being updated not found'});
        }
        if (cipher.creator.toString() !== req.userId.toString()) {
            return res.status(401).json({message: 'User unauthorized to edit cipher.'});
        }

        cipher.title = title;
        cipher.string = string;
        await cipher.save();
        return res.status(200).json({message: 'Cipher updated successfully'});
    } catch(err) {
        return res.status(500).json({message: 'Updating cipher failed.'});
    }
};

exports.deleteCipher = async(req, res, next) => {
    const cipherId = req.params.cipherId;

    try {
        const cipher = await Cipher.findById(cipherId);

        if (!cipher) {
            return res.status(404).json({message: 'Cipher being deleted not found.'});
        }
        if (cipher.creator.toString() !== req.userId.toString()) {
            return res.status(401).json({message: 'User unauthorized to edit cipher.'});
        }

        await Cipher.findByIdAndDelete(cipherId);
        return res.status(200).json({message: 'Cipher deleted successfully'});
    } catch(err) {
        return res.status(500).json({message: 'Deleting cipher failed.'});
    }
};

exports.likeCipher = async(req, res, next) => {
    const cipherId = req.params.cipherId;

    try {
        const cipher = await Cipher.findById(cipherId);

        if (!cipher) {
            return res.status(404).json({message: 'Liked cipher not found.'});
        }

        cipher.likes = [...cipher.likes, req.userId];
        await cipher.save();
        return res.status(200).json({message: 'Liking cipher succeeded'});
    } catch(err) {
        return res.status(500).json({message: 'Liking cipher failed'});
    }
};

exports.unlikeCipher = async(req, res, next) => {
    const cipherId = req.params.cipherId;

    try {
        const cipher = await Cipher.findById(cipherId);

        if (!cipher) {
            return res.status(404).json({message: 'Unliked cipher not found.'});
        }

        cipher.likes = cipher.likes.filter(like => like.toString() !== req.userId.toString());
        await cipher.save();
        return res.status(200).json({message: 'Unliking cipher succeeded.'});
    } catch(err) {
        return res.status(500).json({message: 'Unliking cipher failed.'});
    }
};

exports.dislikeCipher = async(req, res, next) => {
    const cipherId = req.params.cipherId;

    try {
        const cipher = await Cipher.findById(cipherId);

        if (!cipher) {
            return res.status(404).json({message: 'Disliked cipher not found.'});
        }

        cipher.dislikes = [...cipher.dislikes, req.userId];
        await cipher.save();
        return res.status(200).json({message: 'Disliking cipher succeeded.'});
    } catch(err) {
        return res.status(500).json({message: 'Disliking cipher failed.'});
    }
};

exports.undislikeCipher = async(req, res, next) => {
    const cipherId = req.params.cipherId;

    try {
        const cipher = await Cipher.findById(cipherId);

        if (!cipher) {
            return res.status(404).json({message: 'Undisliked cipher not found.'});
        }

        cipher.dislikes = cipher.dislikes.filter(dislike => dislike.toString() !== req.userId.toString());
        await cipher.save();
        return res.status(200).json({message: 'Undisliking cipher succeeded.'});
    } catch(err) {
        return res.status(500).json({message: 'Undisliking cipher failed.'});
    }
};