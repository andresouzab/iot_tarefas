const express = require('express');
const router = express.Router();
const sequelize = require('../db');
const usuario = require('../models/usuario');
const bcrypt = require('bcrypt');


//GET Retorna usuarios com paginação e ordenação
router.get('/', async (req, res) => {
    const {page = 1 , limit = 10} = req.query;
    sequelize.query(`SELECT * FROM usuarios ORDER BY usuario DESC LIMIT ${limit} OFFSET ${(page - 1) * limit}`)
    .then(([results, metadata]) => {
        res.json(results)
    }).catch((error) => {
        res.status(500).json({
            sucess: false,
            message: error.message,
        });
    });
});

//GET Consulta um usuario pelo ID
router.get('/:id', async (req, res) => {
    sequelize.query(`SELECT * FROM usuarios WHERE id_usuarios = ?`, { replacements: [req.params.id] })
    .then(([results, metadata]) => {
        if (results.length === 0) {
            res.status(404).json({
                success: false,
                message: "Usuário não encontrado",
            });
        } else {
            res.json({
                success: true,
                task: results[0],
            });
        }
    }).catch((error) => {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    });
});

//POST Cria um usuario
router.post('/', async (req, res) => {
      // Encriptar a senha
        const senhaEncriptada = await bcrypt.hash(req.body.senha, 10); // 10 é o número de rounds para gerar o salt
    sequelize.query(`INSERT INTO usuarios (usuario, email, senha, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)`, {replacements:
         [req.body.usuario, req.body.email, senhaEncriptada, new Date(), new Date()]})
        .then(([results, metadata]) => {
        res.status(201).json({
            sucess: true,
            message: "Usuario cadastrado com sucesso",
        });
    }).catch((error) => {
        res.status(500).json({
            sucess: false,
            message: error.message,
        });
    });
});

//PUT Atualiza um usuario pelo ID
router.put('/:id', async (req, res) => {
    sequelize.query(`UPDATE usuarios SET usuario = ? WHERE id_usuarios = ?`,
        { replacements: [req.body.usuario, req.params.id] }
    )
    .then(([results, metadata]) => {
        if (metadata.affectedRows === 0) {
            res.status(404).json({
                success: false,
                message: "usuario não encontrado",
            });
        } else {
            res.json({
                success: true,
                message: "usuario atualizado com sucesso",
            });
        }
    }).catch((error) => {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    });
});

//DELETE Deleta uma tarefa pelo ID
router.delete('/:id', async (req, res) => {
    sequelize.query(`DELETE FROM usuarios WHERE id_usuarios = ?`, { replacements: [req.params.id] })
    .then(([results, metadata]) => {
        if (metadata.affectedRows === 0) {
            res.status(404).json({
                success: false,
                message: "usuario não encontrado",
            });
        } else {
            res.json({
                success: true,
                message: "usuario deletado com sucesso",
            });
        }
    }).catch((error) => {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    });
});

module.exports = router;