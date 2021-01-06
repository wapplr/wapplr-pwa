export default function registerSync(p = {}) {
    const {syncReadyHandler, syncReject} = p;
    if ("serviceWorker" in navigator && "SyncManager" in window) {
        navigator.serviceWorker.ready.then(function(reg) {
            if (syncReadyHandler) {
                return syncReadyHandler({reg})
            }
            return null;
        }).catch(function (err) {
            if (syncReject) {
                return syncReject({err});
            }
        });
    } else {
        if (syncReject) {
            return syncReject();
        }
    }
}
