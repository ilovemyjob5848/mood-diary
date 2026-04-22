import { useState, useEffect } from "react";

const MOODS = [
  { emoji: "🤩", label: "超棒！", color: "#FF8F00", bg: "#FFF8E1", score: 5 },
  { emoji: "😊", label: "不錯", color: "#FFA726", bg: "#FFF3E0", score: 4 },
  { emoji: "😐", label: "普通", color: "#FFB300", bg: "#FFFDE7", score: 3 },
  { emoji: "😔", label: "有點難", color: "#FF7043", bg: "#FBE9E7", score: 2 },
  { emoji: "😢", label: "很辛苦", color: "#E64A19", bg: "#FBE9E7", score: 1 },
];

const TAGS = ["學到新東西", "同事很友善", "工作好多", "搞不清楚流程", "主管很幫忙", "想家", "有成就感", "壓力有點大"];

const NAMES = ["小美", "小明", "阿志", "雅婷", "建宏"];

function generateSampleData() {
  const data = [];
  const today = new Date();
  NAMES.forEach((name, ni) => {
    for (let d = 6; d >= 0; d--) {
      const date = new Date(today);
      date.setDate(today.getDate() - d);
      const mood = MOODS[Math.floor(Math.random() * MOODS.length)];
      const tag = TAGS[Math.floor(Math.random() * TAGS.length)];
      const notes = ["今天學了很多，但還是有點緊張", "大家都很好，慢慢適應中", "流程有點複雜，要多問", "感覺越來越上手了！", ""][Math.floor(Math.random() * 5)];
      data.push({
        id: `${ni}-${d}`,
        name,
        date: date.toLocaleDateString("zh-TW"),
        mood,
        tag,
        notes,
      });
    }
  });
  return data;
}

