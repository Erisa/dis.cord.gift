import { getAssetFromKV, mapRequestToAsset } from '@cloudflare/kv-asset-handler'
import Toucan from 'toucan-js';


// gives detailed error output and bypasses cache
const DEBUG = false

const config = require('./config.json')

addEventListener("fetch", (event) => {
  const sentry = new Toucan({
    dsn: SENTRY_DSN,
    context: event, // Includes 'waitUntil', which is essential for Sentry logs to be delivered. Also includes 'request' -- no need to set it separately.
    allowedHeaders: ['user-agent', 'CF-Connecting-IP', 'X-Forwarded-For', 'CF-RAY', 'CF-IPCountry', 'CF-Visitor', 'CF-Worker', 'Referer'],
    allowedSearchParams: /(.*)/,
  });

  event.respondWith(handleEvent(event, sentry));
});


async function handleEvent(event, sentry) {
  try {
    if (DEBUG) {
      options.cacheControl = {
        bypassCache: true,
      }
    }

    let options = {}
    let response
    let url = new URL(event.request.url)

    var useragent = event.request.headers.get("User-Agent") || ""

    if (event.request.headers.get("test") == "test"){
      intentionalerror();
    }

    if (url.pathname === "/images/ios.png" || config.userAgentIncludes.some(function(v) { return useragent.indexOf(v) >= 0 })){
        options.mapRequestToAsset = handleRequest()
        response = await getAssetFromKV(event, options)
    } else {
        response = new Response(null, { status: 302, headers: { Location: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" } })
    }

    Object.keys(config.headers).map(function (name) {
        response.headers.set(name, config.headers[name])
    })

    return response
    
  } catch (e) {
    if (!DEBUG) {
      sentry.captureException(e);
      return new Response('Something went wrong', {
        status: 500,
        statusText: 'Internal Server Error',
      });
    }
  }
}

function handleRequest() {
  return request => {
    let newRequest = mapRequestToAsset(request)
    let url = new URL(newRequest.url)

    if (url.pathname === '/images/ios.png' || url.pathname === '/index.html'){
        return newRequest
    } else {
        url.pathname = "/embed.html"
        return new Request(url.toString(), newRequest)
    }    
  }
}