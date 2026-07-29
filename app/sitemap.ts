import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { getPublishedPosts } from "@/lib/writing";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPublishedPosts();
  const latestPostDate = posts[0]?.date;

  return [
    {
      url: site.url,
      lastModified: latestPostDate,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${site.url}/writing`,
      lastModified: latestPostDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...posts.map((post) => ({
      url: `${site.url}/writing/${post.slug}`,
      lastModified: post.date,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
  ];
}
