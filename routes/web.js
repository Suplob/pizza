const authController = require('../app/http/controllers/authController');
const homeController= require('../app/http/controllers/homeController')

function initRoutes(app){ 
    

    app.get('/', homeController().index)

    app.get('/cart', (req,res)=>{
        res.render('customer/cart');
    })
    
    app.get('/login', authController().login)
    app.get('/register', authController().register)
};


module.exports = initRoutes