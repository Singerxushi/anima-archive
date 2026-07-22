import { useEffect, useMemo, useState } from 'react';
import {
  Clock3,
  ExternalLink,
  Maximize2,
  Plus,
  RefreshCw,
  Rss,
  Search,
} from 'lucide-react';

const RESEARCH_FEED_CATEGORY = 'RESEARCH FEED / 研究动态';

const ARCHIVE_CATEGORIES = [
  '全部',
  '原型理论 / ARCHETYPES',
  '炼金术隐喻 / ALCHEMY',
  '符号与象征 / SYMBOLS',
  '梦境解析 / ONEIRO',
  RESEARCH_FEED_CATEGORY,
];

function normalize(value) {
  return String(value ?? '').toLowerCase();
}

function matchesSearch(item, searchTerm) {
  const query = normalize(searchTerm).trim();
  if (!query) return true;

  const searchableText = [
    item.title,
    item.subtitle,
    item.summary,
    item.content,
    item.author,
    item.source,
    item.sourceCategory,
    ...(Array.isArray(item.tags) ? item.tags : []),
  ]
    .map(normalize)
    .join(' ');

  return searchableText.includes(query);
}

function formatUpdateTime(value) {
  if (!value) return '尚未生成';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
}

function CategoryLabel({ category }) {
  if (category === RESEARCH_FEED_CATEGORY) {
    return <span>RESEARCH FEED / 研究动态</span>;
  }

  return <span>{category.split(' / ')[0]}</span>;
}

