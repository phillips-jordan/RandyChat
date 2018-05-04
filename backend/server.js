const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.raw({type:"*/*"}))

let serverState = {
    messages:[],
    users:[],
    livesession: []
}

app.get('/activeUsers', (req, res)=>{
    let active = []
    let stamp = new Date().getTime();
    active = serverState.messages.map(x=>{
        if(x.time>stamp-300000){
            return x.username
        }
        return null
    })
    active = active.filter(x=>{
        return x!==null
    })
    let uniquer = active.filter((x, i)=>{
        return active.indexOf(x)===i
    })
    
    res.send(JSON.stringify(uniquer))
})

app.post('/create', (req,res)=> {
    let parsedUser = JSON.parse(req.body.toString())
     if (!serverState.users[parsedUser.username]) {
       serverState.users[parsedUser.username] = parsedUser.password;
       res.send('success')
     }
     else {
         res.send('failure')
     }
})

app.post("/login", (req, res)=> {
    let parsedUser = JSON.parse(req.body.toString())
    if (serverState.users[parsedUser.username] === parsedUser.password){
        let sessionID = Math.floor(Math.random()*10000000)
        serverState.livesession[parsedUser.username]=sessionID
        let x = serverState.messages.concat({message: 'User '+parsedUser.username+ ' has joined the chat!'})
        serverState.messages = x
        let success = {out: 'success', id: sessionID, msgs: serverState.messages }
        res.send(JSON.stringify(success))
    }
    res.send(JSON.stringify('STOP'))

})

app.post('/submit', (req, res)=>{
    let parsedMsg = JSON.parse(req.body.toString())
    if (!parsedMsg.id||parsedMsg.id!==serverState.livesession[parsedMsg.username]){
        res.send('PLEASE LEAVE')
    }
    else{
    let x = serverState.messages.concat(parsedMsg)
    serverState.messages=x
    res.send(JSON.stringify(serverState.messages))}
})

app.get('/messages', (req, res)=>{
    res.send(JSON.stringify(serverState.messages))
})

app.listen(4000, ()=>{
    console.log('listening 4k')
})