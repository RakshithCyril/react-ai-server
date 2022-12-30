const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const path = require('path')
const { Configuration, OpenAIApi } = require('openai')
const configuration = new Configuration({
  apiKey: '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'
})
const cors = require('cors')
const openai = new OpenAIApi(configuration)
const port = 8080

// app.set('views', path.join(__dirname, 'views'))
// app.set('view engine', 'ejs')
// app.use(express.static(path.join(__dirname, 'options')))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())
const corsOptions = {
    credentials: true,
    origin:["http://localhost:3000","http://192.168.1.2:3000"],
    optionsSuccessStatus: 200
  }



app.post('/api',cors(corsOptions), async (req, res) => {
  const dat = req.body.userinput
  const completion = await openai.createCompletion({
    model: 'text-davinci-002',
    prompt: dat,
    temperature:1,
     max_tokens:2000
  })
  const rslt = completion.data.choices[0].text
  res.send(rslt)
})

app.listen(port, () => {
  console.log(`Listening...`)
})
