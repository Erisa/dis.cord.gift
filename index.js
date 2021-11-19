import { getAssetFromKV, mapRequestToAsset } from '@cloudflare/kv-asset-handler'

// gives detailed error output and bypasses cache
const DEBUG = false

const config = require('./config.json')

addEventListener('fetch', event => {
  event.respondWith(handleEvent(event))
})

async function handleEvent(event) {
  let options = {}
  let response
  let url = new URL(event.request.url)

  try {
    if (DEBUG) {
      options.cacheControl = {
        bypassCache: true,
      }
    }

    if (url.pathname === "/images/ios.png" || config.userAgentIncludes.some(function(v) { return event.request.headers.get("User-Agent").indexOf(v) >= 0 })){
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
    if (DEBUG) {
        return new Response(e.message || e.toString(), { status: 500 })
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