const express = require('express') //importing our express libary
const app = new express()
const mongo = require('mongoose')
const PORT = 5000


mongo.connect('mongodb://127.0.0.1:27017/nesa',(err)=>{
   if (!err) {
       console.log('connected')
   }
   else console.log('error')
})



app.use(express.json())

// app.listen(PORT,()=>{
//     'life is easy on port:'+PORT
// })
app.get('/', (request, response) =>{
   return response.send('Here at NESA')
})

app.post('/login', (request, response) =>{
   const user = {
       username: 'amara'.toLocaleLowerCase(),
       skilevel: '10',
       height: '6',
       password:'McFly',
       userId: 'amara900egbo7',
       address: '10 anifowoshe street',
       complexion: 'dark',
       laptop: 'Hp',
       gender:'female'
   }
   const data = request.body

   if(data.username.toLocaleLowerCase()==user.username && data.password==user.password){
       return response.json(user)
   }
   else{
       return response.send('wrong auth details')
   }
   //console.log(request);

   return response.json(request.query)

})

app.get('/Register', (request, response) => {
   const user = {
    
    username: 'amara',
    password: 'McFly',
    surname: 'egbo',
    skilevel: '10',
    height: '6',
    address: '10 anifowoshe street',
    complexion: 'dark',
    laptop: 'Hp',
    gender:'female'
   }

   const data = request.query


   if(data.username.toLocaleLowerCase()==user.username && data.password==user.password){
    return response.json(user)
}
else{
    return response.send('wrong auth details')
}


return response.json(request.query)
})

app.get('/profile', (request, response) => {
   return response.send('This is the profile page')
})

app.get('/feed', (request, response) => {
   return response.send('This is the feed page')
})

app.get('/postfeedroute', (request, response) => {
   return response.send('This is the postfeedroute page')
})

app.get('/logout', (request, response) => {
   return response.send('This is the logout page') 
})

app.listen(PORT, (err) => {
   if (err) {
       console.log(err)
   }
   else {
       console.log('My server is live');
   }
})


