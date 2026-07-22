const files = import.meta.glob("../content/archives/**/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

function removeQuotes(value) {
  const text = String(value).trim();

  const hasDoubleQuotes =
    text.startsWith('"') && text.endsWith('"');

  const hasSingleQuotes =
    text.startsWith("'") && text.endsWith("'");

  if (hasDoubleQuotes || hasSingleQuotes) {
    return text.slice(1, -1);
  }

  return text;
}

function parseFrontMatter(raw) {
  const source = String(raw).replace(/\r\n/g, "\n");

  const match = source.match(
    /^---\n([\s\S]*?)\n---(?:\n|$)([\s\S]*)$/,
  );

  if (!match) {
    return {
      data: {},
      content: source,
    };
  }

  const frontMatter = match[1];
  const content = match[2];
  const data = {};

  let currentKey = null;

  for (const line of frontMatter.split("\n")) {
    const listItem = line.match(/^\s*-\s+(.*)$/);

    if (listItem && currentKey) {
      if (!Array.isArray(data[currentKey])) {
        data[currentKey] = [];
      }

      data[currentKey].push(removeQuotes(listItem[1]));
      continue;
    }

    const field = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);

    if (!field) {
      continue;
    }

    const [, key, value] = field;

    currentKey = key;
    data[key] = value.trim() ? removeQuotes(value) : "";
  }

  return {
    data,
    content,
  };
}

function getSlugFromPath(path) {
  return path
    .split("/")
    .pop()
    .replace(/\.md$/, "");
}

function normalizeTags(tags) {
  if (Array.isArray(tags)) {
    return tags;
  }

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
      const { data, content } = parseFrontMatter(raw);
      const slug = getSlugFromPath(path);

      const plainSummary = content
        .replace(/[#>*_\-[\]()`]/g, "")
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
    .sort((a, b) =>
      String(b.date).localeCompare(String(a.date)),
    );
}
