# Security Policy

## Supported versions

| Version | Supported |
| ------- | --------- |
| 2.x     | ✅        |
| < 2.0   | ❌        |

## Reporting a vulnerability

Please report security issues privately rather than opening a public issue, using the [private security advisory](https://github.com/abbott567/accessible-marp-decks/security/advisories/new) for this repo, on GitHub.

You can expect an acknowledgement within a few days. Once a fix is available, a patched release will be published and the reporter credited (unless you prefer to remain anonymous).

## Scope notes

This tool renders Marp markdown you control into HTML. Treat deck sources like any other input: if you render untrusted markdown, review the output before publishing it, since Marp permits raw HTML in slides by design.
