import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import TopBar from "@/components/TopBar";
import { getPost, getPosts, formatDate } from "@/lib/writing";

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.summary,
    openGraph: { title: post.title, description: post.summary, type: "article" },
    twitter: { card: "summary_large_image", title: post.title, description: post.summary },
  };
}

export default async function Article({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
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
