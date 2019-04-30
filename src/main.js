'use strict';

const fs = require('fs');
const HttpProtocols = require('./frontend/public/HttpProtocols');
const Https = require('https');
const Koa = require('koa');
const KoaBodyParser = require('koa-bodyparser');
const KoaLogger = require('koa-logger');
const KoaRouter = require('koa-router');
const KoaStatic = require('koa-static');
const MathExpression = require('./backend/MathExpression');
const Login = require('./backend/Login');

const app = new Koa();
const router = new KoaRouter();

const SESSION_KEY = 'sessionKey';
const DOMAIN = 'outward-demo';
const PORT = 3000;

startServices().catch(error => {
    console.log(error)
});

async function startServices() {
    let loginsAreAvailable = await insertTestUserIntoDatabase();
    if (!loginsAreAvailable)
        throw new Error('Failed to store in database despite no obvious error :(');
    await setKoaToUseMiddleware();
    startMathService();
    startAuthService();
    startLoginService();
    await startLogoutService();
    startServer()
}

/**
 * @returns {Promise<Boolean>}
 */
async function insertTestUserIntoDatabase(){
    let Database = require('./backend/Database');
    let Cryptographer = require('./backend/Cryptographer');
    let username = 'testuser';
    let password = 'password1234';
    let salt = await Cryptographer.generateUniqueSalt();
    let encryptedPassword = Cryptographer.encrypt(password, salt);
    let saltStoredPromise = Database.storeSalt(username, salt);
    let passwordStoredPromise = Database.storeEncryptedPassword(username, encryptedPassword);
    let saltStoreSuccess = await saltStoredPromise;
    let passwordStoreSuccess = await passwordStoredPromise;
    return saltStoreSuccess && passwordStoreSuccess;
}

async function setKoaToUseMiddleware() {
    app.use(KoaLogger());
    app.use(KoaStatic('frontend/public'));
    app.use(KoaBodyParser());
    app.use(router.routes());
    app.use(router.allowedMethods());
}

function startMathService() {
    router.post('/api/math', async (ctx, ignored) => {
        let text = ctx.request.body.text;
        ctx.body = MathExpression.from(text).evaluate().toString();
    });
}

function startAuthService() {
    router.get('/auth', async (ctx, ignored) => {
        try {
            // TODO: Surely there's a better way to handle these booleans. Maybe Promises/yield? But that mixes up intentional exceptions with unintended errors...
            let userKey = getCookie(ctx, SESSION_KEY);
            if (userKey) {
                let login = Login.getByKey(userKey);
                if (login) {
                    sendHtml(ctx, './frontend/private/auth/auth.html');
                } else {
                    ctx.body = await showLoginPage(ctx);
                }
            } else {
                ctx.body = await showLoginPage(ctx);
            }
        } catch (error) {
            console.log(error);
            ctx.throw(403);
        }
    });
}

function startLoginService() {
    router.post('/api/login', async (ctx, ignored) => {
        try {
            // TODO: Measure timing and create a lower bound. Wrap login process so that, regardless of execution path, it takes the same time. This is to provide some protection against timing attacks.
            let userKey = getCookie(ctx, SESSION_KEY);
            if (userKey) {
                let login = Login.getByKey(userKey);
                if (login) {
                    ctx.redirect('/auth');
                    return ctx;
                } else {
                    expireCookie(ctx, SESSION_KEY);
                    ctx.body = await showLoginPage(ctx);
                    return ctx;
                }
            }
            let username = ctx.request.body.username.toLowerCase();
            let password = ctx.request.body.password;
            let userLogin = await new Login(username).attemptLogin(password);
            if (userLogin._isLoggedIn) {
                setCookie(ctx, SESSION_KEY, userLogin.getKey(), userLogin.getExpirationDate());
                ctx.redirect('/auth');
                return ctx;
            } else {
                ctx.throw(403);
            }
        } catch (error) {
            console.log(error);
            ctx.throw(403);
        }
        return ctx;
    });
}

function startLogoutService() {
    router.post('/api/logout', async (ctx, ignored) => {
        try {
            let userKey = getCookie(ctx, SESSION_KEY);
            let login = Login.getByKey(userKey);
            if (login) {
                login.logout();
            }
            ctx.redirect('/auth');
        } catch (error) {
            console.log(error);
            // send message regarding failure to log out
        }
    });
}

function startServer() {
    try {
        app.listen(PORT);
        // TODO switch to SSL, unfortunately, binding certbot to a domain seems to be a problem when i dont own one
        // Https.createServer(app.callback()).listen(PORT);
        console.log("Server listening on port " + PORT);
        console.log("Current working directory: " + __dirname);

        // a quick experiment...
        let app2 = new Koa();
        app2.use(async ctx => {
            ctx.body = 'hallo wyrld';
            ctx.cookies.set('foo', 'bar', {httpOnly: false});
            // TODO: Aha! This works. Perhaps it is a problem with the routes, or with being a few function layers deep
            // without proper Promise propogation. Or maybe they should be generators. More experiments ensue...
            console.log(ctx.cookies);
        });
        app2.listen(4242);

    } catch(error) {
        console.log(error);
    }
}

/**
 * @param ctx
 * @param {string} name
 * @returns {String}
 */
function getCookie(ctx, name) {
    return ctx.cookies.get(name);
}

function expireCookie(ctx, name) {
    ctx.cookies.set(name);
}

function setCookie(ctx, name, value, expirationDate) {
    let options = {  // TODO: credentials
        /*domain: DOMAIN,
        secure: false,  // TODO: switch to SSL, set true
        samesite: true,
        overwrite: true,*/
        httpOnly: false
    };
    if(expirationDate instanceof Date) {
        options.expires = expirationDate;
    }
    // TODO: Setting cookies isn't happening! That's why we can't log in. But WHYYYYYyyyyyy
    ctx.cookies.set(name, value, options);
}

function showLoginPage(ctx) {
    return sendHtml(ctx, './frontend/private/login.html');
}

function sendHtml(ctx, filePath) {
    ctx.set('Content-Type', HttpProtocols.CONTENT_TYPES.html);
    return getPromiseOfFileContents(filePath);
}

function sendJs(ctx, filePath) {
    ctx.set('Content-Type', HttpProtocols.CONTENT_TYPES.js);
    return getPromiseOfFileContents(filePath);
}

function getPromiseOfFileContents(filepath) {
    return new Promise((fulfill, fail) => {
        fs.readFile(filepath, (error, data) => {
            if (error) {
                fail(error);
            } else {
                fulfill(data.toString());
            }
        })
    });
}