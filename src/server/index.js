import wapplrServer from 'wapplr';

export default function createServer(p = {}) {
    console.log("[wapplr-pwa] There is not server side module in this package");
    return p.wapp || wapplrServer({...p});
}

export function createMiddleware(p = {}) {
    return function pwaMiddleware(req, res, next) {
        // eslint-disable-next-line no-unused-vars
        const wapp = req.wapp || p.wapp || createServer(p);
        console.log("[wapplr-pwa] There is not server side module in this package");
        next();
    }
}

const defaultConfig = {
    config: {
        globals: {
            DEV: (typeof DEV !== "undefined") ? DEV : undefined,
            WAPP: (typeof WAPP !== "undefined") ? WAPP : undefined,
            RUN: (typeof RUN !== "undefined") ? RUN : undefined,
            TYPE: (typeof TYPE !== "undefined") ? TYPE : undefined,
            ROOT: (typeof ROOT !== "undefined") ? ROOT : __dirname,
            NAME: (typeof NAME !== "undefined") ? NAME : undefined,
        }
    }
};

export function run(p = defaultConfig) {

    if (p?.config?.globals && !p.config.globals.RUN){
        p.config.globals.RUN = p.config?.globals.NAME || "wapplr-pwa"
    }

    const {env} = process;
    env.NODE_ENV = process.env.NODE_ENV;

    const wapp = createServer(p);
    const globals = wapp.globals;
    const {DEV} = globals;

    const app = wapp.server.app;
    app.use(createMiddleware({wapp, ...p}));
    wapp.server.listen();

    if (typeof DEV !== "undefined" && DEV && module.hot){
        app.hot = module.hot;
        module.hot.accept("./index");
    }

    return wapp;
}

if (typeof RUN !== "undefined" && RUN === "wapplr-pwa") {
    run();
}
