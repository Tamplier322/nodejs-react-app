const express = require('express')
const workerRouter = require('./routes/worker.routes')
const departmentRouter = require('./routes/department.routes')
const port = process.env.PORT || 8000
const cors = require('cors');

const app = express()

app.use(cors());
app.use(express.json())
app.use('/api', workerRouter)
app.use('/api', departmentRouter)

app.listen(port, () => console.log("server is working " + port))