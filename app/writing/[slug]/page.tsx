import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import TopBar from "@/components/TopBar";
import { site } from "@/content/site";
import { getPublishedPost, getPublishedPosts, formatDate } from "@/lib/writing";
import { SOCIAL_IMAGE_ALT } from "@/lib/social-image";

export function generateStaticParams() {
  return getPublishedPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPublishedPost(slug);
  if (!post) return {};
  const url = `${site.url}/writing/${slug}`;
  return {
    title: post.title,
    description: post.summary,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.summary,
      type: "article",
      url,
      publishedTime: `${post.date}T00:00:00.000Z`,
      authors: [site.name],
      images: [
        {
          url: `${site.url}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: SOCIAL_IMAGE_ALT,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary,
      images: [{ url: `${site.url}/twitter-image`, alt: SOCIAL_IMAGE_ALT }],
    },
  };
}

export default async function Article({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPublishedPost(slug);
  if (!post) notFound();

  return (
    <div className="app">
      <TopBar />
      <article className="page">
        <Link className="backlink" href="/writing">
          ← writing
        </Link>
        <header className="post-head">
          <h1>{post.title}</h1>
          <div className="meta">
            <span className="pillar">[{post.pillar}]</span>
            <span>{formatDate(post.date)}</span>
            {post.draft && <span>draft</span>}
          </div>
        </header>
        <div className="article">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
        </div>
      </article>
    </div>
  );
}
