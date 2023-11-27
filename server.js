const exp = require('constants')
const express = require('express')
const path = require('path')
const cors = require('cors')

const { logger } = require('./middleware/logEvents')
const errorHandler = require('./middleware/errorHandler')

const app = express()

const PORT = process.env.PORT || 5000
//custom middleware logger
app.use(logger)
//Cors origin Resource Sharing

const whiteList = ['https://www.google.com', 'http://localhost:5000']
const corsOptions = {
  origin: (origin, callback) => {
    if (whiteList.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },

  optionsSuccessStatus: 200,
}

app.use(cors(corsOptions))

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use('/', express.static(path.join(__dirname, 'public')))
app.use('/subdir', express.static(path.join(__dirname, 'public')))
app.use('/', require('./routes/root'))
app.use('/subdir', require('./routes/subdir'))

app.use(errorHandler)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
