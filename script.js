const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const url = 'mongodb://localhost:27017';
const dbName = 'filmes';

let db;

MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados');
    db = client.db(dbName);
});

app.post('/adicionar-filme', (req, res) => {
    const filme = {
        titulo: req.body.titulo,
        diretor: req.body.diretor,
        ano: req.body.ano
    };

    db.collection('filmes').insertOne(filme, (err, result) => {
        if (err) {
            console.error('Erro ao inserir filme no banco de dados:', err);
            res.status(500).send('Erro ao adicionar filme');
            return;
        }

        console.log('Filme adicionado:', result.ops[0]);
        res.status(201).send('Filme adicionado com sucesso');
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
