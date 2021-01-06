import wapplrClient from "wapplr";
import pwa from "./pwa";

export default function createClient(p) {
    const wapp = p.wapp || wapplrClient({...p});
    pwa({wapp, ...p});
    return wapp;
}

export function createMiddleware(p = {}) {
    return function pwaMiddleware(req, res, next) {
        const wapp = req.wapp || p.wapp || createClient;
        pwa({wapp, ...p});
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
            ROOT: (typeof ROOT !== "undefined") ? ROOT : "/"
        }
    }
}

export function run(p = defaultConfig) {

    const wapp = createClient(p);
    const globals = wapp.globals;
    const {DEV} = globals;

    const app = wapp.client.app;
    app.use(createMiddleware({wapp, ...p}))
    wapp.client.listen();

    if (typeof DEV !== "undefined" && DEV && module.hot){
        app.hot = module.hot;
        module.hot.accept("./index");
    }

    return wapp;
}

if (typeof RUN !== "undefined" && RUN === "wapplr-pwa") {
    run();
}
