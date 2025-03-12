const express = require('express')
const { registerUser, loginUser, logoutUser,verifyEmail } = require('../controllers/auth.controller')

const router = express.Router()


router.post('/register', registerUser)
router.post('verifyEmail' , verifyEmail)
router.post('/login', loginUser)
router.get('/logout', logoutUser)


module.exports = router 