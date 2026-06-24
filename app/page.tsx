import Link from "next/link";
import TopBar from "@/components/TopBar";
import Boot from "@/components/Boot";
import ProcessTable from "@/components/ProcessTable";
import { getFeaturedRepos } from "@/lib/github";
import { getPosts } from "@/lib/writing";
import { toolchain } from "@/content/work";
import { site } from "@/content/site";

export default async function Home() {
  const repos = await getFeaturedRepos();
  const posts = getPosts().slice(0, 4);

  return (
    <>
      <Boot />
      <div className="app">
        <TopBar />

        <header className="hero">
          <div className="kick">$ ./jeramiah --status</div>
          <h1>
            I build software for <span className="g">ABA therapy</span>.
            <span className="cur" aria-hidden="true" />
          </h1>
          <p className="lede">
            <b>Founding engineer</b> on a production, HIPAA-regulated platform, owned end to end: clinical data, an
            offline-first app clinicians use in the field, and the AWS it runs on. Four years before that going from
            frontend work to whole-system ownership.
          </p>
          <p className="now mono">
            // currently: clinical scheduling, a Go side project, and the writing below.
          </p>
        </header>

        <div className="grid">
          <div className="col">
            <ProcessTable />

            <section className="panel" id="source">
              <div className="panel-h mono">
                <span>
                  <span className="cmd">$</span> ls ~/open-source
                </span>
                <span className="r">public on github</span>
              </div>
              <div className="repos">
                {repos.map((r) => (
                  <a className="repo-row" key={r.name} href={r.url} target="_blank" rel="noopener noreferrer">
                    <span className="nm">{r.name}</span>
                    <span className="meta">
                      {r.language}
                      {r.stars > 0 ? ` · ★${r.stars}` : ""}
                    </span>
                    <span className="ds">{r.description}</span>
                  </a>
                ))}
              </div>
            </section>

            <section className="panel" id="about">
              <div className="panel-h mono">
                <span>
                  <span className="cmd">$</span> cat about.md
                </span>
              </div>
              <div className="prose">
                <p>
                  I poured drinks before I wrote software. Bartending is reading a room, working a queue under pressure,
                  and getting small details right when they matter, which turned out to be better preparation for
                  engineering than it sounds.
                </p>
                <p>
                  I went back for a CS degree at WGU while working, then spent four years moving from frontend-leaning
                  full stack to owning features end to end. The turning point was a genogram tool at KVC, where owning
                  one feature from the database to the pixels changed how I think about building software.
                </p>
                <p>
                  Now I am the <b>founding engineer</b> on an ABA therapy platform, which means clinical data, HIPAA,
                  offline-first mobile, and cloud infrastructure all land on my desk. I care about the unglamorous parts:
                  auth that holds up, data models that match the domain, and tools that respect the person using them.
                </p>
                <p>
                  Almost nobody talks publicly about engineering for ABA therapy. I want to be one of the people who
                  does, and to think out loud about what the job becomes when AI writes more of the code.
                </p>
              </div>
            </section>
          </div>

          <aside className="col">
            <section className="panel">
              <div className="panel-h mono">
                <span>
                  <span className="cmd">$</span> cat toolchain
                </span>
                <span className="r">no scores, just signal</span>
              </div>
              <div>
                {toolchain.map((t) => (
                  <div className="tool" key={t.cat}>
                    <div className="cat">{t.cat}</div>
                    <div className="chips">
                      {t.items.map(([name, hot]) => (
                        <span className={`chip${hot ? " hot" : ""}`} key={name}>
                          {name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="panel" id="writing">
              <div className="panel-h mono">
                <span>
                  <span className="cmd">$</span> tail -f writing.log
                </span>
                <span className="r">
                  {posts.length} {posts.length === 1 ? "post" : "posts"}
                </span>
              </div>
              <div className="log">
                {posts.map((p) => (
                  <Link className="wln" key={p.slug} href={`/writing/${p.slug}`}>
                    <div className="top">
                      <span className="tag">[{p.pillar}]</span>
                      {p.draft && <span className="draft">draft</span>}
                    </div>
                    <div className="ttl">{p.title}</div>
                    <div className="ab">{p.summary}</div>
                  </Link>
                ))}
              </div>
            </section>

            <section className="panel">
              <div className="panel-h mono">
                <span>
                  <span className="cmd">$</span> whoami
                </span>
              </div>
              <div className="card">
                <div className="facts mono">
                  <div>
                    <b>role</b>&nbsp; founding engineer, healthtech
                  </div>
                  <div>
                    <b>edu</b>&nbsp;&nbsp; B.S. Computer Science, WGU
                  </div>
                  <div>
                    <b>cert</b>&nbsp; AWS Cloud Practitioner
                  </div>
                  <div>
                    <b>loc</b>&nbsp;&nbsp; {site.location}
                  </div>
                </div>
                <div className="links">
                  <a href={site.socials.github} target="_blank" rel="noopener noreferrer">
                    GitHub
                  </a>
                  <a href={site.socials.linkedin} target="_blank" rel="noopener noreferrer">
                    LinkedIn
                  </a>
                  <a href={site.socials.email}>Email</a>
                </div>
              </div>
            </section>
          </aside>
        </div>

        <div className="eofbar">
          <span className="cmd">$</span> end of output
          <span className="cur" aria-hidden="true" />
        </div>

        <div className="keybar mono">
          <span>
            <b>nav</b> <kbd>↑</kbd>
            <kbd>↓</kbd> <kbd>j</kbd>
            <kbd>k</kbd>
          </span>
          <span>
            <b>open</b> <kbd>enter</kbd>
          </span>
          <span>
            <b>filter</b> <kbd>/</kbd>
          </span>
          <span>
            <b>close</b> <kbd>esc</kbd>
          </span>
          <span style={{ marginLeft: "auto" }}>© 2026 jeramiah coffey. built from scratch, no template.</span>
        </div>
      </div>
    </>
  );
}
