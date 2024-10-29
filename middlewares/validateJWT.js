const jwt = require('jsonwebtoken');

const validarJWT = (req, res, next) =>{
    const token = req.header('x-token');
    if (!token){
        return res.status(401).json({
            msg:'No hay token en la peticion'
        });
    }
    try {
        const {uid} = jwt.verify(token, process.env.JWT_KEY);
        req.uid = uid;
        next();

    }catch (e){
        return res.status(401).json({
            msg:'token no valido'
        })
    }
    console.log(token);
}

module.exports ={validarJWT}