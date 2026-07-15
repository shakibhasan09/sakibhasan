import { getCollection, type CollectionEntry } from "astro:content";

/** Canonical fallback used when `Astro.site` is not configured. */
const SITE_URL = new URL("https://sakibhasan.dev");

/** Resolve the canonical site URL, preferring Astro's configured `site`. */
export function resolveSiteURL(site: URL | undefined): URL {
    return site ?? SITE_URL;
}

const byDateDesc = (
    a: { data: { date: Date } },
    b: { data: { date: Date } },
) => b.data.date.valueOf() - a.data.date.valueOf();

/** Non-draft projects, newest first. */
export async function getPublishedProjects(): Promise<
    CollectionEntry<"projects">[]
> {
    return (await getCollection("projects"))
        .filter((project) => !project.data.draft)
        .sort(byDateDesc);
}

/** Non-draft blog posts, newest first. */
export async function getPublishedPosts(): Promise<CollectionEntry<"blog">[]> {
    return (await getCollection("blog"))
        .filter((post) => !post.data.draft)
        .sort(byDateDesc);
}

interface BreadcrumbItem {
    name: string;
    item: string;
}

/** Build a schema.org BreadcrumbList from ordered pages. */
export function buildBreadcrumb(items: BreadcrumbItem[]) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((entry, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: entry.name,
            item: entry.item,
        })),
    };
}
