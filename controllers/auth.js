const Usuario = require('../models/user')
const bcryptjs = require('bcryptjs');
const {generateJwt} = require("../helpers/generate-jwt");


const crearUsuario = async (req, res) => {
    const {email, password} = req.body;
    const find = await Usuario.findOne({email});

    if (find) {
        return res.status(400).json({
            msg: 'El email ya esta registrado'
        })
    }

    const user = await new Usuario(req.body);

    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(password, salt);

    await user.save();

    const token = await generateJwt(user.id);

    console.log(token);
    res.json({
        msg: 'usuario creado',
        token
    });
}

const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const userDb = await Usuario.findOne({email});

        if (!userDb) {
            return res.status(404).json({
                msg: 'Email no encontrado'
            });
        }

        const validPassword = bcryptjs.compareSync(password, userDb.password);
        if (!validPassword) {
            return res.status(404).json({
                msg: 'Contraseña no valida'
            });
        }
        const token = await generateJwt(userDb.id);
        return res.json({
            usuario: userDb,
            token: token
        })

    } catch (e) {
        res.status(500).json({
            msg: 'error en el servidor'
        })
    }
}

const renewToken = async (req, res) => {

    const uid = req.uid;
    const token = await generateJwt(uid);
    const userDb = await Usuario.findById(uid);

    return res.json({
        ok: true,
        userDb,
        token
    });
}

module.exports = {crearUsuario, login, renewToken}