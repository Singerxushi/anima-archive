/**
 * 修改原因：
 * 1. 将“接口集成中心”明确为管理员用途，避免普通访客误以为必须配置 PAT。
 * 2. owner / repo 采用显式保存；token 只走会话态，不与 localStorage 绑定。
 *
 * 兼容性注意：
 * - 组件 props 从旧版的 githubConfig/setGithubConfig 扩展为同时接收 githubToken/setGithubToken。
 * - App.jsx 已配套调整。
 */

import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff,
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

export default function SettingsPanel({
  githubConfig,
  setGithubConfig,
  githubToken,
  setGithubToken,
  triggerNotification,
  setActiveTab,
}) {
  const [draftConfig, setDraftConfig] = useState(() =>
    sanitizeGithubConfig(githubConfig)
  );
  const [draftToken, setDraftToken] = useState(githubToken || '');
  const [showToken, setShowToken] = useState(false);

  useEffect(() => {
    setDraftConfig(sanitizeGithubConfig(githubConfig));
  }, [githubConfig]);

  useEffect(() => {
    setDraftToken(githubToken || '');
  }, [githubToken]);

  const resolvedConfig = useMemo(
    () => sanitizeGithubConfig(draftConfig),
    [draftConfig]
  );

  const repositoryUrl = `https://github.com/${resolvedConfig.owner}/${resolvedConfig.repo}`;
  const discussionsUrl = `${repositoryUrl}/discussions`;

  function handleSave(event) {
    event.preventDefault();
    setGithubConfig(resolvedConfig);
    setGithubToken(draftToken.trim());
    triggerNotification('⚙️ GitHub 集成配置已更新。Owner/Repo 已本地保存，Token 已写入当前会话。');
    setActiveTab('home');
  }

  function handleResetDefaults() {
    setDraftConfig(DEFAULT_GITHUB_CONFIG);
    triggerNotification('已恢复默认仓库配置，请记得点击保存。');
  }

  function handleClearToken() {
    setDraftToken('');
    setGithubToken('');
    clearStoredGithubToken();
    triggerNotification('当前会话中的 GitHub token 已清空。');
  }

  function handleClearAll() {
    clearStoredGithubConfig();
    clearStoredGithubToken();
    setDraftConfig(DEFAULT_GITHUB_CONFIG);
    setDraftToken('');
    setGithubConfig(DEFAULT_GITHUB_CONFIG);
    setGithubToken('');
    triggerNotification('本地 GitHub 配置与会话 token 已清空，已恢复默认仓库。');
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="border border-[#22201d] bg-[#11110f] p-6 sm:p-8 space-y-8">
        <div className="space-y-3">
          <div className="flex items-center space-x-3 text-[#c5a880]">
            <Settings className="w-5 h-5" />
            <span className="text-xs tracking-[0.35em] font-mono uppercase">
              GitHub Integration Center
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#f4f1eb]">
            管理员接口集成中心
          </h2>
          <p className="text-sm leading-7 text-[#b8b1a4]">
            公开访问者只需要使用 Issues 投稿与 Discussions 讨论，不需要填写任何密钥。
            这里只有管理员在需要远程写入归档仓库时才需要输入 token。
          </p>
        </div>

        <div className="border border-[#3c3222] bg-[#17140f] p-4 text-xs leading-6 text-[#dcc8a2]">
          <div className="flex items-start space-x-3">
            <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" />
            <div className="space-y-1">
              <p className="font-semibold tracking-wider uppercase">
                安全提示
              </p>
              <p>
                Owner / Repo 会保存在浏览器本地；Token 仅保存在当前浏览器会话中，关闭浏览器后应失效。
                请勿在公共设备中输入高权限 PAT。
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs tracking-widest uppercase text-[#a29d93]">
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

            <div className="space-y-2">
              <label className="block text-xs tracking-widest uppercase text-[#a29d93]">
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
          </div>

          <div className="space-y-2">
            <label className="block text-xs tracking-widest uppercase text-[#a29d93]">
              管理员 PAT / Session Token
            </label>
            <div className="flex">
              <input
                type={showToken ? 'text' : 'password'}
                value={draftToken}
                onChange={(event) => setDraftToken(event.target.value)}
                className="flex-1 bg-[#0d0d0c] border border-[#22201d] text-[#e8e4dc] px-3.5 py-2.5 rounded-none focus:outline-none focus:border-[#c5a880]"
                placeholder="仅管理员需要填写；普通使用场景请留空"
                autoComplete="off"
              />
              <button
                type="button"
                onClick={() => setShowToken((value) => !value)}
                className="border-y border-r border-[#22201d] px-3 text-[#a29d93] hover:text-[#f4f1eb] hover:border-[#c5a880] transition-colors"
                title={showToken ? '隐藏 token' : '显示 token'}
              >
                {showToken ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            <p className="text-xs leading-6 text-[#8e8779]">
              建议仅使用具备最小必要权限的 fine-grained token；如果你未来引入后端代理或 GitHub App，
              这里可以长期保持为空。
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
            <div className="border border-[#22201d] p-4 bg-[#0d0d0c]">
              <p className="text-[#837f75] uppercase tracking-widest mb-2">
                Repository Preview
              </p>
              <p className="text-[#e8e4dc] break-all">{repositoryUrl}</p>
            </div>
            <div className="border border-[#22201d] p-4 bg-[#0d0d0c]">
              <p className="text-[#837f75] uppercase tracking-widest mb-2">
                Discussions Preview
              </p>
              <p className="text-[#e8e4dc] break-all">{discussionsUrl}</p>
            </div>
          </div>

          <div className="border border-[#22201d] bg-[#10100f] px-4 py-3 text-xs leading-6 text-[#a29d93]">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-[#c5a880]" />
              <div>
                <p className="font-semibold text-[#e8e4dc]">
                  当前推荐工作流
                </p>
                <p>
                  公开用户：Journal 使用 GitHub Issues 投递；Forum 使用 GitHub Discussions 交流。
                  管理员：只有在需要把 Archive 直接写入仓库时，才临时输入 token。
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              className="flex-1 bg-[#c5a880] text-[#0d0d0c] hover:bg-[#b0936f] py-3 transition-all font-semibold tracking-widest uppercase flex items-center justify-center space-x-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Save Configuration / 保存配置</span>
            </button>

            <button
              type="button"
              onClick={handleResetDefaults}
              className="flex-1 border border-[#3d382f] text-[#d4cec2] hover:border-[#c5a880] hover:text-[#f4f1eb] py-3 transition-all font-semibold tracking-widest uppercase flex items-center justify-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Defaults / 恢复默认</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleClearToken}
              className="border border-[#22201d] text-[#a29d93] hover:text-[#f4f1eb] hover:border-[#c5a880] py-2.5 transition-all font-medium tracking-widest uppercase"
            >
              清空会话 Token
            </button>

            <button
              type="button"
              onClick={handleClearAll}
              className="border border-[#552d2d] text-[#d7b4b4] hover:text-[#ffe4e4] hover:border-[#8b4747] py-2.5 transition-all font-medium tracking-widest uppercase flex items-center justify-center space-x-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>清空全部本地配置</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
