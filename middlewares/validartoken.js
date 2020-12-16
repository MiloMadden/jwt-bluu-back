
const jwt = require('jsonwebtoken');

const verificaToken = (req, res, next)=>{

    //const token = req.get('token') tambien
    const token = req.header('token')

    if(!token){
        return res.status(401).json({
            msg: 'Acceso Denegado'
        })
    }

    try {

        const verified = jwt.verify(token, process.env.TOKEN_SECRET)
        req.user = verified;
        next()
        
    } catch (error) {
        res.status(400).json({error: 'token no es válido'})
    }

}

module.exports = {verificaToken}