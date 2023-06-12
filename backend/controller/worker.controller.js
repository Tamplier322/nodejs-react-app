const db = require('../db')

class workerController {
    async createWorker(req, res) {
        const { name, surname, department, date } = req.body;
        //Добавил валидацию (валидация только там, где post и put запросы)
        if (!name || !surname || !department || !date) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        //Добавил обработку ошибок (в других контроллерах также)
        try {
            const newWorker = await db.query(`INSERT INTO workers (name, surname, department,  date) values ($1, $2, $3, $4) RETURNING *`, [name, surname, department, date])
            res.json(newWorker.rows)
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async getWorker(req, res) {
        try {
            const workers = await db.query('SELECT * FROM workers')
            res.json(workers.rows)
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async getOneWorker(req, res) {
        try {
            const id = req.params.id
            const worker = await db.query('SELECT * FROM workers where id = $1', [id])
            res.json(worker.rows[0])
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async updateWorker(req, res) {
        try {
            const { id, name, surname, department, date } = req.body;
            const worker = await db.query('UPDATE workers set name = $1, surname = $2, department = $3, date = $4 where id = $5 RETURNING *',
                [name, surname, department, date, id]);
            res.json(worker.rows[0]);
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async deleteWorker(req, res) {
        try {
            const id = req.params.id
            const worker = await db.query('DELETE FROM workers where id = $1', [id])
            res.json(worker.rows[0])
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    //Проверка является ли сотрудник главой отдела
    async checkHead(req, res) {
        try {
            const workerId = req.params.id;
            const isDepartmentHead = await db.query('SELECT head FROM departments WHERE head = $1', [workerId]);
            res.json({ isDepartmentHead: isDepartmentHead.rows.length > 0 });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

module.exports = new workerController()