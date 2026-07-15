import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { defineCollection } from "astro:content";

const blog = defineCollection({
    loader: glob({ pattern: "**/*.mdx", base: "./src/content/blog" }),
    schema: z.object({
        title: z.string(),
        description: z.string(),
        date: z.coerce.date(),
        tags: z.array(z.string()).default([]),
        draft: z.boolean().default(false),
    }),
});

const projects = defineCollection({
    loader: glob({ pattern: "**/*.mdx", base: "./src/content/projects" }),
    schema: ({ image }) =>
        z.object({
            title: z.string(),
            description: z.string(),
            date: z.coerce.date(),
            tags: z.array(z.string()).default([]),
            url: z.string().url(),
            cover: image().optional(),
            coverDark: image().optional(),
            coverBg: z.string().optional(),
            coverBgDark: z.string().optional(),
            stars: z.number().default(0),
            type: z.enum(["open-source", "client"]).default("open-source"),
            badge: z.string().optional(),
            draft: z.boolean().default(false),
        }),
});

export const collections = { blog, projects };
