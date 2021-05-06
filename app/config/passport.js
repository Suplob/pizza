const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')

function init(passport) {
    passport.use(new LocalStrategy({ usernameField :'email'}, async (email,password,done) => {
       const user = await User.findOne({email: email})
       
       if(!user){ 
           return done(null, false)
        }
    }))
}

module.exports = init