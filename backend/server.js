/*const express = require('express');
const { Router } = require('express');

require('dotenv').config();

const app = express();
const port = 8000;

app.use(express.json());

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

const router = Router();

// Конфигурация подключения к базе данных


router.get('/home', async (req, res) => {
    try {
        // Запрос для получения данных из таблицы workers и связанной таблицы departments
        const query = `
            SELECT
                w.worker_id,
                w.worker_name,
                w.worker_surname,
                d.department_title,
                w.isHead,
                w.worker_date
            FROM
                workers AS w
                INNER JOIN departments AS d ON w.worker_department = d.department_id
            WHERE
                w.worker_id = $1
        `;
        const values = [1]; // Замените на соответствующий идентификатор работника
        const result = await pool.query(query, values);
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/about', async (req, res) => {
    try {
        // Запрос для получения данных из таблицы departments
        const query = 'SELECT * FROM departments WHERE department_id = $1';
        const values = [2]; // Замените на соответствующий идентификатор отдела
        const result = await pool.query(query, values);
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.use('/', router);

app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});
*/
const express = require('express')
const workerRouter = require('./routes/worker.routes')
const departmentRouter = require('./routes/department.routes')
const port = process.env.PORT || 8000

const app = express()

app.use(express.json())
app.use('/api', workerRouter)
app.use('/api', departmentRouter)

app.listen(port, () => console.log("server is working " + port))