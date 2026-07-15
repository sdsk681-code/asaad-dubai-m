import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-gray-400 py-8 px-6 md:px-12 w-full mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Right side (RTL left visual) - Links */}
        <div className="flex flex-wrap justify-center items-center gap-6 text-sm">
          <Link href="/" className="hover:text-white transition-colors cursor-pointer">سياسة الخصوصية</Link>
          <Link href="/" className="hover:text-white transition-colors cursor-pointer">شروط الخدمة</Link>
          <Link href="/" className="hover:text-white transition-colors cursor-pointer">الدعم</Link>
          <Link href="/" className="hover:text-white transition-colors cursor-pointer">الأسئلة الشائعة</Link>
        </div>
        
        {/* Left side (RTL right visual) - Copyright */}
        <div className="text-sm flex items-center gap-2">
          <span className="text-white font-bold">فزعة</span>
          <span>|</span>
          <span>© 2026 فزعة جميع الحقوق محفوظة</span>
        </div>
      </div>
    </footer>
  );
}
