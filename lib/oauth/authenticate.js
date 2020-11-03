//console.cloud.google.com/apis

require('dotenv').config();
import passport from 'passport';

const {APP_NAME, APP_ID, APP_HOST, FACEBOOK_APP_ID, FACEBOOK_APP_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, JWT_SECRET} = process.env;

class JWTAuth {
    constructor() {
        const {Strategy, ExtractJwt} = require('passport-jwt');
        passport.use(new Strategy({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: JWT_SECRET,
            // issuer: `${APP_HOST}/token`,
            // audience: APP_HOST 
        }, async (jwt_payload, done) => {
            console.log(jwt_payload);
            console.log('JWT_ACCESSED');
            done(null, {user:'test'})
        }))
    }

    authenticate() {
        return passport.authenticate('jwt', {session: false});
    }
}

class GoogleAuth {
    constructor(orm) {
        console.log('init test')
        const {Strategy} = require('passport-google-oauth20');
        this.orm = orm;

        passport.use(new Strategy({
            clientID: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            callbackURL: `${APP_HOST}/auth/google`
        }, async (accessToken, refreshToken, profile, done) => {
            console.log('dongus');
            let {provider, _json} = profile;
            let providerId = _json.sub;
            let {name, email} = _json;
            const authObject = await this.orm.upsertProvider({provider, providerId, name, email});
            authObject.appId = APP_ID;
            return done(null, authObject);
        }));
    }

    authenticate(){
        return passport.authenticate('google', { failureRedirect: '/login', scope: ['profile','email']})
    }
    login(){
        return passport.authenticate('google', { scope: ['profile', 'email']})
    }
}

class FacebookAuth {
    constructor(orm) {
        const {Strategy} = require('passport-facebook').Strategy;
        this.orm = orm;

        passport.use(new Strategy({
            clientID: FACEBOOK_APP_ID,
            clientSecret: FACEBOOK_APP_SECRET,
            callbackURL: `${APP_HOST}/auth/facebook`,
            profileFields: ['id', 'displayName', 'photos', 'email'],
            enableProof: true
        }, async (accessToken, refreshToken, profile, done) => {
            let {provider, _json} = profile;
            let {name, email} = _json;
            let providerId = _json.id;
            const authObject = await this.orm.upsertProvider({provider, providerId, name, email, done});
            authObject.appId = APP_ID;
            return done(null, authObject);
            // console.log(profile);
            // In this example, the user's profile is supplied as the user
            // record.  In a production-quality application, the profile should
            // be associated with a user record in the application's database, which
            // allows for account linking and authentication with other identity
            // providers.
            // return done(null, profile);
        }));
    }

    login() {
        return passport.authenticate('facebook',{scope:['email']})
    }

    authenticate() {
        return passport.authenticate('facebook', { failureRedirect: '/login', scope:['email, user_friends']})
    }
}



// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  In a
// production-quality application, this would typically be as simple as
// supplying the user ID when serializing, and querying the user record by ID
// from the database when deserializing.  However, due to the fact that this
// example does not have a database, the complete profile is serialized
// and deserialized.

passport.serializeUser((user, done) => done(null, user));  
passport.deserializeUser((id, done) => done(null, id));

module.exports = {
    JWTAuth,
    GoogleAuth,
    FacebookAuth
}

