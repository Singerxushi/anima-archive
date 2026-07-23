import { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle,
  ExternalLink,
  Github,
  RotateCcw,
  Settings,
  ShieldAlert,
  Trash2,
} from 'lucide-react';
import {
  clearStoredGithubConfig,
  clearStoredGithubToken,
  DEFAULT_GITHUB_CONFIG,
  sanitizeGithubConfig,
} from '../config/github';

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

export default function SettingsPanel({
  githubConfig,
  setGithubConfig,
  forumSyncMeta,
  triggerNotification,
  setActiveTab,
}) {
  const [draftConfig, setDraftConfig] = useState(() =>
    sanitizeGithubConfig(githubConfig),
  );

  useEffect(() => {
    setDraftConfig(sanitizeGithubConfig(githubConfig));
  }, [githubConfig]);

  const resolvedConfig = useMemo(
    () => sanitizeGithubConfig(draftConfig),
    [draftConfig],
  );

  const repositoryUrl = `https://github.com/${resolvedConfig.owner}/${resolvedConfig.repo}`;
  const discussionsUrl = `${repositoryUrl}/discussions`;

  function handleSave(event) {
    event.preventDefault();
    setGithubConfig(resolvedConfig);
    triggerNotification('GitHub 仓库配置已更新。前端不再保存 GitHub token。');
    setActiveTab('home');
  }

  function handleResetDefaults() {
    setDraftConfig(DEFAULT_GITHUB_CONFIG);
    triggerNotification('已恢复默认仓库配置，请记得点击保存。');
  }

  function handleClearAll() {
    clearStoredGithubConfig();
    clearStoredGithubToken();
    setDraftConfig(DEFAULT_GITHUB_CONFIG);
    setGithubConfig(DEFAULT_GITHUB_CONFIG);
    triggerNotification('本地 GitHub 配置已清空并恢复默认值。');
  }

  return (
    <div className="space-y-8">
      <div className="border border-[#22201d] p-6 bg-[#0f0f0e] space-y-5">
        <div className="space-y-2">
          <div className="text-xs font-mono tracking-[0.3em] text-[#837f75] uppercase">
            GitHub Integration Center
          </div>
          <h2 className="text-2xl font-serif text-[#f4f1eb]">
            管理员接口集成中心
          </h2>
          <p className="text-sm text-[#a29d93] leading-7">
            当前站点采用 GitHub 原生集成：Archive 保持本地草稿体验，Journal
            走 GitHub Issues，Forum 通过 GitHub Actions 同步 GitHub Discussions
            到静态缓存。公开站点不再接收浏览器中的 PAT。
          </p>
        </div>

        <div className="border border-[#5e4634] bg-[#231b14] p-4 text-sm leading-7 text-[#d8c2a1]">
          <div className="flex items-center gap-2 font-mono text-xs tracking-[0.2em] uppercase">
            <ShieldAlert className="w-4 h-4" />
            <span>安全基线</span>
          </div>
          <p className="mt-3">
            浏览器只保存 owner / repo，Forum 的公开内容通过 GitHub Actions
            从 Discussions 拉取为静态 JSON 缓存。这样可以避免把高权限令牌暴露给前端。
          </p>
        </div>

        <form
          onSubmit={handleSave}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          <div className="lg:col-span-7 space-y-4">
            <div>
              <label className="block text-[#a29d93] mb-1">
                GitHub 账户或组织名 / Owner
              </label>
              <input
                value={draftConfig.owner}
                onChange={(event) =>
                  setDraftConfig((prev) => ({
                    ...prev,
                    owner: event.target.value,
                  }))
                }
                className="w-full bg-[#0d0d0c] border border-[#22201d] text-[#e8e4dc] px-3.5 py-2.5 rounded-none focus:outline-none focus:border-[#c5a880]"
                placeholder="Singerxushi"
              />
            </div>

            <div>
              <label className="block text-[#a29d93] mb-1">
                目标仓库名 / Repository
              </label>
              <input
                value={draftConfig.repo}
                onChange={(event) =>
                  setDraftConfig((prev) => ({
                    ...prev,
                    repo: event.target.value,
                  }))
                }
                className="w-full bg-[#0d0d0c] border border-[#22201d] text-[#e8e4dc] px-3.5 py-2.5 rounded-none focus:outline-none focus:border-[#c5a880]"
                placeholder="anima-archive"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                className="inline-flex items-center gap-2 border border-[#c5a880] hover:bg-[#c5a880] hover:text-[#0d0d0c] text-[#c5a880] px-4 py-2 text-xs font-mono tracking-widest transition-all uppercase"
              >
                <CheckCircle className="w-4 h-4" />
                Save Configuration
              </button>

              <button
                type="button"
                onClick={handleResetDefaults}
                className="inline-flex items-center gap-2 border border-[#423f39] hover:border-[#c5a880] text-[#a29d93] hover:text-[#e8e4dc] px-4 py-2 text-xs font-mono tracking-widest transition-all uppercase"
              >
                <RotateCcw className="w-4 h-4" />
                Reset Defaults
              </button>

              <button
                type="button"
                onClick={handleClearAll}
                className="inline-flex items-center gap-2 border border-[#6b3d38] hover:border-[#b77b70] text-[#c98f86] px-4 py-2 text-xs font-mono tracking-widest transition-all uppercase"
              >
                <Trash2 className="w-4 h-4" />
                Clear Local Config
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="border border-[#22201d] p-4 bg-[#11110f] space-y-3">
              <div className="text-xs font-mono tracking-widest text-[#c5a880] uppercase">
                Forum Sync Status
              </div>
              <div className="text-sm leading-7 text-[#a29d93]">
                <p>
                  当前源：
                  <span className="text-[#e8e4dc]">
                    {forumSyncMeta?.source || 'bootstrap-cache'}
                  </span>
                </p>
                <p>
                  最近同步：
                  <span className="text-[#e8e4dc]">
                    {formatSyncTime(forumSyncMeta?.lastSyncedAt)}
                  </span>
                </p>
                <p>
                  状态：
                  <span
                    className={
                      forumSyncMeta?.status === 'error'
                        ? 'text-[#d29a91]'
                        : 'text-[#9bc08d]'
                    }
                  >
                    {forumSyncMeta?.status || 'idle'}
                  </span>
                </p>
                {forumSyncMeta?.error ? (
                  <p className="text-[#d29a91] break-words">
                    错误：{forumSyncMeta.error}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="border border-[#22201d] p-4 bg-[#11110f] space-y-3">
              <div className="text-xs font-mono tracking-widest text-[#c5a880] uppercase flex items-center gap-2">
                <Settings className="w-4 h-4" />
                <span>Repository Preview</span>
              </div>

              <div className="text-xs text-[#a29d93] break-all">{repositoryUrl}</div>
              <div className="text-xs text-[#a29d93] break-all">{discussionsUrl}</div>

              <div className="flex flex-wrap gap-3">
                <a
                  href={repositoryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-[#c5a880] hover:bg-[#c5a880] hover:text-[#0d0d0c] text-[#c5a880] px-4 py-2 text-xs font-mono tracking-widest transition-all uppercase"
                >
                  <Github className="w-4 h-4" />
                  Open Repo
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <a
                  href={discussionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-[#423f39] hover:border-[#c5a880] hover:text-[#c5a880] text-[#a29d93] px-4 py-2 text-xs font-mono tracking-widest transition-all uppercase"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open Discussions
                </a>
              </div>
            </div>

            <div className="border border-[#22201d] p-4 bg-[#11110f] space-y-3">
              <div className="text-xs font-mono tracking-widest text-[#c5a880] uppercase">
                管理员说明
              </div>
              <p className="text-sm leading-7 text-[#a29d93]">
                若你希望站内直接发帖/回复/点赞，必须额外引入 GitHub App
                或 OAuth 代理；这已经超出“仅提交仓库改动”的范围。因此本补丁实现的是
                GitHub 原生、可直接落仓库的安全上限：镜像读取 + 原生写入跳转。
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
