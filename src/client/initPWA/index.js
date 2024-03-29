import notify from "./notify";
import networkChange from "./networkChange";
import sync from "./sync";
import register from "./register";
import clearCache from "./clearCache";

export default async function pwa(p = {}) {

    const {wapp} = p;
    const {globals = {}} = wapp;
    const {DEV} = globals;

    const {
        clearCachesEnabled = DEV,
        clearCachesResolve = function ({cleared}) {
            if (cleared.length) {
                console.log("[PWA] Caches cleared: " + cleared.join(", "));
            } else {
                console.log("[PWA] There are not caches");
            }
        },
        clearCachesReject = function ({err}) {
            if (err){
                console.log("[PWA] Clear cache error: " + err.message)
            }
        },

        enableNotifications = false,
        notifyResolve = function ({reg}) {
            console.log("[PWA] Permitted notifications");
        },
        notifyReject = function ({err, info}) {
            if (err){
                console.log("[PWA] Notify error: " + err.message)
            } else if (info){
                console.info("[PWA] Notify info: " + info.message)
            }
        },

        onlineHandler = function ({reg}) { console.log("[PWA] Online again") },
        offlineHandler = function ({reg}) { console.log("[PWA] Lost connection") },

        syncReject = function (p = {}) {
            const {err} = p;
            if (err) {
                console.log("[PWA] Failed to register sync: " + err.message)
            } else {
                console.log("[PWA] Serviceworker/sync not supported");
            }
        },
        syncReadyHandler = async function ({reg}) {
            console.log("[PWA] Sync service is ready");
            return reg.sync.register("syncTag").then(function () {
                console.log("[PWA] Sync registered")
            }).catch(function (err) {
                syncReject({err})
            })
        },

        enableServiceWorker = true,
        serviceWorkerResolve = function ({reg}) {
            console.log("[PWA] Service Worker registered");
        },
        serviceWorkerReject = function (p = {}) {
            const {err, info} = p;
            if (err){
                console.log("[PWA] ServiceWorker error: " + err.message)
            } else if (info){
                console.info("[PWA] ServiceWorker info: " + info.message)
            }
        },

    } = p;

    if (typeof wapp.pwa == "undefined") {

        Object.defineProperty(wapp, "pwa", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });

        await clearCache({clearCachesEnabled, clearCachesResolve, clearCachesReject, ...p});

        await register({
            enableServiceWorker,
            serviceWorkerReject,
            ...p,
            serviceWorkerResolve: function ({reg}) {

                wapp.pwa = reg;

                if (serviceWorkerResolve) {
                    serviceWorkerResolve({reg})
                }
                notify({enableNotifications, notifyResolve, notifyReject, ...p});
                networkChange({onlineHandler, offlineHandler, ...p});
                sync({syncReadyHandler, syncReject, ...p});
            }
        });

        Object.defineProperty(wapp.pwa, "wapp", {configurable: false, writable: false, enumerable: false, value: wapp});

    }

    return wapp.pwa;

}
