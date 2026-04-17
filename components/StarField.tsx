"use client";

export default function StarField() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <style jsx>{`
        @keyframes scroll-stars {
          0% { transform: translateY(0); }
          100% { transform: translateY(100vh); }
        }
      `}</style>

      {/* Layer 1 - Slow purple sparkles */}
      <div className="absolute inset-0" style={{ animation: "scroll-stars 60s linear infinite" }}>
        {[...Array(30)].map((_, i) => (
          <div key={`slow-${i}`} className="absolute w-[2px] h-[2px] bg-[#c084fc] rounded-full opacity-40"
            style={{ left: `${(i * 37) % 100}%`, top: `${(i * 53) % 200 - 100}%` }} />
        ))}
      </div>
      <div className="absolute inset-0" style={{ animation: "scroll-stars 60s linear infinite", transform: "translateY(-100vh)" }}>
        {[...Array(30)].map((_, i) => (
          <div key={`slow2-${i}`} className="absolute w-[2px] h-[2px] bg-[#c084fc] rounded-full opacity-40"
            style={{ left: `${(i * 37) % 100}%`, top: `${(i * 53) % 200 - 100}%` }} />
        ))}
      </div>

      {/* Layer 2 - Medium gold sparkles */}
      <div className="absolute inset-0" style={{ animation: "scroll-stars 40s linear infinite" }}>
        {[...Array(25)].map((_, i) => (
          <div key={`med-${i}`} className="absolute w-[2px] h-[2px] bg-[#fbbf24] rounded-full opacity-50"
            style={{ left: `${(i * 43) % 100}%`, top: `${(i * 67) % 200 - 100}%` }} />
        ))}
      </div>
      <div className="absolute inset-0" style={{ animation: "scroll-stars 40s linear infinite", transform: "translateY(-100vh)" }}>
        {[...Array(25)].map((_, i) => (
          <div key={`med2-${i}`} className="absolute w-[2px] h-[2px] bg-[#fbbf24] rounded-full opacity-50"
            style={{ left: `${(i * 43) % 100}%`, top: `${(i * 67) % 200 - 100}%` }} />
        ))}
      </div>

      {/* Layer 3 - Fast white sparkles */}
      <div className="absolute inset-0" style={{ animation: "scroll-stars 25s linear infinite" }}>
        {[...Array(15)].map((_, i) => (
          <div key={`fast-${i}`} className="absolute w-[3px] h-[3px] bg-white rounded-full opacity-70"
            style={{ left: `${(i * 61) % 100}%`, top: `${(i * 79) % 200 - 100}%` }} />
        ))}
      </div>
      <div className="absolute inset-0" style={{ animation: "scroll-stars 25s linear infinite", transform: "translateY(-100vh)" }}>
        {[...Array(15)].map((_, i) => (
          <div key={`fast2-${i}`} className="absolute w-[3px] h-[3px] bg-white rounded-full opacity-70"
            style={{ left: `${(i * 61) % 100}%`, top: `${(i * 79) % 200 - 100}%` }} />
        ))}
      </div>
    </div>
  );
}
