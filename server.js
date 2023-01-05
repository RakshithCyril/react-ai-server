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
  apiKey: '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'
})

const cors = require('cors')
const openai = new OpenAIApi(configuration)


app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())
const corsOptions = {
  credentials: true,
  origin: ['http://localhost:3000', 'http://192.168.1.2:3000'],
  optionsSuccessStatus: 200
}

app.get('/',(req,res)=>{
  res.send('connected')
})

app.post('/login',async (req, res) => {
  const {email, password} = req.body
  const valEmail = await Users.findOne({email:email})
  if(!valEmail){
    res.send(true)
  }else{
    const valPass = await bcrypt.compare(password,valEmail.pass)
    if(valPass){
      res.send(false)
    }else{
      res.send(true)
    }
  }
  console.log(valEmail)
})
app.post('/signup', async (req, res) => {
  const { fname, lname, email, password } = req.body
  const bodyObj = req.body
  
  const hash = await bcrypt.hash(password,12)
  const user = new Users({
    fname: fname,
    lname: lname,
    email: email,
    pass: hash
  })
  await user
    .save()
    .then(dat => {
      console.log(dat)
    })
    .catch(err => {
      console.log(err)
    })
  res.send('done!!')
})

app.post('/api', cors(corsOptions), async (req, res) => {
  const dat = req.body.userinput
  const completion = await openai.createCompletion({
    model: 'text-babbage-001',
    prompt: dat,
    temperature: 0,
    max_tokens: 500
  })
  const rslt = completion.data.choices[0].text
  res.send(rslt)
})
const port = process.env.PORT || 8080
app.listen(port, () => {
  console.log(`Listening...`)
})
