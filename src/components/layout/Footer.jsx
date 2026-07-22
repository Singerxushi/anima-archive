export default function Footer() {
  return (
      <footer className="bg-[#0a0a09] border-t border-[#22201d] py-10 mt-auto">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div className="space-y-1 text-left">
            <span className="font-mono text-[9px] tracking-widest text-[#837f75] block">ANIMA ARCHIVE PROJECT</span>
            <p className="text-[11px] text-[#a29d93]">
              探求被遗忘的历史秘契，重构集体潜意识下的自性化图景。
            </p>
          </div>
          <div className="text-left md:text-right font-mono text-[10px] text-[#837f75]">
            <span>STATIC GENERATED PLATFORM & COOPERATIVE REPOSITORY.</span>
            <p className="mt-1">© 2026 UN-CANON INSPIRED INTERACTION LAB.</p>
          </div>
        </div>
      </footer>
  );
}
