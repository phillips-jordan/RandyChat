const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.raw({type:"*/*"}))

let serverState = {
    messages:[],
    users:{Randy420:'admin11'},
    livesession: []
}

let keys = [
"88D93634D66",
"A5902716975",
"3B2CA5924ED",
"8A28022D9C9",
"38AC12287BB",
"DEDD9B44D63",
"0E6CEF1ADB2",
"F4D4FA43758",
"F9DBABA128A",
"B857C2EB75B",
"408BE8450CC",
"872A03CC2DE",
"24000334243",
"F24134F405A",
"7EC40ACDC16",
"40076D36020",
"1FF5FC4B0BC",
"BF91C899184",
"275003CF657",
"B5C513F1239",
"37E5B5DF551",
"21369EA08FF",
"4A44E75602F",
"516FC10A15D",
"68A814A74F1",
"594E519AE49"

]

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
     if (!serverState.users[parsedUser.username] && keys.indexOf(parsedUser.reg)>=0) {
       serverState.users[parsedUser.username] = parsedUser.password;
       keys = keys.filter(x=>{
           return x!==parsedUser.reg
       })
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
    console.log('TEST')
    res.send(JSON.stringify(serverState.messages))
})

app.listen(4000, ()=>{
    console.log('listening 4k')
})