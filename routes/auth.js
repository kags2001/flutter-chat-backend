const {Router} = require('express');
const {crearUsuario, login, renewToken} = require("../controllers/auth");
const {check} = require("express-validator");
const {validateFields} = require("../middlewares/validateFields");
const {validarJWT} = require("../middlewares/validateJWT");

const router = Router();

router.post('/new', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password es invalido').not().isEmpty(),
    validateFields
], crearUsuario);

router.post('/', [
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password es invalido').not().isEmpty(),
    validateFields
], login);

router.get('/renew',
    validarJWT, renewToken);

module.exports = router;