export default function Notification({ notification }) {
  if (!notification) {
    return null;
  }

  return (
    <div className="fixed top-24 right-6 z-50 max-w-sm w-full bg-[#141413] border border-[#c5a880]/30 p-4 shadow-xl text-xs font-mono tracking-wider animate-fade-in">
      <div className="flex items-center space-x-3">
        <span className="w-2 h-2 rounded-full bg-[#c5a880] animate-pulse" />
        <p className="text-[#e8e4dc]">{notification.message}</p>
      </div>
    </div>
  );
}
