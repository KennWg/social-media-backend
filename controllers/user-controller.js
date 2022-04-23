const req = require('express/lib/request');
const { User, Thought } = require('../models');

const userController = {
    //GET all users
    getAllUsers(req, res) {
        User.find({})
            .select('-__v')
            .then(userData => res.json(userData))
            .catch(err => res.status(400).json(err));
    },

    //GET one user
    getOneUser({ params }, res) {
        User.findById(params.userId)
            .populate({
                path: 'thoughts',
                select: '-__v'
            })
            .populate({
                path: 'friends',
                select: '-__v'
            })
            .select('-__v')
            .then(userData => {
                if (!userData) {
                    res.status(404).json({ message: "No user found with this ID" });
                    return;
                }
                res.json(userData);
            })
            .catch(err => res.status(400).json(err));
    },

    //POST new user
    createUser({ body }, res) {
        User.create(body)
            .then(userData => res.json(userData))
            .catch(err => res.status(400).json(err));
    },

    //PUT update user
    updateUser({ params, body }, res) {
        User.findByIdAndUpdate(params.userId, body, { new: true, runValidators: true })
            .then(userData => {
                if (!userData) {
                    res.status(404).json({ message: "No user found with this ID" });
                    return;
                }
                res.json(userData);
            })
            .catch(err => res.status(400).json(err));
    },

    //DELETE user
    deleteUser({ params }, res) {
        User.findByIdAndDelete(params.userId)
            .then(deletedUser => {
                if (!deletedUser) {
                    res.status(404).json({ message: "No user found with this ID" });
                    return;
                }
                return Thought.deleteMany({ username: deletedUser.username })
                    .then(deleteRes => { res.json(deleteRes) })
            })
            .catch(err => res.status(400).json(err));
    },

    //POST new friend for user
    addFriend({ params }, res) {
        User.findByIdAndUpdate(params.userId,
            {
                $push: { friends: params.friendId }
            },
            {
                new: true
            })
            .then(userData => {
                if (!userData) {
                    res.status(404).json({ message: "No user found with this ID" });
                    return;
                }
                res.json(userData);
            })
            .catch(err => res.status(400).json(err));
    },

    //DELETE friend for user
    removeFriend({ params }, res) {
        User.findByIdAndUpdate(params.userId,
            {
                $pull: { friends: params.friendId}
            },
            {
                new: true
            })
            .then(userData => {
                if (!userData) {
                    res.status(404).json({ message: "No user found with this ID" });
                    return;
                }
                res.json(userData);
            })
            .catch(err => res.status(400).json(err));
    }
};

module.exports = userController;