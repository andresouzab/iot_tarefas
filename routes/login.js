const express = require('express');
const router = express.Router();
const Usuario = require('../models/usuario');
const sequelize = require('../db');

// POST Login de usuário
const bcrypt = require('bcrypt');


router.post('/', async (req, res) => {
    const { usuario, senha } = req.body;
    console.log(usuario,senha);
    try {
        const user = await Usuario.findOne({ where: { usuario } });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Usuário não encontrado",
            });
        }

        const passwordMatch = await bcrypt.compare(senha, user.senha);
        console.log(passwordMatch, senha, user.senha)
        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Senha incorreta",
            });
        }

        // Autenticação bem-sucedida
        // Aqui você pode retornar um token JWT ou os detalhes do usuário, dependendo da sua necessidade
        res.json({
            success: true,
            message: "Login bem-sucedido",
            user: { id_usuarios: user.id, usuario: user.usuario, email: user.email }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});


module.exports = router;