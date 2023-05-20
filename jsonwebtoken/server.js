// package
const  express = require('express')
const helmet = require('helmet')
const jwt = require('jsonwebtoken')
const secretKey = "my-secret-key"
require('dotenv').config()
const port = process.env.PORT||8000


// middleware
const app = express();
app.use(express.static('public'))
app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))



// middleware to verify jwt
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if(!token){
        return res.status(401).json({
            message: "No token provided"
        })
    }
    jwt.verify(token, secretKey, (err, decoded) => {
        if(err){
            res.status(500).json({
                message: "Failed to authenticate token."
            })
        }
        // save to decoded token for further use
        req.user = decoded
        next()
    })
}

// Endpoint to generate JWT token
app.get('/login', (req, res) => {
    const user = {
        'id': 1,
        'name': 'azharul',
        'age' : 27

    }
    const token = jwt.sign(user, secretKey, { expiresIn: 60 * 60 })
    res.json({
        token: token
    })
})

// Protected endpoint
app.get('/protected', verifyToken, (req, res) => {
    res.json({
        message: "Protected endpoint reached",
        user: req.user
    })
})

// server run
app.listen(port, ()=>{
    console.log(`server listening on port ${port}`)
})
