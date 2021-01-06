const handlers = {};

function checkConnectivity() {
    /**
    * PWA Starter Demo
    * Add logic to change colors or theme here to let user know about connectivity changes
    */
    if (navigator.onLine) {
        navigator.serviceWorker.ready
            .then(function (reg) {
                if (handlers.onlineHandler) {
                    return handlers.onlineHandler({reg})
                }
                return null;
            });
    } else {
        navigator.serviceWorker.ready
            .then(function (reg) {
                if (handlers.offlineHandler) {
                    return handlers.offlineHandler({reg})
                }
                return null;
            });
    }
}

function addListeners() {
    removeListeners();
    window.addEventListener("online", checkConnectivity, false);
    window.addEventListener("offline", checkConnectivity, false);
}

function removeListeners() {
    window.removeEventListener("online", checkConnectivity, false);
    window.removeEventListener("offline", checkConnectivity, false);
}

export default function networkChange(p = {}) {

    const {wapp, onlineHandler, offlineHandler} = p;

    handlers.onlineHandler = onlineHandler;
    handlers.offlineHandler = offlineHandler;

    if (wapp.pwa.addedCheckConnectivityListener){
        window.removeEventListener("online", wapp.pwa.addedCheckConnectivityListener, false);
        window.removeEventListener("offline", wapp.pwa.addedCheckConnectivityListener, false);
    }

    wapp.pwa.addedCheckConnectivityListener = checkConnectivity;

    addListeners();
    if (!navigator.onLine) {
        checkConnectivity();
    }

}
