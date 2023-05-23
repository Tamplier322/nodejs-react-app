const Router = require('express')
const workerController = require('../controller/department.controller')
const departmentController = require('../controller/department.controller')
const router = new Router()

router.get('/department/:id', departmentController.getAllWorkers)
router.get('/department', workerController.getDepartment)

module.exports = router