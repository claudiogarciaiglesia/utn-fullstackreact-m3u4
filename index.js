// Configuracion de express
const express = require('express');
const app = express();
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Configuracion mysql
const mysql = require('mysql');
const conexion = mysql.createConnection({
    host: 'localhost',
    user: 'admin',
    password: 'admin',
    database: 'todolist'
});
conexion.connect();

app.get('/', (req, res) => {
    let list = 'list items here';
    let newTaskButton = '<button> + </button>';
    let html = '<h1>TODO LIST</h1><hr><ul>' + list + '</ul>' + newTaskButton;


    res.send(html);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${PORT}`);
});

