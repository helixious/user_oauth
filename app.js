require('dotenv').config();

import express from 'express';
import passport from 'passport';
import ORM from './lib/db/orm';
import Minio from './s3';

import jwt from 'jsonwebtoken';

import {FacebookAuth, GoogleAuth, JWTAuth} from './lib/oauth/authenticate';
const {SESSION_SECRET, JWT_SECRET, APP_PORT} = process.env;
const app = express();
const fbAuth = new FacebookAuth(ORM);
const googleAuth = new GoogleAuth(ORM);

app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true}));
app.use(require('express-session')({secret: SESSION_SECRET, resave: true, saveUninitialized: true}));

const isLoggedIn = (req, res, next) => req.user ? next() : res.sendStatus(401);
const hasSession = (req, res, next) => {
    !req.user ? next() : res.redirect('/')
};

const getJWT = (req, res, next) => {
    if(!req.user) {
        res.sendStatus(401);
    } else {
        let token = jwt.sign(req.user, JWT_SECRET);
        res.setHeader('Authorization', `Bearer ${token}`);
        res.send(token);
    }
}

// const getJWT = (req, res, next) => !req.user ?  res.sendStatus(401) : res.send(jwt.sign(req.user, JWT_SECRET))
app.use(passport.initialize());
app.use(passport.session());

app.get('/login/facebook', fbAuth.login());
app.get('/auth/facebook', fbAuth.authenticate(), (req, res) => res.redirect('/'));

app.get('/login/google', googleAuth.login());
app.get('/auth/google', googleAuth.authenticate(), (req, res) => res.redirect('/'));

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

app.get('/', isLoggedIn, (req, res) => {
    console.log(req.user);
    res.send('OK');
})

app.get('/buckets', Minio.listBuckets);
app.get('/token', isLoggedIn, getJWT);

app.listen(Number(APP_PORT), () => console.log('server started on port 3000'));