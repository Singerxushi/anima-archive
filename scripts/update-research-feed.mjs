import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const OUTPUT_PATH = path.resolve('public/data/research-feed.json');
const FEED_CATEGORY = 'RESEARCH FEED / 研究动态';
const MAX_ITEMS_PER_SOURCE = 40;
const MAX_TOTAL_ITEMS = 120;

const SOURCE_DEFINITIONS = [
  {
    id: 'arxiv-quant-ph',
    label: 'arXiv · quant-ph',
    type: 'rss',
    url: 'https://rss.arxiv.org/rss/quant-ph',
  },
  {
    id: 'arxiv-q-bio-nc',
    label: 'arXiv · q-bio.NC',
    type: 'rss',
    url: 'https://rss.arxiv.org/rss/q-bio.NC',
  },
  {
    id: 'psyarxiv-psychoanalysis',
    label: 'PsyArXiv · 精神分析',
    type: 'crossref',
    url: 'https://api.crossref.org/works',
  },
  {
    id: 'psyarxiv-analytical-psychology',
    label: 'PsyArXiv · 分析心理学',
    type: 'crossref',
    url: 'https://api.crossref.org/works',
  },
];

const PSYARXIV_QUERIES = [
  {
    id: 'psyarxiv-psychoanalysis',
    label: 'PsyArXiv · 精神分析',
    query: 'psychoanalysis psychoanalytic psychodynamic transference unconscious',
    keywords: [
      'psychoanaly',
      'psychodynamic',
      'transference',
      'countertransference',
      'object relation',
      'freud',
      'lacan',
      'unconscious',
    ],
    tags: ['PsyArXiv', '精神分析', 'psychoanalysis'],
  },
  {
    id: 'psyarxiv-analytical-psychology',
    label: 'PsyArXiv · 分析心理学',
    query: 'analytical psychology Jung Jungian archetype individuation collective unconscious',
    keywords: [
      'analytical psychology',
      'jungian',
      'carl jung',
      'archetyp',
      'individuation',
      'collective unconscious',
      'anima and animus',
    ],
    tags: ['PsyArXiv', '分析心理学', 'Jungian'],
  },
];

function decodeXml(value = '') {
  return String(value)
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number.parseInt(code, 10)))
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

function stripHtml(value = '') {
  return decodeXml(value)
    .replace(/<\/?(?:jats:)?[a-z][^>]*>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function readTag(block, tagName) {
  const escaped = tagName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = block.match(new RegExp(`<${escaped}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${escaped}>`, 'i'));
  return match ? decodeXml(match[1]).trim() : '';
}

function splitSubjects(value = '') {
  return value
    .split(/[;,|]/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 6);
}

function toDisplayDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value || 'UNKNOWN');

  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);

  const map = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${map.year}.${map.month}.${map.day}`;
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function normalizeArxivItem(block, sourceId, sourceLabel) {
  const title = stripHtml(readTag(block, 'title'));
  const url = stripHtml(readTag(block, 'link'));
  const description = stripHtml(readTag(block, 'description'));
  const creator = stripHtml(readTag(block, 'dc:creator')) || 'Unknown authors';
  const publishedAt = readTag(block, 'dc:date') || new Date().toISOString();
  const subject = stripHtml(readTag(block, 'dc:subject'));
  const arxivId = url.match(/arxiv\.org\/(?:abs|pdf)\/([^?#]+)/i)?.[1]?.replace(/\.pdf$/i, '') || url;

  if (!title || !url) return null;

  return {
    id: `arxiv:${arxivId}`,
    title,
    subtitle: `${sourceLabel.toUpperCase()} · PREPRINT SIGNAL`,
    category: FEED_CATEGORY,
    source: 'arXiv',
    sourceId,
    sourceCategory: sourceLabel,
    author: creator,
    date: toDisplayDate(publishedAt),
    publishedAt: new Date(publishedAt).toISOString(),
    summary: description || '该条目暂无可用摘要，请打开论文原页查看。',
    content: description || '该条目暂无可用摘要，请打开论文原页查看。',
    tags: unique(['arXiv', sourceId.replace('arxiv-', ''), ...splitSubjects(subject)]),
    url,
    pdfUrl: url.includes('/abs/') ? url.replace('/abs/', '/pdf/') : '',
  };
}

async function fetchWithRetry(url, options = {}, attempts = 3) {
  let lastError;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'User-Agent': 'AnimaArchiveResearchFeed/1.0 (https://github.com/Singerxushi/anima-archive)',
          Accept: '*/*',
          ...(options.headers ?? {}),
        },
        signal: AbortSignal.timeout(30_000),
      });

      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }

      return response;
    } catch (error) {
      lastError = error;
      if (attempt < attempts) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 1500));
      }
    }
  }

  throw lastError;
}

async function fetchArxivRss(source) {
  const response = await fetchWithRetry(source.url, {
    headers: { Accept: 'application/rss+xml, application/xml, text/xml' },
  });
  const xml = await response.text();
  const blocks = xml.match(/<item\b[\s\S]*?<\/item>/gi) ?? [];

  return blocks
    .map((block) => normalizeArxivItem(block, source.id, source.label))
    .filter(Boolean)
    .slice(0, MAX_ITEMS_PER_SOURCE);
}

function crossrefDate(item) {
  const isoDate = item.created?.['date-time'];
  if (isoDate) return isoDate;

  const parts = item.published?.['date-parts']?.[0] || item.issued?.['date-parts']?.[0];
  if (!parts?.length) return new Date().toISOString();

  const [year, month = 1, day = 1] = parts;
  return new Date(Date.UTC(year, month - 1, day)).toISOString();
}

function crossrefAuthors(item) {
  const authors = Array.isArray(item.author) ? item.author : [];
  const names = authors
    .map((author) => [author.given, author.family].filter(Boolean).join(' ').trim())
    .filter(Boolean);
  return names.length ? names.join(', ') : 'Unknown authors';
}

function normalizeCrossrefItem(item, config) {
  const doi = String(item.DOI ?? '').trim();
  const title = stripHtml(Array.isArray(item.title) ? item.title[0] : item.title);
  const abstract = stripHtml(item.abstract);
  const subjects = Array.isArray(item.subject) ? item.subject.map(stripHtml) : [];
  const searchable = `${title} ${abstract} ${subjects.join(' ')}`.toLowerCase();
  const keywordMatch = config.keywords.some((keyword) => searchable.includes(keyword.toLowerCase()));

  if (!doi || !title || !keywordMatch || /^withdrawn\b/i.test(title)) return null;

  const publishedAt = crossrefDate(item);
  const url = `https://doi.org/${doi}`;
  const pdfUrl = Array.isArray(item.link)
    ? item.link.find((link) => /pdf/i.test(link['content-type'] ?? ''))?.URL ?? ''
    : '';
  const summary = abstract || 'Crossref 元数据未提供摘要；请打开 PsyArXiv 论文原页查看全文摘要与版本信息。';

  return {
    id: `psyarxiv:${doi.toLowerCase()}`,
    title,
    subtitle: `${config.label.toUpperCase()} · PREPRINT SIGNAL`,
    category: FEED_CATEGORY,
    source: 'PsyArXiv',
    sourceId: config.id,
    sourceCategory: config.label,
    author: crossrefAuthors(item),
    date: toDisplayDate(publishedAt),
    publishedAt,
    summary,
    content: summary,
    tags: unique([...config.tags, ...subjects.slice(0, 4)]),
    url,
    pdfUrl,
    doi,
  };
}

