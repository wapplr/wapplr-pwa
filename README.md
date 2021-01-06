# Wapplr-pwa

This package is the PWA (progressive-web-app) extension for [Wapplr](https://github.com/wapplr/wapplr).

```js
//client.js
const wapplrPwa = require("wapplr-pwa");
const wapplrClient = require("wapplr");
const wapp = wapplrClient({config: {
        globals: {
            DEV: false //if the DEV global variable was set to true the PWA clear cache when the page loading.
        }
    }
});
wapplrPwa({wapp});
wapp.client.listen();
```

## License

MIT
