if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}
const express = require('express')
const app = express()
const bcrypt = require('bcrypt') 
const localStrategy = require('passport-local').Strategy
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')


//calls the function for the passport configurations
 initializePassport(
    passport, 
    email=> users.find(user=> user.email === email),
    id=>users.find(user=> user.id === id)
)


//A variable to store users, this is temporary while not working with a database
const users = []



app.set('view-engine', 'ejs' );
app.use(express.urlencoded({extended: false}))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))


//The routes

app.get('/', checkAutenticated, (req, res)=>{
    res.render('index.ejs', {name: req.user.name})  //renders a message to the user when logged in
})


app.get('/login', checkNotAuthenticated, (req, res)=>{
    res.render('login.ejs')
})


app.post('/login', checkNotAuthenticated, passport.authenticate('local', {  
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))


app.get('/register', checkNotAuthenticated,  (req, res)=>{
    res.render('register.ejs') 
})


app.post('/register',checkNotAuthenticated,  async (req, res)=>{
    try{
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword  
        })
        res.redirect('/login') //login with the account you created
    }catch{
        res.redirect('/register') //if something wrong try to register again
    }
})


app.delete('/logout', (req, res)=>{
    req.logOut(); //clears session, logs out user
    res.redirect('/login')
})


// Functions to check authentication. What client get based on being logged in or not.

function checkAutenticated(req, res, next){ 
    if(req.isAuthenticated()){
        return next()   // then proceed to render the requested page
    }
    res.redirect('/login') //if not authenticated then login to enter homepage
}


function checkNotAuthenticated(req, res, next){ 
    if(req.isAuthenticated()){
         return res.redirect('/') 
    }
  next()  // if not logged in, then proceed with the route to '/login' or '/register' as requested
}


//configurations for passport. Checks if user exists and if the email corresponds to the password
function initializePassport(passport, getUserByEmail, getUserById){
    const autenticateUser = async (email, password, done)=>{
        const user = getUserByEmail(email)   
        if(user==null){
            return done(null, false, {message: 'no user with that email'})
        }

        try{
            if(await bcrypt.compare(password, user.password)){ 
                return done(null, user)
            }else{
                return done(null, false, { message: 'Password incorrect'})
            }
            
        }catch(e){
            return done(e)
        }
    }

    passport.use(new localStrategy({usernameField: 'email'},
    autenticateUser))
    passport.serializeUser((user, done)=> done(null, user.id)) 
    passport.deserializeUser((id, done)=>{
        return done(null, getUserById(id))
    })
    
}


//configure the port the server is listening to
app.listen(3000, ()=>{
    console.log('Server listens on port 3000')
})