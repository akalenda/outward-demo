const Koa = require('koa');
const KoaLogger = require('koa-logger');
const KoaRouter = require('koa-router');
const KoaStatic = require('koa-static');

const app = new Koa();
const router = new KoaRouter();

app.use(KoaLogger());
app.use(KoaStatic('frontend/public'));

app.use(router.routes());
app.use(router.allowedMethods());
app.listen(3000);
