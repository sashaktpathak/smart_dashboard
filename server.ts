import express = require('express')
const app: express.Application = express()

app.use(express.static(__dirname + '/public_static'))


app.get('/', function (req: any, res: any) {
    res.sendFile(__dirname, '/public_static/index.html')
    console.log("Sending...")
})

var port = process.env.PORT || 1337;
app.listen(port, function () {
    console.log(`App listening at ${port}`)
})