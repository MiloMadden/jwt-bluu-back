
const router = require('express').Router();
const User = require('../models/User')
const bcrypt = require('bcrypt');
const Joi = require('@hapi/joi')
const jwt = require('jsonwebtoken')
const {verificaToken} = require('../middlewares/validartoken')

const schemaRegister = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required()
})

const schemaLogin = Joi.object({
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required()
})

//===================================================================

router.get('/', (req, res)=>{
    res.json({
        ok: true, 
        msg: 'Subido al servidor'
    })
})

router.get('/get', verificaToken,(req,res)=>{
    res.json({
        msg: 'hora de aventura', 
        user: req.user
    })
})

router.post('/register', async(req, res)=>{

    // Validaciones de usuario

    const {error} = schemaRegister.validate(req.body)

    if(error){
        return res.status(400).json(
            {error: error.details[0].message}
        )
    }

    const saltos = await bcrypt.genSalt(10)
    const password = await bcrypt.hashSync(req.body.password, saltos) 

    const user = new User({
        name: req.body.name,
        email: req.body.email, 
        password: password
    })
    console.log(user)

    try {

        const emailExiste = await User.findOne({email: user.email})
        
        if(emailExiste){
            return res.status(400).json({
                ok: false, 
                msg: 'Email ya Existe'
            })
        }

        const usuarioGuardado = await user.save();

        res.json({
            ok: true, 
            data: usuarioGuardado
        })
        
    } catch (error) {
        
        res.status(400).json({
            ok: false,
            error
        })

    }

})

router.post('/login', async(req, res)=>{

    // validaciones
    const { error } = schemaLogin.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message })

    const userDB = await User.findOne({email: req.body.email});
    
    if(!userDB){
        return res.status(400).json({
            ok: false,
            msg: 'Usuario no encontrado'
        })
    }

    const validPassword = await bcrypt.compareSync(req.body.password, userDB.password)
    if(!validPassword){
        return res.status(400).json({
            ok: false, 
            msg: 'Contraseña no valida'
        })
    }

    // token
    const token = jwt.sign({
        name: userDB.name, 
        id: userDB._id, 
        email: userDB.email
    }, process.env.TOKEN_SECRET)

    /*res.header('token', token).json({
        error: null,
        data: {token}
    })*/

    res.header('token', token).json({
        ok: true, 
        msg: 'Bienvenido',
        user: userDB, 
        token: token
    })

})


//====================================================================
module.exports = router;