function ReadingView({ readingDoc, setReadingDoc }) {
  const tags = Array.isArray(readingDoc.tags) ? readingDoc.tags : [];
  const isResearchFeed = readingDoc.category === RESEARCH_FEED_CATEGORY;

  return (
    <div className="border border-[#22201d] p-6 sm:p-8 space-y-6 bg-[#0f0f0e] relative">
      <button
        type="button"
        onClick={() => setReadingDoc(null)}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 font-mono text-[10px] text-[#837f75] hover:text-[#c5a880] border border-[#22201d] px-2.5 py-1"
      >
        [ BACK TO INDEX ]
      </button>

      <div className="space-y-2 pb-6 pr-24 border-b border-[#22201d]">
        <span className="font-mono text-xs text-[#c5a880] tracking-widest uppercase">
          {readingDoc.category}
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif text-[#f4f1eb] font-normal tracking-tight">
          {readingDoc.title}
        </h2>
        <p className="font-mono text-[10px] tracking-wider text-[#837f75]">
          {readingDoc.subtitle}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] font-mono text-[#837f75] bg-[#0d0d0c] p-3 border border-[#22201d]/40">
        <span>ARCHIVE REFN: {String(readingDoc.id ?? 'unknown').toUpperCase()}</span>
        <span>RECORDED BY: {String(readingDoc.author ?? 'Unknown').toUpperCase()}</span>
        <span>DATE: {readingDoc.date ?? 'UNKNOWN'}</span>
      </div>

      {isResearchFeed && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-[10px] text-[#a29d93]">
          <div className="border border-[#22201d] bg-[#0d0d0c] p-3">
            <span className="text-[#837f75]">SOURCE / 来源</span>
            <div className="mt-1 text-[#e8e4dc]">{readingDoc.source ?? 'Unknown source'}</div>
          </div>
          <div className="border border-[#22201d] bg-[#0d0d0c] p-3">
            <span className="text-[#837f75]">CHANNEL / 订阅模块</span>
            <div className="mt-1 text-[#e8e4dc]">{readingDoc.sourceCategory ?? 'Research feed'}</div>
          </div>
        </div>
      )}

      <div className="text-sm text-[#e8e4dc] leading-relaxed space-y-6 font-serif whitespace-pre-line">
        {readingDoc.content || readingDoc.summary}
      </div>

      {isResearchFeed && readingDoc.url && (
        <div className="flex flex-wrap gap-3">
          <a
            href={readingDoc.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 border border-[#c5a880] text-[#c5a880] hover:bg-[#c5a880] hover:text-[#0d0d0c] px-4 py-2 font-mono text-[10px] tracking-widest transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            OPEN PAPER / 论文原页
          </a>

          {readingDoc.pdfUrl && (
            <a
              href={readingDoc.pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 border border-[#423f39] text-[#a29d93] hover:border-[#c5a880] hover:text-[#c5a880] px-4 py-2 font-mono text-[10px] tracking-widest transition-all"
            >
              PDF
            </a>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-2 pt-6 border-t border-[#22201d]">
        {tags.map((tag) => (
          <span
            key={`${readingDoc.id}-${tag}`}
            className="font-mono text-[10px] text-[#a29d93] bg-[#121211] border border-[#22201d] px-2.5 py-1"
          >
            #{tag}
          </span>
        ))}
      </div>

      {isResearchFeed && (
        <p className="font-mono text-[9px] leading-relaxed text-[#6f6b63] border-t border-[#22201d] pt-4">
          PREPRINT NOTICE：研究动态中的内容为外部预印本元数据，通常尚未经过同行评审。请以论文原页和后续正式出版版本为准。
        </p>
      )}
    </div>
  );
}

function ArchiveCard({ item, onOpen }) {
  const tags = Array.isArray(item.tags) ? item.tags : [];
  const isResearchFeed = item.category === RESEARCH_FEED_CATEGORY;

  return (
    <article
      onClick={() => onOpen(item)}
      className="border border-[#22201d] hover:border-[#c5a880]/50 p-6 space-y-4 hover:bg-[#121211]/30 transition-all cursor-pointer group"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
        <span className="text-[#c5a880] tracking-wider uppercase">
          {isResearchFeed ? item.sourceCategory : item.category}
        </span>
        <span className="text-[#837f75]">{item.date}</span>
      </div>

      <div className="space-y-1">
        <h4 className="text-lg font-serif text-[#f4f1eb] font-medium group-hover:text-[#c5a880] transition-colors flex items-start justify-between gap-4">
          <span>{item.title}</span>
          <Maximize2 className="w-3.5 h-3.5 mt-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-[#837f75]" />
        </h4>
        <p className="font-mono text-[9px] tracking-widest text-[#837f75]">
          {item.subtitle}
        </p>
      </div>

      <p className="text-xs text-[#a29d93] leading-relaxed font-sans line-clamp-3">
        {item.summary}
      </p>

      {isResearchFeed && (
        <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[9px] text-[#837f75]">
          <span>SOURCE: {item.source}</span>
          <span>AUTHORS: {item.author}</span>
        </div>
      )}

      <div className="flex flex-wrap gap-1.5 pt-2">
        {tags.map((tag) => (
          <span
            key={`${item.id}-${tag}`}
            className="font-mono text-[9px] text-[#837f75] border border-[#22201d] px-2 py-0.5"
          >
            #{tag}
          </span>
        ))}
      </div>
    </article>
  );
}

function ArchivePushPanel({
  newArchive,
  setNewArchive,
  handlePublishArchive,
  githubConfig,
}) {
  return (
    <div className="border border-[#22201d] p-6 bg-[#0f0f0e] space-y-4">
      <div className="border-b border-[#22201d] pb-3">
        <h3 className="text-xs font-mono font-bold tracking-widest text-[#c5a880] uppercase flex items-center space-x-2">
          <Plus className="w-3.5 h-3.5" />
          <span>ARCHIVE PUSH / 档案提报</span>
        </h3>
      </div>

      <form onSubmit={handlePublishArchive} className="space-y-4 font-mono text-xs">
        <div>
          <label className="block text-[#a29d93] mb-1">文章标题 / TITLE</label>
          <input
            type="text"
            required
            placeholder="主意象标题"
            value={newArchive.title}
            onChange={(event) => setNewArchive({ ...newArchive, title: event.target.value })}
            className="w-full bg-[#0d0d0c] border border-[#22201d] text-[#e8e4dc] px-3 py-2 rounded-none focus:outline-none focus:border-[#c5a880]"
          />
        </div>

        <div>
          <label className="block text-[#a29d93] mb-1">英文副标题 / SUBTITLE</label>
          <input
            type="text"
            placeholder="LATIN OR ENGLISH SUBTITLE"
            value={newArchive.subtitle}
            onChange={(event) => setNewArchive({ ...newArchive, subtitle: event.target.value })}
            className="w-full bg-[#0d0d0c] border border-[#22201d] text-[#e8e4dc] px-3 py-2 rounded-none focus:outline-none focus:border-[#c5a880] uppercase placeholder:lowercase"
          />
        </div>

        <div>
          <label className="block text-[#a29d93] mb-1">分类域 / CATEGORY</label>
          <select
            value={newArchive.category}
            onChange={(event) => setNewArchive({ ...newArchive, category: event.target.value })}
            className="w-full bg-[#0d0d0c] border border-[#22201d] text-[#e8e4dc] px-2 py-2 rounded-none focus:outline-none focus:border-[#c5a880]"
          >
            <option value="原型理论 / ARCHETYPES">原型理论 / ARCHETYPES</option>
            <option value="炼金术隐喻 / ALCHEMY">炼金术隐喻 / ALCHEMY</option>
            <option value="符号与象征 / SYMBOLS">符号与象征 / SYMBOLS</option>
            <option value="梦境解析 / ONEIRO">梦境解析 / ONEIRO</option>
          </select>
        </div>

        <div>
          <label className="block text-[#a29d93] mb-1">标签 / TAGS (半角逗号分隔)</label>
          <input
            type="text"
            placeholder="自性化, 荣格, 赫耳墨斯"
            value={newArchive.tags}
            onChange={(event) => setNewArchive({ ...newArchive, tags: event.target.value })}
            className="w-full bg-[#0d0d0c] border border-[#22201d] text-[#e8e4dc] px-3 py-2 rounded-none focus:outline-none focus:border-[#c5a880]"
          />
        </div>

        <div>
          <label className="block text-[#a29d93] mb-1">摘要提要 / SUMMARY</label>
          <textarea
            rows={2}
            placeholder="精炼阐述主旨大意..."
            value={newArchive.summary}
            onChange={(event) => setNewArchive({ ...newArchive, summary: event.target.value })}
            className="w-full bg-[#0d0d0c] border border-[#22201d] text-[#e8e4dc] p-2.5 rounded-none focus:outline-none focus:border-[#c5a880] resize-none"
          />
        </div>

        <div>
          <label className="block text-[#a29d93] mb-1">详实论述内容 / CONTENT (MARKDOWN SUPPORT)</label>
          <textarea
            required
            rows={5}
            placeholder="在此展开文献核心论据内容..."
            value={newArchive.content}
            onChange={(event) => setNewArchive({ ...newArchive, content: event.target.value })}
            className="w-full bg-[#0d0d0c] border border-[#22201d] text-[#e8e4dc] p-2.5 rounded-none focus:outline-none focus:border-[#c5a880]"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-transparent border border-[#c5a880] hover:bg-[#c5a880] hover:text-[#0d0d0c] text-[#c5a880] py-2.5 transition-all font-semibold tracking-widest uppercase"
        >
          {githubConfig.token ? 'SYNC TO GITHUB REPO' : 'PUBLISH TO LOCAL SANDBOX'}
        </button>
      </form>

      {!githubConfig.token && (
        <p className="text-[10px] text-[#837f75] mt-3 leading-relaxed text-center">
          当前保存于浏览器本地数据库中。若要实现协同展示，请去设置项绑定远程 GitHub 账户及专属 Token。
        </p>
      )}
    </div>
  );
}

function ResearchFeedPanel({ feed, loading, error, onRefresh }) {
  return (
    <div className="border border-[#22201d] p-6 bg-[#0f0f0e] space-y-5">
      <div className="border-b border-[#22201d] pb-3">
        <h3 className="text-xs font-mono font-bold tracking-widest text-[#c5a880] uppercase flex items-center gap-2">
          <Rss className="w-3.5 h-3.5" />
          <span>SUBSCRIPTION STATUS / 订阅状态</span>
        </h3>
      </div>

      <div className="space-y-2 font-mono text-[10px] text-[#a29d93]">
        <div className="flex items-start gap-2">
          <Clock3 className="w-3.5 h-3.5 mt-0.5 text-[#837f75]" />
          <div>
            <div className="text-[#837f75]">LAST GENERATED / 最近生成</div>
            <div className="mt-1 text-[#e8e4dc]">{formatUpdateTime(feed.updatedAt)}（UTC+8）</div>
          </div>
        </div>
        <div className="border border-[#22201d] bg-[#0d0d0c] p-3 leading-relaxed">
          每日北京时间 08:00 由 GitHub Actions 抓取并重新部署。GitHub 的定时任务可能有数分钟排队延迟。
        </div>
      </div>

      <div className="space-y-2">
        {(feed.sources ?? []).map((source) => (
          <div
            key={source.id}
            className="flex items-center justify-between gap-3 border border-[#22201d] px-3 py-2 font-mono text-[10px]"
          >
            <span className="text-[#a29d93]">{source.label}</span>
            <span className={source.ok === false ? 'text-[#b77b70]' : 'text-[#758a72]'}>
              {source.ok === false ? 'FALLBACK' : `${source.count ?? 0} ITEMS`}
            </span>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onRefresh}
        disabled={loading}
        className="w-full inline-flex items-center justify-center gap-2 border border-[#423f39] text-[#a29d93] hover:border-[#c5a880] hover:text-[#c5a880] disabled:opacity-50 px-3 py-2 font-mono text-[10px] tracking-widest transition-all"
      >
        <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        RELOAD PUBLISHED FEED
      </button>

      {error && (
        <p className="border border-[#6b3d38] bg-[#2a1715] p-3 font-mono text-[10px] leading-relaxed text-[#d29a91]">
          {error}
        </p>
      )}

      <div className="space-y-2 border-t border-[#22201d] pt-4 font-mono text-[10px] leading-relaxed text-[#837f75]">
        <p>ARXIV：quant-ph、q-bio.NC。</p>
        <p>PSYARXIV：按精神分析与分析心理学关键词筛选最新预印本元数据。</p>
      </div>
    </div>
  );
}

export default function Archives({
  archiveList,
  archiveFilter,
  setArchiveFilter,
  searchTerm,
  setSearchTerm,
  readingDoc,
  setReadingDoc,
  newArchive,
  setNewArchive,
  handlePublishArchive,
  githubConfig,
}) {
  const [researchFeed, setResearchFeed] = useState({
    updatedAt: null,
    timezone: 'Asia/Shanghai',
    sources: [],
    items: [],
  });
  const [feedLoading, setFeedLoading] = useState(false);
  const [feedError, setFeedError] = useState('');

  const loadResearchFeed = async () => {
    setFeedLoading(true);
    setFeedError('');

    try {
      const url = `${import.meta.env.BASE_URL}data/research-feed.json?v=${Date.now()}`;
      const response = await fetch(url, { cache: 'no-store' });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      setResearchFeed({
        updatedAt: data.updatedAt ?? null,
        timezone: data.timezone ?? 'Asia/Shanghai',
        sources: Array.isArray(data.sources) ? data.sources : [],
        items: Array.isArray(data.items) ? data.items : [],
      });
    } catch (error) {
      setFeedError(`研究动态数据读取失败：${error.message}`);
    } finally {
      setFeedLoading(false);
    }
  };

  useEffect(() => {
    loadResearchFeed();
  }, []);

  const isResearchFeed = archiveFilter === RESEARCH_FEED_CATEGORY;

  const visibleItems = useMemo(() => {
    const sourceItems = isResearchFeed ? researchFeed.items : archiveList;

    return sourceItems.filter((item) => {
      const categoryMatches =
        isResearchFeed || archiveFilter === '全部' || item.category === archiveFilter;
      return categoryMatches && matchesSearch(item, searchTerm);
    });
  }, [archiveFilter, archiveList, isResearchFeed, researchFeed.items, searchTerm]);

  const chooseCategory = (category) => {
    setArchiveFilter(category);
    setReadingDoc(null);
    setSearchTerm('');
  };

  return (
    <div className="space-y-8">
      <div className="border border-[#22201d] p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-4 space-y-1">
          <h3 className="text-lg font-serif text-[#f4f1eb]">
            {isResearchFeed ? '研究动态检索' : '馆藏档案检索'}
          </h3>
          <p className="text-xs text-[#a29d93] font-mono">
            {isResearchFeed ? 'RETRIEVING EXTERNAL PREPRINT SIGNALS' : 'RETRIEVING SUBSTANTIAL ARCHIVES'}
          </p>
        </div>

        <div className="md:col-span-4 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#837f75]" />
          <input
            type="text"
            placeholder={isResearchFeed ? '检索标题、作者、摘要、来源...' : '输入原型、象征、关键词...'}
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full bg-[#121211] border border-[#22201d] text-[#e8e4dc] pl-9 pr-4 py-2.5 rounded-none text-xs focus:outline-none focus:border-[#c5a880] transition-all font-mono"
          />
        </div>

        <div className="md:col-span-4 flex flex-wrap gap-2 justify-start md:justify-end">
          {ARCHIVE_CATEGORIES.map((category) => (
            <button
              type="button"
              key={category}
              onClick={() => chooseCategory(category)}
              className={`px-3 py-1 border text-[10px] font-mono tracking-wider transition-all ${
                archiveFilter === category
                  ? 'border-[#c5a880] text-[#c5a880] bg-[#1a1917]'
                  : 'border-[#22201d] text-[#837f75] hover:text-[#e8e4dc] hover:border-[#423f39]'
              }`}
            >
              <CategoryLabel category={category} />
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          {readingDoc ? (
            <ReadingView readingDoc={readingDoc} setReadingDoc={setReadingDoc} />
          ) : (
            <div className="space-y-4">
              {isResearchFeed && feedLoading && visibleItems.length === 0 && (
                <div className="text-center py-12 border border-dashed border-[#22201d] text-[#837f75] font-mono text-xs">
                  [ SYNCHRONIZING RESEARCH SIGNALS... ]
                </div>
              )}

              {visibleItems.map((item) => (
                <ArchiveCard key={item.id} item={item} onOpen={setReadingDoc} />
              ))}

              {!feedLoading && visibleItems.length === 0 && (
                <div className="text-center py-12 border border-dashed border-[#22201d] text-[#837f75] font-mono text-xs">
                  [ ERROR: NO RESONANCE RECORD FOUND IN THIS FOLDER ]
                </div>
              )}
            </div>
          )}
        </div>

        <div className="lg:col-span-4 space-y-4">
          {isResearchFeed ? (
            <ResearchFeedPanel
              feed={researchFeed}
              loading={feedLoading}
              error={feedError}
              onRefresh={loadResearchFeed}
            />
          ) : (
            <ArchivePushPanel
              newArchive={newArchive}
              setNewArchive={setNewArchive}
              handlePublishArchive={handlePublishArchive}
              githubConfig={githubConfig}
            />
          )}
        </div>
      </div>
    </div>
  );
}

