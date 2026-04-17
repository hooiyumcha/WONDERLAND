"use client";

export default function StarField() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none select-none">
      <style jsx>{`
        @keyframes scroll-stars {
          0% { transform: translateY(0); }
          100% { transform: translateY(100vh); }
        }
      `}</style>

      {/* ♠ Spades — white, slow */}
      <div className="absolute inset-0" style={{ animation: "scroll-stars 60s linear infinite" }}>
        {[...Array(15)].map((_, i) => (
          <span key={`spade-${i}`} className="absolute text-[10px] text-white opacity-40"
            style={{ left: `${(i * 37) % 100}%`, top: `${(i * 53) % 200 - 100}%` }}>♠</span>
        ))}
      </div>
      <div className="absolute inset-0" style={{ animation: "scroll-stars 60s linear infinite", transform: "translateY(-100vh)" }}>
        {[...Array(15)].map((_, i) => (
          <span key={`spade2-${i}`} className="absolute text-[10px] text-white opacity-40"
            style={{ left: `${(i * 37) % 100}%`, top: `${(i * 53) % 200 - 100}%` }}>♠</span>
        ))}
      </div>

      {/* ♥ Hearts — red, medium */}
      <div className="absolute inset-0" style={{ animation: "scroll-stars 45s linear infinite" }}>
        {[...Array(12)].map((_, i) => (
          <span key={`heart-${i}`} className="absolute text-[10px] text-[#ef4444] opacity-60"
            style={{ left: `${(i * 43) % 100}%`, top: `${(i * 71) % 200 - 100}%` }}>♥</span>
        ))}
      </div>
      <div className="absolute inset-0" style={{ animation: "scroll-stars 45s linear infinite", transform: "translateY(-100vh)" }}>
        {[...Array(12)].map((_, i) => (
          <span key={`heart2-${i}`} className="absolute text-[10px] text-[#ef4444] opacity-60"
            style={{ left: `${(i * 43) % 100}%`, top: `${(i * 71) % 200 - 100}%` }}>♥</span>
        ))}
      </div>

      {/* ♦ Diamonds — light red, medium-fast */}
      <div className="absolute inset-0" style={{ animation: "scroll-stars 30s linear infinite" }}>
        {[...Array(12)].map((_, i) => (
          <span key={`diamond-${i}`} className="absolute text-[10px] text-[#fca5a5] opacity-50"
            style={{ left: `${(i * 61) % 100}%`, top: `${(i * 47) % 200 - 100}%` }}>♦</span>
        ))}
      </div>
      <div className="absolute inset-0" style={{ animation: "scroll-stars 30s linear infinite", transform: "translateY(-100vh)" }}>
        {[...Array(12)].map((_, i) => (
          <span key={`diamond2-${i}`} className="absolute text-[10px] text-[#fca5a5] opacity-50"
            style={{ left: `${(i * 61) % 100}%`, top: `${(i * 47) % 200 - 100}%` }}>♦</span>
        ))}
      </div>

      {/* ♣ Clubs — lavender, fast */}
      <div className="absolute inset-0" style={{ animation: "scroll-stars 20s linear infinite" }}>
        {[...Array(10)].map((_, i) => (
          <span key={`club-${i}`} className="absolute text-[10px] text-[#c084fc] opacity-40"
            style={{ left: `${(i * 79) % 100}%`, top: `${(i * 59) % 200 - 100}%` }}>♣</span>
        ))}
      </div>
      <div className="absolute inset-0" style={{ animation: "scroll-stars 20s linear infinite", transform: "translateY(-100vh)" }}>
        {[...Array(10)].map((_, i) => (
          <span key={`club2-${i}`} className="absolute text-[10px] text-[#c084fc] opacity-40"
            style={{ left: `${(i * 79) % 100}%`, top: `${(i * 59) % 200 - 100}%` }}>♣</span>
        ))}
      </div>
    </div>
  );
}
