const router = require('express').router();

const {
    getAllUsers,
    getOneUser,
    createUser,
    updateUser,
    deleteUser
} = require('../../controllers/user-controller');

router
    .route('/')
    .get(getAllUsers)
    .post(createUser);

router
    .route('/:userId')
    .get(getOneUser)
    .put(updateUser)
    .delete(deleteUser);

router 
    .route('/:userId/friends/:friendId')
    .post()
    .delete();

module.exports = router;