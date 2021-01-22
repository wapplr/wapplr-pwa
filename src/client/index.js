import wapplrClient from "wapplr";
import initPWA from "./initPWA";

export default async function createClient(p) {
    const wapp = p.wapp || wapplrClient({...p});
    return await initPWA({wapp, ...p});
}

export function createMiddleware(p = {}) {
    return async function pwaMiddleware(req, res, next) {
        const wapp = req.wapp || p.wapp || await createClient(p).wapp;
        await initPWA({wapp, ...p});
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

export async function run(p = defaultConfig) {

    const pwa = await createClient(p);
    const wapp = pwa.wapp;
    const globals = wapp.globals;
    const {DEV} = globals;

    const app = wapp.client.app;
    app.use(createMiddleware({wapp, ...p}))
    wapp.client.listen();

    if (typeof DEV !== "undefined" && DEV && module.hot){
        app.hot = module.hot;
        module.hot.accept();
    }

    return wapp;
}

if (typeof RUN !== "undefined" && RUN === "wapplr-pwa") {
    run();
}
