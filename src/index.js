const Koa = require('koa');
const KoaBodyParser = require('koa-bodyparser');
const KoaLogger = require('koa-logger');
const KoaRouter = require('koa-router');
const KoaStatic = require('koa-static');
const MathExpression = require('./backend/MathExpression');

const app = new Koa();
const router = new KoaRouter();

app.use(KoaLogger());
app.use(KoaStatic('frontend/public'));
app.use(KoaBodyParser());

router.post('/api/math', async (ctx, ignored) => {
    let text = ctx.request.body.text;
    ctx.body = MathExpression.from(text).evaluate().toString()
});

app.use(router.routes());
app.use(router.allowedMethods());
app.listen(3000);


