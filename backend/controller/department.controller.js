const db = require('../db')

class departmentController {
    async getAllWorkers(req, res) {
        try {
            const id = req.params.id
            const worker = await db.query('SELECT * FROM workers where department = $1', [id])
            const count = worker.rows
            res.json(worker.rows)
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async getDepartment(req, res) {
        try {
            const departments = await db.query('SELECT * FROM departments')
            res.json(departments.rows)
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async getDepartmentHead(req, res) {
        try {
            const departmentId = req.params.id;
            const query = `
                SELECT 
                    w.*
                FROM 
                    workers AS w
                    INNER JOIN departments AS d ON w.id = d.head
                WHERE
                    d.id = $1
            `;
            const departmentHead = await db.query(query, [departmentId]);
            if (departmentHead.rows.length > 0) {
                res.json(departmentHead.rows[0]);
            } else {
                res.status(404).json({ error: 'Глава отдела не найден' });
            }
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async setDepartmentHead(req, res) {
        try {
            const departmentId = req.params.id;
            const { workerId } = req.body;

            const checkWorkerQuery = 'SELECT * FROM workers WHERE id = $1';
            const checkWorkerResult = await db.query(checkWorkerQuery, [workerId]);
            if (checkWorkerResult.rows.length === 0) {
                return res.status(404).json({ error: 'Сотрудник не найден' });
            }

            const checkDepartmentQuery = 'SELECT * FROM departments WHERE id = $1';
            const checkDepartmentResult = await db.query(checkDepartmentQuery, [departmentId]);
            if (checkDepartmentResult.rows.length === 0) {
                return res.status(404).json({ error: 'Отдел не найден' });
            }

            const department = checkDepartmentResult.rows[0];
            if (department.head) {
                return res.status(400).json({ error: 'У отдела есть глава' });
            }

            const updateDepartmentQuery = 'UPDATE departments SET head = $1 WHERE id = $2';
            await db.query(updateDepartmentQuery, [workerId, departmentId]);
            res.status(200).json({ message: 'Отдела добавлен успешно' });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async addDepartment(req, res) {
        const { title, date, description, head } = req.body;

        if (!title || !date || !description || !head) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const insertDepartmentQuery = 'INSERT INTO departments (title, date, description, head) VALUES ($1, $2, $3, $4) RETURNING *';
        try {
            const newDepartment = await db.query(insertDepartmentQuery, [title, date, description, head]);
            res.status(201).json(newDepartment.rows[0]);
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async deleteDepartment(req, res) {
        try {
            const departmentId = req.params.id;
            const deleteDepartmentQuery = 'DELETE FROM departments WHERE id = $1';
            await db.query(deleteDepartmentQuery, [departmentId]);
            res.status(200).json({ message: 'Department deleted successfully' });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async getTopDepartments(req, res) {
        try {
            const departments = await db.query(`
            SELECT departments.title, COUNT(workers.id) AS total_workers
            FROM departments
            LEFT JOIN workers ON departments.id = workers.department
            GROUP BY departments.title
            ORDER BY total_workers DESC
            LIMIT 5
          `);
            res.json(departments.rows);
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async getRecentWorkers(req, res) {
        try {
            const workers = await db.query(`
            SELECT *
            FROM workers
            ORDER BY date DESC
            LIMIT 5
          `);
            res.json(workers.rows);
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }


    async deleteDepartment(req, res) {
        try {
            const departmentId = req.params.id;

            const checkWorkersQuery = 'SELECT * FROM workers WHERE department = $1';
            const checkWorkersResult = await db.query(checkWorkersQuery, [departmentId]);
            if (checkWorkersResult.rows.length > 0) {
                return res.status(400).json({ error: 'Невозможно удалить отдел с существующими в нем сотрудниками' });
            }

            const deleteDepartmentQuery = 'DELETE FROM departments WHERE id = $1';
            await db.query(deleteDepartmentQuery, [departmentId]);
            res.status(200).json({ message: 'Отдел удален' });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    //Проверка, есть ли в отделе сотрудники для удаления отдела
    async checkDepartmentHasWorkers(req, res) {
        try {
            const departmentId = req.params.id;
            const checkWorkersQuery = 'SELECT * FROM workers WHERE department = $1';
            const checkWorkersResult = await db.query(checkWorkersQuery, [departmentId]);
            const hasWorkers = checkWorkersResult.rows.length > 0;
            res.json({ hasWorkers });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    //Вывод всех работников отдела
    async getDepartmentWorkers(req, res) {
        try {
            const departmentId = req.params.id;
            const workers = await db.query('SELECT * FROM workers WHERE department = $1', [departmentId]);
            res.json(workers.rows);
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

module.exports = new departmentController();
