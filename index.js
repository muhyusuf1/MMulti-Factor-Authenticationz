const faceRecognition = require('./faceRecog/faceRecognition')
const express = require('express')
const path = require('path')
const session = require('express-session')
const imageUpload = require('./faceRecog/imagePostHandle')
const app = express()
const routerLogin = require('./routes/login')
const routerHome = require('./routes/home')
const routerReader = require('./routes/reader')
const port = process.env.PORT || 80

app.set('view engine', 'ejs')

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    sameSite: true,
    maxAge:60000
  }
}))
//----middleware
app.use(express.static('static'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//-----------login----------
app.use('/login', routerLogin)

//---------home-----------
app.use('/home', routerHome)

//------------image handler middleware
app.use('/reader/uploadImage',imageUpload.single('avatar'))

//---------reader----------
app.use('/reader', routerReader)


//--------error middleware-----------

const start = async () => {
  try {
    await faceRecognition.loadAll()
    app.listen(port, () => {
      console.log('Server is up on port ' + port)
    })
  } catch (error) {
    console.log(error);
  }
}

start()

