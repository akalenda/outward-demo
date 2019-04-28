const Koa = require('koa');
const KoaLogger = require('koa-logger');
const KoaRouter = require('koa-router');
const KoaStatic = require('koa-static');

const app = new Koa();
const router = new KoaRouter();

app.use(KoaLogger());
app.use(KoaStatic('frontend/public'));

router.get('/api/math', (ctx, ignored) => ctx.body = MathExpression.from(ctx.body).evaluate().toString());

app.use(router.routes());
app.use(router.allowedMethods());
app.listen(3000);


