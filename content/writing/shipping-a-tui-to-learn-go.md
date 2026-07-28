---
title: Shipping a TUI to learn Go
date: 2026-07-27
pillar: learning
summary: I learned Go by building portview and distributing it through Homebrew. The point was not the tool. It was finishing something end to end in a language I did not know.
draft: false
---

I had never written Go. So I built a thing in Go and shipped it.

`portview` is a terminal app that finds every TCP server listening on localhost, shows which process owns each port, and lets you inspect, open, kill, label, and filter them. I built it because I was tired of running some variation of `lsof -i -P | grep LISTEN` and still not knowing which project owned port 3001.

The tool solved a real annoyance. It was also an excuse to learn a language by carrying one project from an empty directory to something another person could install.

## Why finishing matters

It is easy to learn a language up to the toy stage. The tutorials get you to "hello world" and a few exercises, and then you stall. The parts that actually teach you are the ones past the tutorial: project structure, error handling that is not just panicking, dependencies, builds, and the unglamorous work of distribution.

So I made distribution a requirement, not an afterthought. The definition of done was not "it runs on my laptop." It was:

- one binary with no application runtime to install
- macOS and Linux support
- a Homebrew command I would actually remember
- prebuilt release binaries with checksums
- a CI pipeline that proves the same code builds on every supported target

That requirement changed the architecture early. A clean boundary between discovery, process inspection, configuration, and the terminal UI mattered because the same actions also needed to work as plain CLI subcommands. `portview list --json`, `portview open 3000`, and `portview kill 3000` are useful in scripts without ever launching the interface.

## The operating system is part of the problem

Finding a listening port is straightforward. Finding the process behind it, its working directory, how long it has been running, and whether it is actually healthy is where the project became interesting.

On macOS, portview uses `lsof` and `ps`. On Linux, it reads `/proc/net/tcp` and process metadata from `/proc`. Docker adds another layer because the process holding the host port may be a proxy, not the application the developer recognizes. Portview resolves published ports to their containers and stops the container instead of signaling the proxy process.

That last distinction is the kind of detail a tutorial project never reaches. A command can be technically valid and still be the wrong thing to do. Learning the platform meant learning which operation matched the user's intent.

The insight pane followed the same rule. It shows the owning working directory, uptime, CPU and memory, then runs a one-shot HTTP probe for status and latency. The probe happens only when requested, not during background polling. The tool stays lightweight, while the deeper information is there when I need it.

## Shipping taught the language

Go fit the product unusually well. The standard library covered most of the system work, concurrency made independent discovery tasks natural, and cross-compilation turned the single-binary goal into a normal build step instead of a packaging project of its own.

The useful lessons were not syntax. They were decisions:

- where an interface made platform-specific code clearer
- when returning a wrapped error gave the caller enough context
- how to keep background work cancellable
- how to separate terminal state from discovery state
- how to make destructive actions explicit and confirmable

Setting up the Homebrew tap and release workflow taught me as much as the application code. Checksums, versioned archives, platform naming, installation docs, and failure exits are all part of the product. Users experience the release system before they experience the code.

## Learning when the machine can write the code

There is a trap here in 2026. I could have asked an agent to write the whole thing and had a working tool in an afternoon, and learned almost nothing. So I drew a line. On a project meant for learning, the AI guides and explains, but I write the code. I let it point me at idioms and catch my mistakes, then I sit with why the fix works before moving on.

That is the deal I have made with myself: use the tools for speed when speed is the point, and deliberately slow down when understanding is the point. portview was a slow-down-on-purpose project, and it stuck.

## What shipped

The result is small, but it is complete. It has a TUI, scriptable commands, configuration, platform-specific process discovery, Docker awareness, CI, releases, and an installation path:

```sh
brew install jeramiahgcoffey/tap/portview
```

That completeness is the part I am proud of. The project is useful, but the larger outcome is that Go no longer feels like a language I have read about. I have had to make promises to users with it.

If I could give past me one instruction, it would be this: pick something small enough to finish and real enough to ship. The finishing is the curriculum.

[View portview on GitHub](https://github.com/jeramiahgcoffey/portview).