// ─── Employee View ───────────────────────────────────────────────────────────
function EmployeeView({ onSubmit }) {
  const [step, setStep] = useState(0); // 0=name, 1=mood, 2=tags, 3=note, 4=done
  const [name, setName] = useState("");
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [note, setNote] = useState("");
  const [bounce, setBounce] = useState(false);

  const triggerBounce = () => { setBounce(true); setTimeout(() => setBounce(false), 400); };

  const handleMoodSelect = (mood) => { setSelectedMood(mood); triggerBounce(); };
  const toggleTag = (tag) => setSelectedTags(t => t.includes(tag) ? t.filter(x => x !== tag) : [...t, tag]);

  const handleSubmit = () => {
    onSubmit({ name, mood: selectedMood, tags: selectedTags, note, date: new Date().toLocaleDateString("zh-TW") });
    setStep(4);
  };

  const today = new Date().toLocaleDateString("zh-TW", { month: "long", day: "numeric", weekday: "long" });

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #FFFDE7 0%, #FFF3E0 50%, #FFF8E1 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px", fontFamily: "'Noto Sans TC', sans-serif" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>😊</div>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: "#E65100", margin: 0, letterSpacing: 2 }}>心情日記</h1>
        <p style={{ color: "#FF8F00", fontSize: 14, margin: "6px 0 0", fontWeight: 500 }}>{today}</p>
      </div>

      <div style={{ width: "100%", maxWidth: 420, background: "white", borderRadius: 28, boxShadow: "0 12px 48px rgba(255,143,0,0.18)", overflow: "hidden" }}>

        {/* Step 0: Name */}
        {step === 0 && (
          <div style={{ padding: 32 }}>
            <p style={{ fontSize: 20, fontWeight: 700, color: "#E65100", marginBottom: 20, textAlign: "center" }}>您好！請輸入您的名字 👋</p>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="例如：小美"
              style={{ width: "100%", padding: "14px 18px", borderRadius: 16, border: "2.5px solid #FFD180", fontSize: 18, outline: "none", boxSizing: "border-box", color: "#E65100", fontFamily: "inherit", fontWeight: 600 }}
              onKeyDown={e => e.key === "Enter" && name.trim() && setStep(1)}
            />
            <button
              onClick={() => name.trim() && setStep(1)}
              disabled={!name.trim()}
              style={{ width: "100%", marginTop: 18, padding: "14px", borderRadius: 16, background: name.trim() ? "linear-gradient(135deg, #FFA726, #FF8F00)" : "#FFE0B2", border: "none", color: "white", fontSize: 18, fontWeight: 700, cursor: name.trim() ? "pointer" : "not-allowed", transition: "all 0.2s", fontFamily: "inherit" }}
            >
              開始記錄 ✨
            </button>
          </div>
        )}

        {/* Step 1: Mood */}
        {step === 1 && (
          <div style={{ padding: 32 }}>
            <p style={{ fontSize: 20, fontWeight: 700, color: "#E65100", marginBottom: 6, textAlign: "center" }}>{name}，今天工作感覺如何？</p>
            <p style={{ color: "#FF8F00", fontSize: 13, textAlign: "center", marginBottom: 24 }}>選一個最接近的心情</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {MOODS.map(mood => (
                <button
                  key={mood.score}
                  onClick={() => handleMoodSelect(mood)}
                  style={{
                    display: "flex", alignItems: "center", gap: 16,
                    padding: "14px 20px", borderRadius: 18,
                    background: selectedMood?.score === mood.score ? mood.bg : "#FFFDE7",
                    border: selectedMood?.score === mood.score ? `2.5px solid ${mood.color}` : "2.5px solid transparent",
                    cursor: "pointer", transition: "all 0.2s", fontFamily: "inherit",
                    transform: selectedMood?.score === mood.score && bounce ? "scale(1.03)" : "scale(1)",
                  }}
                >
                  <span style={{ fontSize: 32 }}>{mood.emoji}</span>
                  <span style={{ fontSize: 18, fontWeight: 700, color: mood.color }}>{mood.label}</span>
                  {selectedMood?.score === mood.score && <span style={{ marginLeft: "auto", color: mood.color, fontSize: 20 }}>✓</span>}
                </button>
              ))}
            </div>
            <button
              onClick={() => selectedMood && setStep(2)}
              disabled={!selectedMood}
              style={{ width: "100%", marginTop: 20, padding: "14px", borderRadius: 16, background: selectedMood ? "linear-gradient(135deg, #FFA726, #FF8F00)" : "#FFE0B2", border: "none", color: "white", fontSize: 18, fontWeight: 700, cursor: selectedMood ? "pointer" : "not-allowed", fontFamily: "inherit" }}
            >
              下一步 →
            </button>
          </div>
        )}

        {/* Step 2: Tags */}
        {step === 2 && (
          <div style={{ padding: 32 }}>
            <p style={{ fontSize: 20, fontWeight: 700, color: "#E65100", marginBottom: 6, textAlign: "center" }}>今天有什麼感受？</p>
            <p style={{ color: "#FF8F00", fontSize: 13, textAlign: "center", marginBottom: 24 }}>可以選多個（或直接跳過）</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
              {TAGS.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  style={{
                    padding: "10px 18px", borderRadius: 50,
                    background: selectedTags.includes(tag) ? "linear-gradient(135deg, #FFA726, #FF8F00)" : "#FFF3E0",
                    border: selectedTags.includes(tag) ? "none" : "2px solid #FFD180",
                    color: selectedTags.includes(tag) ? "white" : "#E65100",
                    fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "all 0.2s", fontFamily: "inherit",
                  }}
                >{tag}</button>
              ))}
            </div>
            <button
              onClick={() => setStep(3)}
              style={{ width: "100%", marginTop: 24, padding: "14px", borderRadius: 16, background: "linear-gradient(135deg, #FFA726, #FF8F00)", border: "none", color: "white", fontSize: 18, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}
            >
              下一步 →
            </button>
          </div>
        )}

        {/* Step 3: Note */}
        {step === 3 && (
          <div style={{ padding: 32 }}>
            <p style={{ fontSize: 20, fontWeight: 700, color: "#E65100", marginBottom: 6, textAlign: "center" }}>還有什麼想說的嗎？</p>
            <p style={{ color: "#FF8F00", fontSize: 13, textAlign: "center", marginBottom: 20 }}>可以不填，直接送出也沒關係 😊</p>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="今天學到了…／有點擔心…／很開心因為…"
              rows={5}
              style={{ width: "100%", padding: "14px 18px", borderRadius: 16, border: "2.5px solid #FFD180", fontSize: 15, outline: "none", resize: "none", boxSizing: "border-box", color: "#5D4037", fontFamily: "inherit", lineHeight: 1.7 }}
            />
            <button
              onClick={handleSubmit}
              style={{ width: "100%", marginTop: 16, padding: "14px", borderRadius: 16, background: "linear-gradient(135deg, #FFA726, #FF8F00)", border: "none", color: "white", fontSize: 18, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}
            >
              送出日記 🌟
            </button>
          </div>
        )}

        {/* Step 4: Done */}
        {step === 4 && (
          <div style={{ padding: 40, textAlign: "center" }}>
            <div style={{ fontSize: 72, marginBottom: 16, animation: "pop 0.5s ease" }}>🎉</div>
            <h2 style={{ color: "#E65100", fontSize: 24, fontWeight: 900, marginBottom: 8 }}>記錄成功！</h2>
            <p style={{ color: "#FF8F00", fontSize: 16, lineHeight: 1.8 }}>謝謝 {name} 今天的分享<br/>你做得很棒！明天繼續加油 💪</p>
            <div style={{ marginTop: 28, padding: "16px 20px", background: "#FFF8E1", borderRadius: 16, border: "2px dashed #FFD180" }}>
              <p style={{ color: "#FF8F00", fontSize: 14, margin: 0 }}>今日心情：{selectedMood?.emoji} {selectedMood?.label}</p>
              {selectedTags.length > 0 && <p style={{ color: "#FFA726", fontSize: 13, margin: "6px 0 0" }}>{selectedTags.join(" · ")}</p>}
            </div>
            <button
              onClick={() => { setStep(0); setName(""); setSelectedMood(null); setSelectedTags([]); setNote(""); }}
              style={{ marginTop: 24, padding: "12px 28px", borderRadius: 50, background: "linear-gradient(135deg, #FFA726, #FF8F00)", border: "none", color: "white", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}
            >
              再填一次
            </button>
          </div>
        )}
      </div>

      {/* Progress dots */}
      {step < 4 && (
        <div style={{ display: "flex", gap: 8, marginTop: 24 }}>
          {[0,1,2,3].map(i => (
            <div key={i} style={{ width: i === step ? 24 : 8, height: 8, borderRadius: 4, background: i === step ? "#FF8F00" : "#FFD180", transition: "all 0.3s" }}/>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Manager Dashboard ────────────────────────────────────────────────────────
function ManagerView({ entries }) {
  const [filterName, setFilterName] = useState("全部");
  const allNames = ["全部", ...Array.from(new Set(entries.map(e => e.name)))];

  const filtered = filterName === "全部" ? entries : entries.filter(e => e.name === filterName);

  // Stats
  const avgScore = filtered.length ? (filtered.reduce((s, e) => s + e.mood.score, 0) / filtered.length).toFixed(1) : 0;
  const lowMoods = filtered.filter(e => e.mood.score <= 2);
  const moodCounts = MOODS.map(m => ({ ...m, count: filtered.filter(e => e.mood.score === m.score).length }));

  return (
    <div style={{ minHeight: "100vh", background: "#FFF8E1", fontFamily: "'Noto Sans TC', sans-serif", padding: "24px 16px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
          <div style={{ fontSize: 36 }}>📊</div>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 900, color: "#E65100", margin: 0 }}>主管後台</h1>
            <p style={{ color: "#FF8F00", fontSize: 13, margin: 0 }}>新進人員心情總覽</p>
          </div>
        </div>

        {/* Alert: Low mood */}
        {lowMoods.length > 0 && (
          <div style={{ background: "#FBE9E7", border: "2px solid #FF7043", borderRadius: 16, padding: "14px 20px", marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 24 }}>⚠️</span>
            <div>
              <p style={{ color: "#E64A19", fontWeight: 700, margin: 0, fontSize: 15 }}>需要關注</p>
              <p style={{ color: "#FF7043", margin: 0, fontSize: 13 }}>
                {Array.from(new Set(lowMoods.map(e => e.name))).join("、")} 最近心情較低落，建議主動關心
              </p>
            </div>
          </div>
        )}

        {/* Stats cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 24 }}>
          {[
            { label: "平均心情分數", value: `${avgScore} / 5`, emoji: "💛" },
            { label: "本週記錄筆數", value: filtered.length, emoji: "📝" },
            { label: "需關注人數", value: Array.from(new Set(lowMoods.map(e => e.name))).length, emoji: "🫶" },
          ].map(card => (
            <div key={card.label} style={{ background: "white", borderRadius: 18, padding: "18px 14px", textAlign: "center", boxShadow: "0 4px 16px rgba(255,143,0,0.12)" }}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>{card.emoji}</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: "#E65100" }}>{card.value}</div>
              <div style={{ fontSize: 12, color: "#FF8F00", marginTop: 2 }}>{card.label}</div>
            </div>
          ))}
        </div>

        {/* Mood distribution */}
        <div style={{ background: "white", borderRadius: 20, padding: "20px", marginBottom: 20, boxShadow: "0 4px 16px rgba(255,143,0,0.1)" }}>
          <p style={{ fontWeight: 700, color: "#E65100", margin: "0 0 14px", fontSize: 16 }}>心情分布</p>
          <div style={{ display: "flex", gap: 8, alignItems: "flex-end", height: 80 }}>
            {moodCounts.map(m => {
              const max = Math.max(...moodCounts.map(x => x.count), 1);
              const h = Math.max((m.count / max) * 64, 4);
              return (
                <div key={m.score} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <span style={{ fontSize: 11, color: "#FF8F00", fontWeight: 600 }}>{m.count}</span>
                  <div style={{ width: "100%", height: h, background: m.color, borderRadius: "6px 6px 0 0", transition: "height 0.4s", opacity: 0.85 }}/>
                  <span style={{ fontSize: 18 }}>{m.emoji}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Filter */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
          {allNames.map(n => (
            <button key={n} onClick={() => setFilterName(n)} style={{ padding: "8px 16px", borderRadius: 50, border: "none", background: filterName === n ? "linear-gradient(135deg, #FFA726, #FF8F00)" : "#FFE0B2", color: filterName === n ? "white" : "#E65100", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>{n}</button>
          ))}
        </div>

        {/* Entries */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.slice().reverse().map(entry => (
            <div key={entry.id} style={{ background: "white", borderRadius: 18, padding: "16px 20px", boxShadow: "0 2px 12px rgba(255,143,0,0.08)", borderLeft: `4px solid ${entry.mood.color}`, display: "flex", gap: 16, alignItems: "flex-start" }}>
              <span style={{ fontSize: 32, flexShrink: 0 }}>{entry.mood.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <span style={{ fontWeight: 800, color: "#E65100", fontSize: 16 }}>{entry.name}</span>
                  <span style={{ fontSize: 12, color: "#FFB300" }}>{entry.date}</span>
                </div>
                <span style={{ display: "inline-block", background: entry.mood.bg, color: entry.mood.color, fontSize: 13, fontWeight: 600, padding: "3px 10px", borderRadius: 50, marginBottom: entry.tag || entry.notes ? 8 : 0 }}>{entry.mood.label}</span>
                {entry.tag && <span style={{ marginLeft: 6, background: "#FFF3E0", color: "#FF8F00", fontSize: 12, padding: "3px 10px", borderRadius: 50, fontWeight: 500 }}>#{entry.tag}</span>}
                {entry.notes && <p style={{ color: "#795548", fontSize: 14, margin: "8px 0 0", lineHeight: 1.6 }}>「{entry.notes}」</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState("employee"); // "employee" | "manager"
  const [entries, setEntries] = useState(generateSampleData());

  const handleSubmit = (entry) => {
    setEntries(prev => [...prev, { ...entry, id: Date.now() }]);
  };

  return (
    <div>
      {/* Tab switcher */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(255,253,231,0.95)", backdropFilter: "blur(8px)", borderBottom: "2px solid #FFD180", display: "flex", justifyContent: "center", gap: 0, padding: "10px 16px" }}>
        {[
          { key: "employee", label: "😊 員工端", },
          { key: "manager", label: "📊 主管後台" },
        ].map(tab => (
          <button key={tab.key} onClick={() => setView(tab.key)} style={{ padding: "9px 28px", borderRadius: 50, border: "none", background: view === tab.key ? "linear-gradient(135deg, #FFA726, #FF8F00)" : "transparent", color: view === tab.key ? "white" : "#FF8F00", fontWeight: 700, fontSize: 15, cursor: "pointer", transition: "all 0.2s", fontFamily: "'Noto Sans TC', sans-serif" }}>
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ paddingTop: 56 }}>
        {view === "employee" ? <EmployeeView onSubmit={handleSubmit} /> : <ManagerView entries={entries} />}
      </div>
    </div>
  );
}
