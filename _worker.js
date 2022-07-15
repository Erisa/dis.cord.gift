export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        const useragentIncludes = [
            "Discordbot",
            "aiohttp",
            "python-httpx",
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 11.6; rv:92.0) Gecko/20100101 Firefox/92.0"
        ]

        const headers = {
            "X-Notice": "Contact spotlight+rickroll@joscomputing.space for abuse or pure memes. No harm intended."
        }

        const useragent = request.headers.get("user-agent")
        const match = useragentIncludes.find(element => {
            if (useragent.includes(element)) {
                return true;
            }
        }) !== undefined

        if (url.pathname === "/images/ios.png") {
            return addHeaders(await env.ASSETS.fetch(request), headers);
        } else if (!match) {
            return addHeaders(new Response(null, { status: 302, headers: { Location: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" } }), headers)
        } else {
            if (url.pathname === "/" || url.pathname === "/index" || url.pathname === "/index.html") {
                return addHeaders(await env.ASSETS.fetch(request), headers);
            } else {
                url.pathname = "/embed"
                const req = new Request(url.toString(), {
                    cf: request.cf
                });
                return addHeaders(await env.ASSETS.fetch(req), headers);
            }
        }
    },
};

function addHeaders(response, headers) {
    for (const property in headers) {
        response.headers.set(property, headers[property])
    }
    return response
}