async function fetchPsyArxiv(config) {
  const currentYear = new Date().getUTCFullYear();
  const fromDate = `${currentYear - 3}-01-01`;
  const params = new URLSearchParams({
    filter: `prefix:10.31234,from-created-date:${fromDate}`,
    'query.bibliographic': config.query,
    rows: '60',
    sort: 'created',
    order: 'desc',
    select: 'DOI,title,author,abstract,created,published,issued,URL,link,subject,publisher,type,container-title',
  });

  const response = await fetchWithRetry(`https://api.crossref.org/works?${params.toString()}`, {
    headers: { Accept: 'application/json' },
  });
  const payload = await response.json();
  const items = payload?.message?.items;

  if (!Array.isArray(items)) {
    throw new Error('Crossref response did not contain an items array');
  }

  return items
    .map((item) => normalizeCrossrefItem(item, config))
    .filter(Boolean)
    .slice(0, MAX_ITEMS_PER_SOURCE);
}

async function readPreviousFeed() {
  try {
    const content = await readFile(OUTPUT_PATH, 'utf8');
    const parsed = JSON.parse(content);
    return {
      updatedAt: parsed.updatedAt ?? null,
      timezone: parsed.timezone ?? 'Asia/Shanghai',
      sources: Array.isArray(parsed.sources) ? parsed.sources : [],
      items: Array.isArray(parsed.items) ? parsed.items : [],
    };
  } catch {
    return { updatedAt: null, timezone: 'Asia/Shanghai', sources: [], items: [] };
  }
}

function retainPreviousItems(previous, sourceId) {
  return previous.items.filter((item) => item.sourceId === sourceId);
}

function deduplicateAndSort(items) {
  const byId = new Map();
  for (const item of items) {
    if (item?.id && !byId.has(item.id)) byId.set(item.id, item);
  }

  return [...byId.values()]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, MAX_TOTAL_ITEMS);
}

async function main() {
  const previous = await readPreviousFeed();
  const results = [];

  for (const source of SOURCE_DEFINITIONS.filter((item) => item.type === 'rss')) {
    try {
      const items = await fetchArxivRss(source);
      results.push({ source, ok: true, items });
      console.log(`[research-feed] ${source.label}: ${items.length} items`);
    } catch (error) {
      const items = retainPreviousItems(previous, source.id);
      results.push({ source, ok: false, items, error: error.message });
      console.warn(`[research-feed] ${source.label} failed; retained ${items.length} previous items: ${error.message}`);
    }
  }

  for (const config of PSYARXIV_QUERIES) {
    const source = SOURCE_DEFINITIONS.find((item) => item.id === config.id);
    try {
      const items = await fetchPsyArxiv(config);
      results.push({ source, ok: true, items });
      console.log(`[research-feed] ${source.label}: ${items.length} items`);
    } catch (error) {
      const items = retainPreviousItems(previous, source.id);
      results.push({ source, ok: false, items, error: error.message });
      console.warn(`[research-feed] ${source.label} failed; retained ${items.length} previous items: ${error.message}`);
    }
  }

  const items = deduplicateAndSort(results.flatMap((result) => result.items));
  const payload = {
    updatedAt: new Date().toISOString(),
    timezone: 'Asia/Shanghai',
    schedule: 'Every day at 08:00 UTC+8 (GitHub Actions cron: 0 0 * * *)',
    sources: results.map(({ source, ok, items: sourceItems, error }) => ({
      id: source.id,
      label: source.label,
      type: source.type,
      url: source.url,
      ok,
      count: sourceItems.length,
      ...(error ? { error } : {}),
    })),
    items,
  };

  await mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  await writeFile(OUTPUT_PATH, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  console.log(`[research-feed] wrote ${items.length} total items to ${OUTPUT_PATH}`);
}

main().catch((error) => {
  console.error('[research-feed] fatal error:', error);
  process.exitCode = 1;
});
