import matter from "gray-matter";

const files = import.meta.glob("../content/archives/**/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

function getSlugFromPath(path) {
  return path
    .split("/")
    .pop()
    .replace(/\.md$/, "");
}

function normalizeTags(tags) {
  if (Array.isArray(tags)) return tags;
  if (typeof tags === "string") {
    return tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }
  return [];
}

export function loadArchives() {
  return Object.entries(files)
    .map(([path, raw]) => {
      const { data, content } = matter(raw);
      const slug = getSlugFromPath(path);

      const plainSummary = content
        .replace(/[#>*_\-\[\]()`]/g, "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 120);

      return {
        id: data.id || slug,
        slug,
        title: data.title || "未命名档案",
        subtitle: data.subtitle || "UNTITLED ARCHIVE",
        category: data.category || "未分类 / UNCATEGORIZED",
        tags: normalizeTags(data.tags),
        summary: data.summary || plainSummary || "暂无摘要。",
        author: data.author || "Anima Archive",
        date: data.date || "未记录",
        content: content || "",
        file: path,
      };
    })
    .sort((a, b) => String(b.date).localeCompare(String(a.date)));
}
