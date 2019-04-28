const Koa = require('koa');
const KoaBodyParser = require('koa-bodyparser');
const KoaLogger = require('koa-logger');
const KoaRouter = require('koa-router');
const KoaStatic = require('koa-static');
const MathExpression = require('./backend/MathExpression');
const Login = require('./backend/Login');

const app = new Koa();
const router = new KoaRouter();

app.use(KoaLogger());
app.use(KoaStatic('frontend/public'));
app.use(KoaBodyParser());

router.post('/api/math', async (ctx, ignored) => {
    let text = ctx.request.body.text;
    ctx.body = MathExpression.from(text).evaluate().toString()
});

router.get('/auth', async (ctx, ignored) => {
    try {
        // TODO: Surely a better way to handle these booleans.
        // Maybe Promises/yield? But that mixes up intentional exceptions with unintended errors...
        let sessionCookie = await getSessionCookieFrom(ctx);
        if (sessionCookie) {
            let login = await Login.getByKey(sessionCookie);
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
    }
});

router.post('/api/login', async (ctx, ignored) => {
    try {
        let username = 'testuser'.toLowerCase();
        let password = 'password1234';
        let userLogin = new Login(username, password).attemptLogin();
        if (userLogin._isLoggedIn) {
            let sessionCookie = userLogin.getKey();
            // set sessionCookie in response
            // set status ok
            // redirect to new page
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
        let sessionCookie = getSessionCookieFrom(ctx);
        let login = Login.getByKey(sessionCookie);
        if (login) {
            login.logout();
        }
        // redirect
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
 * @returns {String}
 */
function getSessionCookieFrom(ctx) {
    // TODO
}

