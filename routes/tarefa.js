const express = require('express');
const router = express.Router();
const sequelize = require('../db');
const tarefa = require('../models/tarefa');

//GET Retorna tarefas com paginação e ordenação
router.get('/', async (req, res) => {
    const {page = 1 , limit = 10} = req.query;
    sequelize.query(`SELECT * FROM tarefas ORDER BY data_criacao DESC LIMIT ${limit} OFFSET ${(page - 1) * limit}`)
    .then(([results, metadata]) => {
        res.json(results)
    }).catch((error) => {
        res.status(500).json({
            sucess: false,
            message: error.message,
        });
    });
});

//GET Consulta uma tarefa pelo ID
router.get('/:id', async (req, res) => {
    sequelize.query(`SELECT * FROM tarefas WHERE id_tarefas = ?`, { replacements: [req.params.id] })
    .then(([results, metadata]) => {
        if (results.length === 0) {
            res.status(404).json({
                success: false,
                message: "tarefa não encontrada",
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

//POST Cria uma tarefa
router.post('/', async (req, res) => {
    sequelize.query(`INSERT INTO tarefas (titulo, descricao, status, data_criacao, data_limite) VALUES (?, ?, ?, ?, ?)`, {replacements:
         [req.body.titulo, req.body.descricao, req.body.status, new Date(), req.body.data_limite]})
        .then(([results, metadata]) => {
        res.status(201).json({
            sucess: true,
            message: "Tarefa criada com sucesso",
        });
    }).catch((error) => {
        res.status(500).json({
            sucess: false,
            message: error.message,
        });
    });
});

//PUT Atualiza uma tarefa pelo ID
router.put('/:id', async (req, res) => {
    sequelize.query(`UPDATE tarefas SET status = ? WHERE id_tarefas = ?`,
        { replacements: [req.body.status, req.params.id] }
    )
    .then(([results, metadata]) => {
        if (metadata.affectedRows === 0) {
            res.status(404).json({
                success: false,
                message: "tarefa não encontrada",
            });
        } else {
            res.json({
                success: true,
                message: "Tarefa atualizada com sucesso",
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
    sequelize.query(`DELETE FROM tarefas WHERE id_tarefas = ?`, { replacements: [req.params.id] })
    .then(([results, metadata]) => {
        if (metadata.affectedRows === 0) {
            res.status(404).json({
                success: false,
                message: "tarefa não encontrada",
            });
        } else {
            res.json({
                success: true,
                message: "Tarefa deletada com sucesso",
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