require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const https = require('https')

const app = express()

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/',function(req,res){
  res.sendFile(__dirname + '/index.html')
})

app.post('/',function(req,res){

  const first_name = req.body.fname
  const last_name = req.body.lname
  const e_mail = req.body.email

  const data = {
    members: [
      {
        email_address: e_mail,
        status: 'subscribed',
        merge_fields: {
          FNAME: first_name,
          LNAME: last_name
        }
      }
    ]
  }

  const jsonData = JSON.stringify(data)
  const options = {
    method: "POST",
    auth: process.env.KEY
  }

  const request = https.request(process.env.URL, options, function(response){

    if(response.statusCode === 200){
      res.sendFile(__dirname + '/Success.html')
    }else{
      res.sendFile(__dirname + '/Failure.html')
    }

    response.on('data',function(data){
      console.log(JSON.parse(data))
    })

  })
 request.write(jsonData)
request.end()

})

app.post('/Failure',function(req,res){
  res.redirect('/')
})

app.listen(process.env.PORT || 3000,function(){
  console.log('panda server started')
})
