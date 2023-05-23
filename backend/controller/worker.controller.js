const db = require('../db')

class workerController {
    async createWorker(req, res) {
        const { worker_name, worker_surname, worker_department, workers_date } = req.body
        console.log(worker_name, worker_surname, worker_department, workers_date)
        const newWorker = await db.query(`INSERT INTO workers (worker_name, worker_surname, worker_department,  workers_date) values ($1, $2, $3, $4) RETURNING *`, [worker_name, worker_surname, worker_department, workers_date])
        res.json(newWorker.rows)
    }
    async getWorker(req, res) {
        const workers = await db.query('SELECT * FROM workers')
        res.json(workers.rows)
    }
    async getOneWorker(req, res) {
        const id = req.params.id
        const worker = await db.query('SELECT * FROM workers where worker_id = $1', [id])
        res.json(worker.rows[0])
    }
    async updateWorker(req, res) {
        const { worker_id, worker_name, worker_surname, worker_department, workers_date } = req.body
        const worker = await db.query('UPDATE workers set worker_name = $1, worker_surname = $2, worker_department = $3, workers_date = $4 where worker_id = $5 RETURNING *',
            [worker_name, worker_surname, worker_department, workers_date, worker_id])
        res.json(worker.rows[0])

    }
    async deleteWorker(req, res) {
        const id = req.params.id
        const worker = await db.query('DELETE FROM workers where worker_id = $1', [id])
        res.json(worker.rows[0])
    }
}

module.exports = new workerController()