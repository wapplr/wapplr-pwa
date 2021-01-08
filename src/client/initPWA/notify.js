export default function notify(p = {}) {
    const {enableNotifications = true, notifyResolve, notifyReject} = p;
    if (!("Notification" in window)) {
        if (notifyReject){
            notifyReject({err: {message: "Browser does not support notifications"}})
        }
    }
    else if (Notification.permission === "granted") {
        navigator.serviceWorker.ready
            .then(function (reg) {
                if (notifyResolve) {
                    return notifyResolve({reg})
                }
            });
    }
    else if (Notification.permission !== "denied" && enableNotifications) {
        Notification.requestPermission(function (permission) {
            if (permission === "granted") {
                navigator.serviceWorker.ready
                    .then(function (reg) {
                        if (notifyResolve) {
                            return notifyResolve({reg})
                        }
                    });
            } else {
                if (notifyReject){
                    notifyReject({info: {message: "User refused the permission request for notifications"}})
                }
            }
        });
    } else {
        if (enableNotifications){
            notifyReject({info: {message: "User refused the permission request for notifications"}})
        } else {
            notifyReject({info: {message: "Notifications not enabled"}})
        }
    }
}
