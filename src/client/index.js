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

export function run(p = {}) {

    const wapp = createClient(p);
    const globals = wapp.globals;
    const {DEV} = globals;

    const app = wapp.client.app;

    app.use(createMiddleware({wapp, ...p}))
    wapp.client.listen();

    if (typeof DEV !== "undefined" && DEV && module.hot){
        module.hot.accept();
    }

    return wapp;
}

if (typeof RUN !== "undefined" && RUN === "wapplr-pwa") {
    run();
}
