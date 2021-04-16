const express = require('express');
const app = express();
const ejs = require('ejs');
const path = require('path');
const expressLayout = require('express-ejs-layouts');



const PORT = process.env.PORT || 5000;



app.get('/', (req,res)=> {
    res.render('home');
})

app.use(express.static('public'));
app.use(expressLayout);
app.set('views', path.join(__dirname, '/resources/views'));
app.set('view engine', 'ejs');

app.listen(PORT, function () {
    console.log(`listening on ${PORT}`);
})