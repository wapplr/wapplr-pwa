export default async function clearCache(p = {}) {
    const {clearCachesEnabled = true, clearCachesResolve, clearCachesReject} = p;
    if (clearCachesEnabled) {
        try {
            let cacheNames = await caches.keys();
            const clearedCaches = await Promise.all(
                cacheNames.map(function (cacheName) {
                    return caches.delete(cacheName);
                })
            )

            const cleared = [];
            const fail = [];
            cacheNames.forEach(function (cacheName, i) {
                if (clearedCaches[i]) {
                    cleared.push(cacheName)
                } else {
                    fail.push(cacheName);
                }
            })

            if (cleared.length === cacheNames.length) {
                if (clearCachesResolve) {
                    clearCachesResolve({cleared})
                }
            } else {
                if (clearCachesReject) {
                    return clearCachesReject({err: {message: "Clear caches fail: " + fail.join(", ")}})
                }
            }

        } catch (err) {
            if (clearCachesReject) {
                return clearCachesReject({err})
            }
        }
    }
}
