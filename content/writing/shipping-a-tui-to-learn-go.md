---
title: Shipping a TUI to learn Go
date: 2026-06-05
pillar: learning
summary: I learned Go by building portview and distributing it through Homebrew. The point was not the tool. It was finishing something end to end in a language I did not know.
draft: true
---

I had never written Go. So I built a thing in Go and shipped it.

`portview` is a small terminal app that scans localhost, shows you every dev server currently listening, tells you which process owns each port, and lets you open, kill, label, and filter them. It scratched a real itch. I am always losing track of what is running on which port. But the tool was an excuse. The actual goal was to learn a language by carrying one project all the way from empty folder to something other people can install.

## Why finishing matters

It is easy to learn a language up to the toy stage. The tutorials get you to "hello world" and a few exercises, and then you stall. The parts that actually teach you are the ones past the tutorial: project structure, error handling that is not just panicking, dependencies, builds, and the unglamorous work of distribution.

So I made distribution a requirement, not an afterthought. portview ships as a single binary across platforms, through a Homebrew tap and GitHub Releases, with checksums. Setting that up taught me more about Go's toolchain and the release flow than any amount of reading would have.

## Learning when the machine can write the code

There is a trap here in 2026. I could have asked an agent to write the whole thing and had a working tool in an afternoon, and learned almost nothing. So I drew a line. On a project meant for learning, the AI guides and explains, but I write the code. I let it point me at idioms and catch my mistakes, then I sit with why the fix works before moving on.

That is the deal I have made with myself: use the tools for speed when speed is the point, and deliberately slow down when understanding is the point. portview was a slow-down-on-purpose project, and it stuck.

## What I would tell past me

Pick something small enough to finish and real enough to ship. The finishing is the curriculum.
