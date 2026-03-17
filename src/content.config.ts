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
    schema: z.object({
        title: z.string(),
        description: z.string(),
        date: z.coerce.date(),
        tags: z.array(z.string()).default([]),
        url: z.string().url(),
        stars: z.number().default(0),
        type: z.enum(["open-source", "client"]).default("open-source"),
        draft: z.boolean().default(false),
        problem: z.string().optional(),
        solution: z.string().optional(),
        results: z.array(z.string()).default([]),
    }),
});

export const collections = { blog, projects };
