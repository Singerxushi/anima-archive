import {
  ExternalLink,
  Github,
  Heart,
  MessageSquare,
  RefreshCw,
  Send,
  Sparkles,
} from 'lucide-react';

function formatSyncTime(value) {
  if (!value) return '尚未同步';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

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

function SyncBadge({ forumSyncMeta }) {
  const status = forumSyncMeta?.status || 'idle';

  const statusMap = {
    idle: {
      label: 'IDLE',
      className: 'border-[#2a2824] text-[#837f75]',
    },
    syncing: {
      label: 'SYNCING',
      className: 'border-[#5e4634] text-[#d8c2a1]',
    },
    ready: {
      label: 'GITHUB MIRROR READY',
      className: 'border-[#4a5a42] text-[#9bc08d]',
    },
    error: {
      label: 'SYNC ERROR',
      className: 'border-[#6b3d38] text-[#d29a91]',
    },
  };

  const current = statusMap[status] || statusMap.idle;

  return (
    <span
      className={`inline-flex items-center gap-2 border px-3 py-1 text-[10px] font-mono tracking-[0.2em] uppercase ${current.className}`}
    >
      {status === 'syncing' ? (
        <RefreshCw className="w-3 h-3 animate-spin" />
      ) : null}
      {current.label}
    </span>
  );
}

function DiscussionCard({
  disc,
  newReply,
  setNewReply,
  handleAddReply,
  handleLike,
}) {
  const replies = Array.isArray(disc.replies) ? disc.replies : [];
  const isGithubMirror = disc.source === 'github';

  return (
    <article className="border border-[#22201d] hover:border-[#c5a880]/40 p-5 sm:p-6 bg-[#0f0f0e] space-y-4 transition-all">
      <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono tracking-wider text-[#837f75]">
        <span>{disc.author || 'Unknown'}</span>
        <span>•</span>
        <span>{disc.category || 'General'}</span>
        <span>•</span>
        <span>{disc.date || 'UNKNOWN'}</span>
        <span
          className={`border px-2 py-0.5 ${
            isGithubMirror
              ? 'border-[#3c3a35] text-[#a29d93]'
              : 'border-[#5e4634] text-[#d8c2a1]'
          }`}
        >
          {isGithubMirror ? `GITHUB #${disc.number ?? '-'}` : 'LOCAL DRAFT'}
        </span>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg sm:text-xl font-serif text-[#f4f1eb]">
          {disc.title}
        </h3>

        {disc.content ? (
          <p className="text-sm leading-7 text-[#c9c5bc] whitespace-pre-line">
            {disc.content}
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#a29d93]">
        <button
          type="button"
          onClick={() => handleLike(disc.id)}
          className="inline-flex items-center gap-1.5 hover:text-[#c5a880] transition-colors"
        >
          <Heart className="w-4 h-4" />
          <span>{disc.likes || 0} 共识</span>
        </button>

        <div className="inline-flex items-center gap-1.5">
          <MessageSquare className="w-4 h-4" />
          <span>{replies.length} 个洞见回复</span>
        </div>

        {disc.url ? (
          <a
            href={disc.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-[#c5a880] transition-colors"
          >
            <Github className="w-4 h-4" />
            <span>查看 GitHub 原帖</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        ) : null}
      </div>

      {replies.length > 0 ? (
        <div className="border-t border-[#22201d] pt-4 space-y-3">
          {replies.map((rep) => (
            <div
              key={rep.id}
              className="border border-[#1d1c19] bg-[#0c0c0b] p-4 space-y-2"
            >
              <div className="text-[11px] font-mono tracking-wider text-[#837f75]">
                {rep.author} • {rep.date}
              </div>
              <p className="text-sm leading-7 text-[#d6d2c8] whitespace-pre-line">
                {rep.content}
              </p>
            </div>
          ))}
        </div>
      ) : null}

      {isGithubMirror ? (
        <div className="border-t border-[#22201d] pt-4">
          <a
            href={disc.url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-[#c5a880] hover:bg-[#c5a880] hover:text-[#0d0d0c] text-[#c5a880] px-4 py-2 text-xs font-mono tracking-widest transition-all uppercase"
          >
            <Github className="w-4 h-4" />
            在 GitHub 中回复或点赞
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      ) : (
        <div className="border-t border-[#22201d] pt-4 space-y-3">
          <div className="text-xs font-mono tracking-widest text-[#837f75] uppercase">
            quick response
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={newReply[disc.id] || ''}
              onChange={(event) =>
                setNewReply({
                  ...newReply,
                  [disc.id]: event.target.value,
                })
              }
              className="flex-1 bg-[#0a0a09] border border-[#22201d] text-[#e8e4dc] px-3 py-2 text-sm focus:outline-none focus:border-[#c5a880] rounded-none"
              placeholder="写下你的回应..."
            />
            <button
              type="button"
              onClick={() => handleAddReply(disc.id)}
              className="border border-[#c5a880] hover:bg-[#c5a880] hover:text-[#0d0d0c] text-[#c5a880] px-4 py-2 text-xs font-mono tracking-widest transition-all inline-flex items-center justify-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span>Respond</span>
            </button>
          </div>
        </div>
      )}
    </article>
  );
}

export default function Forum({
  discussions,
  newDiscussion,
  setNewDiscussion,
  newReply,
  setNewReply,
  handleCreateDiscussion,
  handleAddReply,
  handleLike,
  getDiscussionsUrl,
  refreshGithubForum,
  forumSyncMeta,
}) {
  const discussionsUrl = getDiscussionsUrl();

  return (
    <div className="space-y-8">
      <div className="border border-[#22201d] p-6 bg-[#0f0f0e] space-y-5">
        <div className="space-y-2">
          <div className="text-xs font-mono tracking-[0.3em] text-[#837f75] uppercase">
            Discussions Forum
          </div>
          <h2 className="text-2xl font-serif text-[#f4f1eb]">
            心灵共振集会广场
          </h2>
          <p className="text-sm leading-7 text-[#a29d93]">
            当前页面展示的是 GitHub Discussions 的静态镜像，由 GitHub Actions
            自动同步到站点缓存。站内仍可做本地草稿，但正式发布、回复和点赞请使用
            GitHub 原生讨论区入口。
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href={discussionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 border border-[#c5a880] hover:bg-[#c5a880] hover:text-[#0d0d0c] text-[#c5a880] px-4 py-2 text-xs font-mono tracking-widest transition-all uppercase"
          >
            <Github className="w-4 h-4" />
            Open Discussions
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            type="button"
            onClick={() => refreshGithubForum({ silent: false })}
            className="inline-flex items-center justify-center gap-2 border border-[#423f39] hover:border-[#c5a880] hover:text-[#c5a880] text-[#a29d93] px-4 py-2 text-xs font-mono tracking-widest transition-all uppercase disabled:opacity-50"
            disabled={forumSyncMeta?.status === 'syncing'}
          >
            <RefreshCw
              className={`w-4 h-4 ${
                forumSyncMeta?.status === 'syncing' ? 'animate-spin' : ''
              }`}
            />
            Refresh Cache
          </button>

          <SyncBadge forumSyncMeta={forumSyncMeta} />
        </div>

        <div className="border border-[#22201d] bg-[#10100f] p-4 text-sm leading-7 text-[#a29d93]">
          <p>
            最近同步时间：
            <span className="text-[#e8e4dc]">
              {formatSyncTime(forumSyncMeta?.lastSyncedAt)}
            </span>
          </p>
          <p>
            当前源：
            <span className="text-[#e8e4dc]">
              {forumSyncMeta?.source || 'bootstrap-cache'}
            </span>
          </p>
          {forumSyncMeta?.error ? (
            <p className="text-[#d29a91]">
              最近一次同步异常：{forumSyncMeta.error}
            </p>
          ) : null}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-4">
            {discussions.length === 0 ? (
              <div className="border border-dashed border-[#22201d] p-8 text-center text-[#837f75] font-mono text-xs">
                [ NO DISCUSSION MIRROR FOUND YET ]
              </div>
            ) : (
              discussions.map((disc) => (
                <DiscussionCard
                  key={disc.id}
                  disc={disc}
                  newReply={newReply}
                  setNewReply={setNewReply}
                  handleAddReply={handleAddReply}
                  handleLike={handleLike}
                />
              ))
            )}
          </div>

          <aside className="lg:col-span-4 space-y-4">
            <div className="border border-[#22201d] p-6 bg-[#0f0f0e] space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#c5a880] uppercase">
                <Sparkles className="w-4 h-4" />
                <span>New Cognition / 本地草稿</span>
              </div>

              <p className="text-sm leading-7 text-[#a29d93]">
                这里保存的是本地草稿，方便你先起草主题与观点。正式发布到公开讨论区，
                请保存后点击上方的 Open Discussions。
              </p>

              <form onSubmit={handleCreateDiscussion} className="space-y-4">
                <div>
                  <label className="block text-[#a29d93] mb-1">
                    探讨核心命题 / Subject
                  </label>
                  <input
                    required
                    value={newDiscussion.title}
                    onChange={(event) =>
                      setNewDiscussion({
                        ...newDiscussion,
                        title: event.target.value,
                      })
                    }
                    className="w-full bg-[#0d0d0c] border border-[#22201d] text-[#e8e4dc] px-3 py-2 rounded-none focus:outline-none focus:border-[#c5a880]"
                  />
                </div>

                <div>
                  <label className="block text-[#a29d93] mb-1">
                    探讨分类域 / Field
                  </label>
                  <select
                    value={newDiscussion.category}
                    onChange={(event) =>
                      setNewDiscussion({
                        ...newDiscussion,
                        category: event.target.value,
                      })
                    }
                    className="w-full bg-[#0d0d0c] border border-[#22201d] text-[#e8e4dc] px-2 py-2 rounded-none focus:outline-none focus:border-[#c5a880]"
                  >
                    <option value="梦境探讨 / ONEIROMANCY">
                      梦境探讨 / ONEIROMANCY
                    </option>
                    <option value="哲学反思 / PHILOSOPHY">
                      哲学反思 / PHILOSOPHY
                    </option>
                    <option value="象征研究 / SYMBOLS">
                      象征研究 / SYMBOLS
                    </option>
                    <option value="实践分享 / PRAXIS">
                      实践分享 / PRAXIS
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#a29d93] mb-1">
                    思想描述与缘起 / Reasoning
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={newDiscussion.content}
                    onChange={(event) =>
                      setNewDiscussion({
                        ...newDiscussion,
                        content: event.target.value,
                      })
                    }
                    className="w-full bg-[#0d0d0c] border border-[#22201d] text-[#e8e4dc] p-2.5 rounded-none focus:outline-none focus:border-[#c5a880]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-transparent border border-[#c5a880] hover:bg-[#c5a880] hover:text-[#0d0d0c] text-[#c5a880] py-2.5 transition-all font-semibold tracking-widest uppercase"
                >
                  Save Draft / 保存草稿
                </button>
              </form>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

