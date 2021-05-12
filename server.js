require('dotenv').config();
const express = require('express');
const app = express();
const ejs = require('ejs');
const path = require('path');
const expressLayout = require('express-ejs-layouts');
const session = require('express-session');
const flash = require('express-flash');
const MongoDbStore = require('connect-mongo');
const passport = require('passport');
const Emitter = require('events');


const PORT = process.env.PORT || 5000;


const mongoose = require('mongoose');

const url = process.env.MONGO_URL;
mongoose.connect(url, {useNewUrlParser:true, useCreateIndex:true, useUnifiedTopology:true, useFindAndModify:true});
const connection= mongoose.connection;
connection.once('open', ()=> {
    console.log('Database Connected...');
}).catch(err => {
    console.log('Connection Failed');
})





app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: MongoDbStore.create({
          mongoUrl: process.env.MONGO_URL
      }),
    saveUninitialized: false,
    cookie: {maxage: 1000 * 60 *60 * 24}
}))

const passportInit = require('./app/config/passport')
passportInit(passport   )

app.use(passport.initialize())
app.use(passport.session())



app.use(flash());

app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.use((req, res, next) => {
    res.locals.session = req.session
    res.locals.user = req.user
    next()
})


app.use(expressLayout);
app.set('views', path.join(__dirname, '/resources/views'));
app.set('view engine', 'ejs');

require('./routes/web')(app);

const server = app.listen(PORT, function () {
    console.log(`listening on ${PORT}`);
})

//socket

const io = require('socket.io')(server)
io.on('connection', (socket) =>{
    socket.on('join', (orderId) =>{
        socket.join(orderId)
    })
})


//event emitter
const eventEmitter = new Emitter()
app.set('eventEmitter', eventEmitter)

eventEmitter.on('orderUpdated', (data)=>{
    io.to(`order_${data.id}`).emit('orderUpdated', data)
})

eventEmitter.on('orderPlaced', (data)=>{
    io.to('adminRoom').emit('orderPlaced', data)
})