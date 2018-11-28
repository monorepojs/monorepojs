---
id: roadmap
title: Roadmap
---

This document outlines the past and the future of the production and development of this Monorepo Boilerplate project.

---
**Legend**

<table>
  <tbody>
    <tr>
      <th>Icon</th>
      <th>Status</th>
    </tr>
    <tr>
      <td>🔄</td>
      <td>
        in queue
      </td>
    </tr>
    <tr>
      <td>💻</td>
      <td>
        in development
      </td>
    </tr>
    <tr>
      <td>✅</td>
      <td>
        development complete
      </td>
    </tr>
  </tbody>
</table>

---


- Each source should be self-contianed apps/packages/services and should be independent and responsible for their own build, test, and development
- Only sources that have actually been updated should be built, tested, and deployed during CI/CD
- The developer experience for each type of source should be optimal and have a very short feedback loop
- An emphasis should be placed on code deduplication and consistency–for example, all React web apps should be built on top of a common core for apps that use the React framework; only app-specific code should exist within the app directory itself
- Tooling should be a priority and should allow common tasks to be performed conveniently and efficiently–tasks like: starting a local dev server to serve any app, generating app/component/service/package boilerplate code, and isolated component development
- In general, apps/services/packages should be vendor & framework-agnostic–the core monorepo should avoid making assumptions about frameworks used by apps/services and/or providers they will be deployed to
- Each package build must output an ES module that can be used out-of-the-box by any other source–a source should not be required to run it through a transpiler like babel first
- Code coverage should be accurately reported by each source and aggregated by the core monorepo for a complete test coverage picture
- A variety of test types should be supported out-of-the-box, with examples, via tooling in the core monorepo
- Code style and linting rules should be consistent across all sources and configured in the core monorepo
- Documentation should be comprehensive and provide answers to all of the most frequently asked questions
- Sources should be able to leverage JSDoc-style comments to generate a static documentation site
- CI/CD should be managed by the core monorepo, but each source is responsible for defining it’s own build, test, and deployment scripts
