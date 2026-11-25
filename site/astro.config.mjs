// The documentation site of the Agent Space Protocol: Astro Starlight in the reading version of the
// archive design. Built locally for now.
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

const chapters = ["concepts", "properties", "capabilities", "observations", "actions", "consistency", "record", "vocabulary", "compatibility", "doors", "messages", "transports", "conformance"];

export default defineConfig({
  site: "https://agentspaceprotocol.org",
  integrations: [
    starlight({
      title: "Agent Space Protocol",
      description: "One open protocol between participants and any space they are in.",
      defaultLocale: "en",
      locales: {
        en: { label: "English", lang: "en" },
        zh: { label: "简体中文", lang: "zh-CN" },
      },
      social: [{ icon: "github", label: "GitHub", href: "https://github.com/agent-space-protocol/agentspaceprotocol" }],
      customCss: [
        "@fontsource/inter/400.css",
        "@fontsource/inter/600.css",
        "@fontsource/space-grotesk/400.css",
        "@fontsource/space-grotesk/500.css",
        "@fontsource/jetbrains-mono/400.css",
        "./src/styles/archive-reading.css",
      ],
      sidebar: [
        { label: "Overview", translations: { "zh-CN": "概览" }, slug: "index" },
        {
          label: "Specification",
          translations: { "zh-CN": "规范" },
          items: chapters.map((slug) => ({ slug })),
        },
        { label: "Schema reference", translations: { "zh-CN": "Schema 参考" }, slug: "reference/schema" },
      ],
      lastUpdated: false,
      pagination: true,
    }),
  ],
});
