const router = require('express').Router();

router.get('/', (req, res)=>{
    res.json({
        mensaje: 'Lo logramos'
    })
})

module.exports = router;