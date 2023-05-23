const db = require('../db')

class departmentController {
    async getAllWorkers(req, res) {
        const id = req.params.id
        const worker = await db.query('SELECT * FROM workers where worker_department = $1', [id])
        const count = worker.rows
        res.json(worker.rows)
    }
    async getDepartment(req, res) {
        const departments = await db.query('SELECT * FROM departments')
        res.json(departments.rows)
    }

}



module.exports = new departmentController()