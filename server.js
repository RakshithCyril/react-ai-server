const dot = require('dotenv')
dot.config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const path = require('path')
const mongoose = require('mongoose')
const Users = require('./models/users')
const bcrypt = require('bcrypt')

const { mongoName, mongoPass, PORT } = process.env

mongoose
  .connect(
    `mongodb+srv://${mongoName}:${mongoPass}@cluster0.klphkbu.mongodb.net/?retryWrites=true&w=majority`,
    {
      user: mongoName,
      pass: mongoPass,
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  )
  .then(() => {
    console.log('mongo Connected')
  })
  .catch(err => {
    console.log(err)
  })

const { Configuration, OpenAIApi } = require('openai')
const configuration = new Configuration({
  apiKey: process.env.api
})

const cors = require('cors')
const { validate } = require('./models/users')
const openai = new OpenAIApi(configuration)
const corsOptions = {
  credentials: true,
  origin: '*',
  optionsSuccessStatus: 200
}
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors(corsOptions))


app.get('/', async(req, res) => {
  res.send('connected')
})

app.post('/login', async (req, res) => {
  const { email, password } = req.body
  const valEmail = await Users.findOne({ email: email })
  if (!valEmail) {
    res.send(true)
  } else {
    const valPass = await bcrypt.compare(password, valEmail.pass)
    if (valPass) {
      res.send(false)
    } else {
      res.send(true)
    }
  }
})
app.post('/signup', async (req, res) => {
  const { fname, lname, email, password } = req.body
  const bodyObj = req.body

  const hash = await bcrypt.hash(password, 12)
  const validate = await Users.findOne({ email: email })
  if(!validate){
    res.send('done')
     const user = new Users({
      fname: fname,
      lname: lname,
      email: email,
      pass: hash
    })
    await user
      .save()
      .then(dat => {
      })
      .catch(err => {
      })
  }else{
    res.send(true)
  }
   
  
})

app.post('/api', async (req, res) => {
  const dat = req.body.userinput
  const completion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: dat,
    temperature: 0.5,
    max_tokens: 280
  })
  const rslt = completion.data.choices[0].text
  res.send(rslt)
  // res.send('connected')
})
const port = process.env.PORT || 8080
app.listen(port,async () => {
  const completion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: "hey",
    temperature: 0,
    max_tokens: 1
  })
})
