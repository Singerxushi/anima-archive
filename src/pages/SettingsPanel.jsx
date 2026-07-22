import { CheckCircle, Github, Settings, Sparkles } from 'lucide-react';

export default function SettingsPanel({
  githubConfig,
  setGithubConfig,
  triggerNotification,
  setActiveTab,
}) {
  return (
          <div className="max-w-xl mx-auto border border-[#22201d] bg-[#0f0f0e] p-8 space-y-6">
            
            <div className="border-b border-[#22201d] pb-4">
              <h2 className="text-lg font-serif text-[#f4f1eb] flex items-center space-x-2.5">
                <Settings className="w-5 h-5 text-[#c5a880]" />
                <span>GITHUB INTEGRATION / 接口集成中心</span>
              </h2>
              <p className="text-xs font-mono text-[#837f75] mt-1">
                CONFIGURE REPOSITORIES FOR DIRECT GIT PIPELINE
              </p>
            </div>

            <div className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-[#a29d93] mb-1.5">
                  GitHub 账户或组织名 / OWNER (USERNAME)
                </label>
                <input
                  type="text"
                  placeholder="e.g. aethelgard"
                  value={githubConfig.owner}
                  onChange={(e) => setGithubConfig({...githubConfig, owner: e.target.value})}
                  className="w-full bg-[#0d0d0c] border border-[#22201d] text-[#e8e4dc] px-3.5 py-2.5 rounded-none focus:outline-none focus:border-[#c5a880]"
                />
              </div>

              <div>
                <label className="block text-[#a29d93] mb-1.5">
                  目标仓库名 / REPOSITORY NAME
                </label>
                <input
                  type="text"
                  placeholder="e.g. anima-archive"
                  value={githubConfig.repo}
                  onChange={(e) => setGithubConfig({...githubConfig, repo: e.target.value})}
                  className="w-full bg-[#0d0d0c] border border-[#22201d] text-[#e8e4dc] px-3.5 py-2.5 rounded-none focus:outline-none focus:border-[#c5a880]"
                />
              </div>

              <div>
                <label className="block text-[#a29d93] mb-1.5 flex items-center justify-between">
                  <span>个人访问密匙 / PERSONAL ACCESS TOKEN (PAT)</span>
                  <span className="text-[9px] text-[#837f75] normal-case font-normal">保存在本地安全沙盒</span>
                </label>
                <input
                  type="password"
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxx"
                  value={githubConfig.token}
                  onChange={(e) => setGithubConfig({...githubConfig, token: e.target.value})}
                  className="w-full bg-[#0d0d0c] border border-[#22201d] text-[#e8e4dc] px-3.5 py-2.5 rounded-none focus:outline-none focus:border-[#c5a880]"
                />
              </div>

              <div className="bg-[#0a0a09] border border-[#22201d] p-5 space-y-2.5">
                <p className="font-bold text-[#c5a880] flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>关于无 Token 安全运行模式：</span>
                </p>
                <p className="text-[#837f75] leading-relaxed">
                  本站点全面支持“无 Token”工作流：
                  <br />
                  - 只需要填写 <strong>Owner</strong> 与 <strong>Repository</strong>。
                  <br />
                  - 在学报投稿时，系统将使用纯前端计算出高度规范化的 Issue 链接，用户跳转点击 “Submit” 即可，不需要向网页透露任何凭证密匙。
                </p>
              </div>

              <button
                onClick={() => {
                  triggerNotification('⚙️ 核心配置在本地沙盒环境中写入并更新完毕。');
                  setActiveTab('home');
                }}
                className="w-full bg-[#c5a880] text-[#0d0d0c] hover:bg-[#b0936f] py-3 transition-all font-semibold tracking-widest uppercase flex items-center justify-center space-x-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>SAVE CONFIGURATION / 保存本地</span>
              </button>
            </div>

          </div>
  );
}

