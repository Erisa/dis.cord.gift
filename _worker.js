export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        const useragentIncludes = [
            "Discordbot",
            "aiohttp",
            "python-httpx",
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 11.6; rv:92.0) Gecko/20100101 Firefox/92.0"
        ]

        const useragent = request.headers.get("user-agent")
        const match = useragentIncludes.find(element => {
            if (useragent.includes(element)) {
                return true;
            }
        }) !== undefined

        if (url.pathname === "/images/ios.png") {
            return env.ASSETS.fetch(request);
        } else if (!match) {
            return new Response(null, { status: 302, headers: { Location: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" } })
        } else {
            if (url.pathname === "/" || url.pathname === "/index" || url.pathname === "/index.html") {
                return env.ASSETS.fetch(request);
            } else {
                url.pathname = "/embed"
                const req = new Request(url.toString(), {
                    cf: request.cf
                });
                return env.ASSETS.fetch(req);            
            }
        }
    },
};
