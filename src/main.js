'use strict';

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

app.use(KoaLogger());
app.use(KoaStatic('frontend/public'));
app.use(KoaBodyParser());

router.post('/api/math', async (ctx, ignored) => {
    let text = ctx.request.body.text;
    ctx.body = MathExpression.from(text).evaluate().toString()
});

router.get('/auth', async (ctx, ignored) => {
    try {
        // TODO: Surely there's a better way to handle these booleans. Maybe Promises/yield? But that mixes up intentional exceptions with unintended errors...
        let userKey = getCookie(ctx);
        if (userKey) {
            let login = Login.getByKey(userKey);
            if (login) {
                // show authenticated page
            } else {
                // show login page
            }
        } else {
            // show login page
        }
    } catch(error) {
        console.log(error);
        // show status 403
    }
});

router.post('/api/login', async (ctx, ignored) => {
    try {
        // TODO: Measure timing and create a lower bound. Wrap login process so that, regardless of execution path, it takes the same time. This is to provide some protection against timing attacks.
        let userKey = getCookie(ctx);
        if (userKey) {
            let login = Login.getByKey(userKey);
            if (login) {
                ctx.redirect('/auth');
            } else {
                expireCookie(ctx, SESSION_KEY);
            }
        }
        let username = 'testuser'.toLowerCase();
        let password = 'password1234';
        let userLogin = new Login(username, password).attemptLogin();
        if (userLogin._isLoggedIn) {
            setCookie(ctx, SESSION_KEY, userLogin.getKey(), userLogin.getExpirationDate());
            ctx.redirect('/auth');
        } else {
            // set status 403
        }
    } catch (error) {
        console.log(error);
        // set status 403
    }
});

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

app.use(router.routes());
app.use(router.allowedMethods());
app.listen(3000);  // TODO: Switch to certificated SSL

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
    let options = {
        domain: DOMAIN,
        secure: true,
        samesite: true,
        overwrite: true
    };
    if(expirationDate instanceof Date) {
        options.expires = expirationDate;
    }
    ctx.cookies.set(name, value, options);
}
