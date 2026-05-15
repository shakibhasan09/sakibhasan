import cloudflare from "@astrojs/cloudflare";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

export default defineConfig({
    site: "https://sakibhasan.dev",
    trailingSlash: "never",
    adapter: cloudflare({}),
    prefetch: {
        prefetchAll: false,
        defaultStrategy: "hover",
    },
    vite: {
        plugins: [tailwindcss()],
    },
    markdown: {
        shikiConfig: {
            themes: {
                light: "github-light",
                dark: "github-dark",
            },
            defaultColor: false,
        },
    },
    integrations: [
        sitemap({
            filter: (page) => !page.includes("/api/"),
            changefreq: "weekly",
            lastmod: new Date(),
            serialize(item) {
                const url = new URL(item.url);
                if (url.pathname === "/") {
                    return { ...item, priority: 1.0, changefreq: "weekly" };
                }
                if (url.pathname === "/projects" || url.pathname === "/blog") {
                    return { ...item, priority: 0.9, changefreq: "weekly" };
                }
                if (
                    url.pathname.startsWith("/projects/") ||
                    url.pathname.startsWith("/blog/")
                ) {
                    return { ...item, priority: 0.7, changefreq: "monthly" };
                }
                if (url.pathname === "/contact") {
                    return { ...item, priority: 0.5, changefreq: "yearly" };
                }
                return item;
            },
        }),
        mdx(),
        react(),
    ],
});
