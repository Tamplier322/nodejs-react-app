const Router = require('express')
const workerController = require('../controller/worker.controller')
const router = new Router()

router.post('/worker', workerController.createWorker)
router.get('/worker', workerController.getWorker)
router.get('/worker/:id', workerController.getOneWorker)
router.put('/worker', workerController.updateWorker)
router.delete('/worker/:id', workerController.deleteWorker)
router.get('/worker/:id/check-head', workerController.checkHead);

module.exports = router