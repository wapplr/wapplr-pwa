export default async function register(p = {}) {
    const {enableServiceWorker = true, serviceWorkerResolve, serviceWorkerReject} = p;
    if ("serviceWorker" in navigator && enableServiceWorker) {
        navigator.serviceWorker.register('/serviceWorker.js', { scope: "./" })
            .then(function(reg) {
                if (serviceWorkerResolve){
                    return serviceWorkerResolve({reg})
                }
            })
            .catch(function(err) {
                if (serviceWorkerReject) {
                    serviceWorkerReject({err})
                }
            });
    } else {
        if (!enableServiceWorker) {
            navigator.serviceWorker.getRegistrations().then( async function(registrations) {
                await Promise.all(registrations.map( async function (reg) {
                    return await reg.unregister();
                }))
                if (serviceWorkerReject){
                    return serviceWorkerReject({info: { message: "ServiceWorker not enabled"}})
                }
            })
        } else {
            if (serviceWorkerReject) {
                serviceWorkerReject({err: {message: "Browser not support ServiceWorker"}})
            }
        }
    }

    /*function checkForUpdate(registration) {
        registration.addEventListener("updatefound", function() {
            if (navigator.serviceWorker.controller) {
                var installingWorker = registration.installing;
                installingWorker.onstatechange = function() {
                    console.info("Service Worker State :", installingWorker.state);
                    // eslint-disable-next-line default-case
                    switch(installingWorker.state) {
                        case 'installed':
                            navigator.serviceWorker.ready
                                .then(function (registration) {
                                    registration.showNotification('Site Content Updated\n Please Refresh.')
                                });
                            break;
                        case 'redundant':
                            throw new Error('The installing service worker became redundant.');
                    }
                }
            }
        });
    }*/
}
