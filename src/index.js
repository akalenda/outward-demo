const Koa = require('koa');
const KoaRouter = require('koa-router');
const KoaLogger = require('koa-logger');

const app = new Koa();
const router = new KoaRouter();

app.use(KoaLogger());
app.use(async ctx => {
    ctx.body = 'Hello World';
});
app.listen(3000);