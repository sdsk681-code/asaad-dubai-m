import { Link } from "wouter";

export default function Header() {
  return (
    <header className="h-[100px] w-full relative overflow-hidden flex items-center justify-between px-6 md:px-12 z-10" style={{ background: 'linear-gradient(to right, #7a6318, #c9a227)' }}>
      {/* Diamond pattern overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)',
        backgroundSize: '20px 20px',
        backgroundPosition: '0 0, 10px 10px'
      }} />
      
      {/* Left: Language Toggle */}
      <div className="relative z-10 flex items-center">
        <button className="bg-white/20 hover:bg-white/30 transition-colors text-white text-sm font-medium py-1.5 px-4 rounded-full flex items-center gap-2 border border-white/30 backdrop-blur-sm cursor-pointer">
          <span>🇺🇸</span>
          <span>English</span>
        </button>
      </div>

      {/* Right: Logo */}
      <Link href="/" className="relative z-10 flex flex-col items-center cursor-pointer hover:opacity-90 transition-opacity">
        <span className="text-white font-bold text-3xl leading-none mb-1 tracking-wider">فزعة</span>
        <span className="text-white text-sm font-medium tracking-[0.2em] leading-none">FAZAA</span>
      </Link>
    </header>
  );
}
