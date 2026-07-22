import { BookOpen, Compass, FileText, MessageSquare, Sparkles } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-5xl mx-auto space-y-16 py-6">

      <section className="space-y-5 border-b border-[#22201d] pb-10">
        <div className="font-mono text-xs text-[#c5a880] uppercase tracking-[0.25em] flex items-center space-x-2">
          <Compass className="w-4 h-4" />
          <span>ANIMA ARCHIVE / ABOUT</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-serif text-[#f4f1eb] font-normal leading-[1.2] tracking-tight">
          潜意识探索档案馆
        </h2>

        <p className="text-[#a29d93] text-sm leading-relaxed max-w-3xl">
          Anima Archive 是一个围绕潜意识、象征系统与分析心理学建立的开放式知识档案。
          它尝试把荣格心理学、梦境研究、神话学、炼金术隐喻与古典神秘传统放在同一个可检索、可投稿、可讨论的数字空间中。
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-[#22201d] divide-y md:divide-y-0 md:divide-x divide-[#22201d]">
        <div className="p-6 space-y-3">
          <div className="font-mono text-xs text-[#c5a880]">01 / PSYCHE</div>
          <h3 className="text-lg font-serif text-[#f4f1eb]">心理结构</h3>
          <p className="text-xs text-[#a29d93] leading-relaxed">
            关注原型、阴影、自性化、人格面具、阿尼玛与阿尼姆斯等分析心理学主题。
          </p>
        </div>

        <div className="p-6 space-y-3">
          <div className="font-mono text-xs text-[#c5a880]">02 / SYMBOL</div>
          <h3 className="text-lg font-serif text-[#f4f1eb]">象征研究</h3>
          <p className="text-xs text-[#a29d93] leading-relaxed">
            将梦境意象、神话结构、炼金术阶段、宗教符号作为心理经验的表达形式进行整理。
          </p>
        </div>

        <div className="p-6 space-y-3">
          <div className="font-mono text-xs text-[#c5a880]">03 / ARCHIVE</div>
          <h3 className="text-lg font-serif text-[#f4f1eb]">开放协作</h3>
          <p className="text-xs text-[#a29d93] leading-relaxed">
            通过 GitHub Pages、Discussions 与 Issues 建立静态网站上的资料库、论坛与期刊投稿流程。
          </p>
        </div>
      </section>

      <section className="space-y-6">
        <h3 className="font-mono text-xs tracking-widest text-[#a29d93] uppercase border-b border-[#22201d] pb-2">
          SITE MODULES / 站点模块
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-[#22201d] p-5 bg-[#0f0f0e] space-y-3">
            <BookOpen className="w-5 h-5 text-[#c5a880]" />
            <h4 className="text-[#f4f1eb] font-serif">Archives / 档案库</h4>
            <p className="text-xs text-[#a29d93] leading-relaxed">
              用于收录主题文章、资料索引、研究笔记与象征条目。
            </p>
          </div>

          <div className="border border-[#22201d] p-5 bg-[#0f0f0e] space-y-3">
            <MessageSquare className="w-5 h-5 text-[#c5a880]" />
            <h4 className="text-[#f4f1eb] font-serif">Discussions / 讨论区</h4>
            <p className="text-xs text-[#a29d93] leading-relaxed">
              用于交流梦境、阅读笔记、象征解释和档案建设建议。
            </p>
          </div>

          <div className="border border-[#22201d] p-5 bg-[#0f0f0e] space-y-3">
            <FileText className="w-5 h-5 text-[#c5a880]" />
            <h4 className="text-[#f4f1eb] font-serif">Journal / 学报</h4>
            <p className="text-xs text-[#a29d93] leading-relaxed">
              用于收集论文投稿、专题征稿和公开评议记录。
            </p>
          </div>
        </div>
      </section>

      <section className="border border-[#22201d] p-6 bg-[#0f0f0e]">
        <div className="flex items-center space-x-2 text-[#c5a880] font-mono text-xs tracking-widest uppercase">
          <Sparkles className="w-4 h-4" />
          <span>RESEARCH BOUNDARY</span>
        </div>

        <p className="text-sm text-[#a29d93] leading-relaxed mt-4">
          本站内容主要用于心理学、象征学、思想史与文化研究。
          神秘学材料在这里被视为象征系统与历史文本，而不是医学诊断、心理治疗或现实决策依据。
          若涉及严重心理困扰，应优先寻求现实中的可信成年人、学校支持系统或专业人士帮助。
        </p>
      </section>

    </div>
  );
}
