const Router = require('express')
const workerController = require('../controller/department.controller')
const departmentController = require('../controller/department.controller')
const router = new Router()

router.get('/department/:id', departmentController.getAllWorkers)
router.get('/department', workerController.getDepartment)
router.get('/department/head/:id', departmentController.getDepartmentHead)
router.post('/department/head/:id', departmentController.setDepartmentHead);
router.post('/department', departmentController.addDepartment);
router.delete('/department/:id', departmentController.deleteDepartment);
router.get('/top-departments', departmentController.getTopDepartments);
router.get('/recent-workers', departmentController.getRecentWorkers);
router.delete('/department/:id', departmentController.deleteDepartment)
router.get('/department/:id/has-workers', departmentController.checkDepartmentHasWorkers);
router.get('/department/:id/workers', departmentController.getDepartmentWorkers);

module.exports = router