const util = require('util');

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

const qy = util.promisify(conexion.query).bind(conexion); // permite uso de async await con mysql

app.get('/', async (req, res) => {
    try {

        let query = 'SELECT * FROM todolist';
        let queryRes = await qy(query);

        let list = '';

        queryRes.forEach((task, index) => {
            let dateFormatted = 'none';
            if (task.date_limit) {
                const date = new Date(task.date_limit);
                dateFormatted = date.toISOString().substring(0, 10);
            }
            list = list + `<div class="list-row"><span class="task">${task.task}</span> <span class="due-date">Due date: ${dateFormatted}</span> <span class="checkbox"><input ${task.completed && 'checked'} type="checkbox"></span></div>`;
        });


        let html =
            `
            <head>
                <link rel="stylesheet" href="styles.css">
            </head>
            <body>
                <h1>TODO LIST</h1>
                <div class="list">${list}</div>
                <form method="POST">
                    <div class="new-task-container">
                        <label for="task">Task
                        <input type="text" name="task" required="required">
                        </label>
                        <label for="date_limit">Due date
                        <input type="date" id="date_limit" name="date_limit">
                        </label>
                        <button type="submit">  +  </button>
                    </div>        
                </form>
                
            </body>
        `;

        res.send(html);
    } catch (e) {
        console.log(e.message);
        res.status(413).send({ "Error": e.message });
    }

});

// app.get('/newtask', (req, res) => {
//     res.sendFile(__dirname + '/newtask.html');
// });

app.post('/', async (req, res) => {
    console.log(req.body);
    try {
        if (!req.body.task) {
            throw new Error('Task field is required');
        };

        let task = req.body.task;
        let date_limit = req.body.date_limit;

        let query = `INSERT INTO todolist (task, date_limit) VALUE ("${task}", ${date_limit ? '"' + date_limit + '"' : null})`;
        queryRes = await qy(query);

        console.log('tarea agregada');
        res.redirect('/');

    } catch (e) {
        console.log(e.message);
        res.status(413).send(`Error: ${e.message}`);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${PORT}`);
});

