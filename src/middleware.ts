import { defineMiddleware } from "astro:middleware";

const CANONICAL_HOST = "sakibhasan.dev";
const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "0.0.0.0", "::1"]);

export const onRequest = defineMiddleware((context, next) => {
    const url = new URL(context.request.url);

    if (LOCAL_HOSTS.has(url.hostname)) {
        return next();
    }

    if (url.hostname !== CANONICAL_HOST || url.protocol !== "https:") {
        url.hostname = CANONICAL_HOST;
        url.protocol = "https:";
        url.port = "";
        return new Response(null, {
            status: 301,
            headers: {
                Location: url.toString(),
                "Cache-Control": "public, max-age=3600",
            },
        });
    }

    if (url.pathname === "/index.xml") {
        return new Response(null, {
            status: 301,
            headers: {
                Location: "https://sakibhasan.dev/blog",
                "Cache-Control": "public, max-age=86400",
            },
        });
    }

    return next();
});
