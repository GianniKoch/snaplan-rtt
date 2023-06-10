import express from 'express'
import passport from 'passport'
import session from 'express-session'
import passportSteam from 'passport-steam'
import cors from "cors";
import {addUser, getUser, joinUser} from "./services/user-service.js";
import {fetchAllScores, fetchScoresByPlayerId, getScoresByPlayerId, processScore} from "./services/score-service.js";
import 'dotenv/config'
import WebSocket from 'ws';
import {getRounds} from "./services/round-service.js";

const SteamStrategy = passportSteam.Strategy

const port = process.env.API_PORT;

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

// Initiate Strategy
passport.use(new SteamStrategy({
        returnURL: process.env.API_URL + '/api/auth/steam/return',
        realm: process.env.API_URL + '/',
        apiKey: '34F837B3C3FCFC7BBF313DB60FEED3C8'
    }, function (identifier, profile, done) {
        setTimeout(function () {
            profile.identifier = identifier;
            return done(null, profile);
        }, 1);
    }
));

const app = express()

app.use(cors({
    origin: process.env.ORIGIN_URL,
    credentials: true
}))

app.use(session({
    secret: 'qsfsqfqf', // TODO: Change this
    saveUninitialized: true,
    resave: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // 1 Day
        // maxAge: 1000 * 60 * 60 * 24 * 4 // SnapLAN weekend
    }
}));

app.use(passport.initialize());

app.use(passport.session());

app.get('/api/me', async (req, res) => {
    if (!req.user) return res.status(403).send({});
    const user = await getUser(req.user.id);
    res.send({user});
});

app.get('/api/scores', async (req, res) => {
    if (!req.user) return res.status(403).send({});
    const scores = await getScoresByPlayerId(req.user.id);
    res.send({scores});
});

app.get('/api/rounds', async (req, res) => {
    res.send(await getRounds());
});

app.get('/api/scores/fetch-all', async (req, res) => {
   if(!req.user || !(await getUser(req.user.id)).admin) return res.status(403).send({});
   fetchAllScores();
   res.status(200).send({});
});

// Routes
app.get('/api/auth/steam', passport.authenticate('steam', {failureRedirect: '/'}), function (req, res) {
    res.redirect(process.env.ORIGIN_URL)
});

app.get('/api/auth/steam/return', passport.authenticate('steam', {failureRedirect: '/'}), function (req, res) {
    addUser(req.user.id, req.user.displayName);
    res.redirect(process.env.ORIGIN_URL)
});

app.get('/api/auth/steam/logout', function (req, res) {
    req.logout(() => res.redirect(process.env.ORIGIN_URL));
});

app.get('/api/join', function (req, res) {
    if (!req.user) return res.redirect(process.env.ORIGIN_URL);
    res.redirect(process.env.ORIGIN_URL)
    joinUser(req.user.id)
    console.log(`Added user ${req.user.displayName} to the game!`);
    fetchScoresByPlayerId(req.user.id);
});

app.listen(port, async () => {
    console.log('listening on port ' + port + '...');
});

const ws = new WebSocket('ws://scoresaber.com/ws');

ws.on('error', console.error);

ws.on('message', (data) => {
    try {
        const message = JSON.parse(data.toString())
        try {
            message.commandName === 'score' && processScore(message.commandData)
        } catch (e) {
            console.log(e)
        }
    } catch (e) {
        console.warn('Received invalid message from scoresaber.com')
    }
})