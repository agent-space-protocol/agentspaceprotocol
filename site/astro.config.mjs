// The site of the Agent Space Protocol: Astro Starlight in the reading version of the archive design.
// Its sections follow modelcontextprotocol.io: documentation, the specification, extensions,
// proposals and the community, each with a sidebar of its own (starlight-sidebar-topics), and links
// to them in the header. The pages live in ../docs, in English and Chinese.
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightSidebarTopics from "starlight-sidebar-topics";

const chapters = ["concepts", "properties", "capabilities", "observations", "actions", "consistency", "record", "vocabulary", "compatibility", "doors", "messages", "transports", "conformance"];
const zh = (text) => ({ "zh-CN": text });
// Served at the root of agentspaceprotocol.org, or under /agentspaceprotocol/ on GitHub Pages until the
// domain is bound (the deploy workflow sets both).
const site = process.env.ASTRO_SITE ?? "https://agentspaceprotocol.org";
const base = process.env.ASTRO_BASE ?? "/";
const home = `${base.replace(/\/$/, "")}/en/`;

export default defineConfig({
  site,
  base,
  redirects: { "/": home },
  integrations: [
    starlight({
      title: "Agent Space Protocol",
      description: "One open protocol for every place an agent is in.",
      defaultLocale: "en",
      locales: {
        en: { label: "English", lang: "en" },
        zh: { label: "简体中文", lang: "zh-CN" },
      },
      social: [{ icon: "github", label: "GitHub", href: "https://github.com/agent-space-protocol" }],
      customCss: [
        "@fontsource/inter/400.css",
        "@fontsource/inter/600.css",
        "@fontsource/space-grotesk/400.css",
        "@fontsource/space-grotesk/500.css",
        "@fontsource/jetbrains-mono/400.css",
        "./src/styles/archive-reading.css",
        "./src/styles/site.css",
      ],
      components: { SocialIcons: "./src/components/HeaderLinks.astro" },
      lastUpdated: false,
      pagination: true,
      plugins: [
        starlightSidebarTopics(
          [
            {
              id: "docs",
              label: { en: "Documentation", ...zh("文档") },
              link: "/docs/intro/",
              icon: "open-book",
              items: [
                { label: "Get started", translations: zh("入门"), items: [{ slug: "docs/intro" }, { slug: "docs/asp-and-mcp" }, { slug: "docs/quickstart" }] },
                { label: "Learn", translations: zh("理解"), items: ["architecture", "spaces", "participants", "versioning"].map((p) => ({ slug: `docs/learn/${p}` })) },
                { label: "Develop", translations: zh("开发"), items: ["connect", "participant", "space", "views", "sdks"].map((p) => ({ slug: `docs/develop/${p}` })) },
                { label: "Tools", translations: zh("工具"), items: [{ slug: "docs/tools/inspector" }, { slug: "docs/tools/debugging" }] },
                { slug: "docs/examples" },
              ],
            },
            {
              id: "specification",
              label: { en: "Specification", ...zh("规范") },
              link: "/specification/draft/",
              icon: "document",
              items: [
                { slug: "specification/draft" },
                { label: "Chapters", translations: zh("各章"), items: chapters.map((c) => ({ slug: `specification/draft/${c}` })) },
                { label: "Schema reference", translations: zh("Schema 参考"), slug: "specification/draft/reference/schema" },
                { slug: "specification/changelog" },
              ],
            },
            {
              id: "extensions",
              label: { en: "Extensions", ...zh("扩展") },
              link: "/extensions/",
              icon: "puzzle",
              items: [{ slug: "extensions" }, { slug: "extensions/views" }],
            },
            {
              id: "proposals",
              label: { en: "Proposals", ...zh("提案") },
              link: "/proposals/",
              icon: "pencil",
              items: [{ slug: "proposals" }],
            },
            {
              id: "community",
              label: { en: "Community", ...zh("社区") },
              link: "/community/contributing/",
              icon: "heart",
              items: ["contributing", "governance", "roadmap", "code-of-conduct"].map((p) => ({ slug: `community/${p}` })),
            },
          ],
          { exclude: ["/", "/en/", "/zh/"] },
        ),
      ],
    }),
  ],
});
