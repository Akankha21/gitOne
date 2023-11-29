const exp = require('constants')
const express = require('express')
const path = require('path')
const cors = require('cors')

const { logger } = require('./middleware/logEvents')
const errorHandler = require('./middleware/errorHandler')
const corsOptions = require('./config/corsOptions')

const app = express()

const PORT = process.env.PORT || 5000
//custom middleware logger
app.use(logger)

//Cors origin Resource Sharing

app.use(cors(corsOptions))

//build-in middleware for json
app.use(express.json())
//build-in middleware to handle urlenocded form data

app.use(express.urlencoded({ extended: false }))

// server static files
app.use('/', express.static(path.join(__dirname, 'public')))

//routes
app.use('/', require('./routes/root'))

app.use('/employees', require('./routes/api/employees'))

app.all('*', (req, res) => {
  res.status(404)
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, '..', 'views', '404.html'))
  }
  if (req.accepts('json')) {
    res.json({ error: '404 Not found' })
  } else {
    res.type('txt').send('404 Not founded')
  }
})

app.use(errorHandler)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
