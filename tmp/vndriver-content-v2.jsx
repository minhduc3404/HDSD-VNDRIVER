import { useState } from "react";

const C = {
  navy: "#1A2B4A",
  amber: "#F59E0B",
  amberLt: "#FEF3C7",
  green: "#15803D",
  greenLt: "#D1FAE5",
  red: "#DC2626",
  redLt: "#FEE2E2",
  blue: "#2563EB",
  gray50: "#F9FAFB",
  gray100: "#F3F4F6",
  gray200: "#E5E7EB",
  gray400: "#9CA3AF",
  gray600: "#4B5563",
  gray800: "#1F2937",
  white: "#FFFFFF",
};

// ── REAL CONTENT: Cài đặt App VnDriver ────────────────────────
const INSTALL_ARTICLE = {
  title: "Cài đặt App VnDriver",
  time: "2 phút",
  platform: "android", // toggle
  steps_android: [
    {
      text: "Mở CH Play, tìm \"vndriver\"",
      screen: "Tìm kiếm VnDriver trên CH Play",
    },
    {
      text: "Bấm Cài đặt → đợi tải xong → bấm Mở",
      screen: "Cài đặt App VnDriver",
    },
    {
      text: "Cho phép tất cả quyền app yêu cầu",
      screen: "Cấp quyền cho VnDriver",
      warn: "Quyền Vị trí → chọn \"Luôn luôn cho phép\"",
    },
    {
      text: "Tắt tiết kiệm pin cho VnDriver",
      sub: "Cài đặt → Pin → VnDriver → Không hạn chế",
      screen: "Cài đặt pin cho App",
      warn: "Bắt buộc — nếu không app sẽ bị tắt khi khóa màn hình",
    },
  ],
  steps_ios: [
    {
      text: "Mở App Store, tìm \"vndriver\"",
      screen: "Tìm kiếm VnDriver trên App Store",
    },
    {
      text: "Bấm Nhận → đợi tải xong → bấm Mở",
      screen: "Cài đặt App VnDriver iOS",
    },
    {
      text: "Cho phép tất cả quyền app yêu cầu",
      screen: "Cấp quyền cho VnDriver iOS",
      warn: "Quyền Vị trí → chọn \"Luôn luôn\"",
    },
  ],
  done: "Xong — mở app, đăng nhập tài khoản được cấp.",
};

// ── Components ─────────────────────────────────────────────────

function Step({ index, step, total }) {
  return (
    <div style={{ padding: "14px 16px", borderBottom: index < total - 1 ? `1px solid ${C.gray100}` : "none" }}>
      {/* Step number + action */}
      <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
        <div style={{
          flexShrink: 0, width: 26, height: 26, borderRadius: "50%",
          background: C.navy, color: C.white,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 13, fontWeight: 800,
        }}>
          {index + 1}
        </div>
        <div style={{ flex: 1, paddingTop: 2 }}>
          <p style={{
            margin: 0, fontSize: 15, fontWeight: 700,
            color: C.gray800, lineHeight: 1.4,
          }}>
            {step.text}
          </p>
          {step.sub && (
            <p style={{
              margin: "4px 0 0", fontSize: 13, color: C.gray600, lineHeight: 1.4,
            }}>
              {step.sub}
            </p>
          )}
        </div>
      </div>

      {/* Warning inline */}
      {step.warn && (
        <div style={{
          marginTop: 8, marginLeft: 36,
          background: C.amberLt,
          borderRadius: 8, padding: "7px 10px",
          display: "flex", gap: 6, alignItems: "flex-start",
        }}>
          <span style={{ fontSize: 12 }}>⚠️</span>
          <span style={{ fontSize: 12, color: "#92400E", fontWeight: 600, lineHeight: 1.4 }}>
            {step.warn}
          </span>
        </div>
      )}

      {/* Image placeholder */}
      {step.screen && (
        <div style={{
          marginTop: 8, marginLeft: 36,
          background: C.gray100, borderRadius: 10,
          padding: "28px 12px", textAlign: "center",
          border: `1px dashed ${C.gray200}`,
        }}>
          <span style={{ fontSize: 22 }}>📱</span>
          <p style={{ margin: "4px 0 0", fontSize: 11, color: C.gray400 }}>
            {step.screen}
          </p>
        </div>
      )}
    </div>
  );
}

function ArticleScreen({ article }) {
  const [platform, setPlatform] = useState("android");
  const steps = platform === "android" ? article.steps_android : article.steps_ios;

  return (
    <div style={{
      background: C.white, minHeight: "100%",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    }}>
      {/* Top bar */}
      <div style={{
        background: C.navy, padding: "10px 14px",
        display: "flex", alignItems: "center", gap: 10,
        position: "sticky", top: 0, zIndex: 10,
      }}>
        <span style={{ color: C.white, fontSize: 16 }}>‹</span>
        <span style={{ color: C.white, fontSize: 14, fontWeight: 600, flex: 1 }}>
          Trợ giúp
        </span>
      </div>

      {/* Title block */}
      <div style={{ padding: "16px 16px 12px" }}>
        <h1 style={{
          margin: 0, fontSize: 20, fontWeight: 800,
          color: C.gray800, lineHeight: 1.2,
        }}>
          {article.title}
        </h1>
        <p style={{ margin: "4px 0 0", fontSize: 12, color: C.gray400 }}>
          ⏱ {article.time}
        </p>
      </div>

      {/* Platform toggle */}
      <div style={{ padding: "0 16px 12px", display: "flex", gap: 8 }}>
        {["android", "ios"].map(p => (
          <button
            key={p}
            onClick={() => setPlatform(p)}
            style={{
              flex: 1, padding: "9px 0", borderRadius: 8, border: "none",
              fontSize: 13, fontWeight: 700, cursor: "pointer",
              background: platform === p ? C.navy : C.gray100,
              color: platform === p ? C.white : C.gray600,
              transition: "all 0.15s",
            }}
          >
            {p === "android" ? "Android" : "iPhone"}
          </button>
        ))}
      </div>

      {/* Steps */}
      <div style={{
        background: C.white,
        borderTop: `1px solid ${C.gray100}`,
      }}>
        {steps.map((step, i) => (
          <Step key={i} index={i} step={step} total={steps.length} />
        ))}
      </div>

      {/* Done */}
      <div style={{
        margin: "12px 16px", padding: "12px 14px",
        background: C.greenLt, borderRadius: 10,
        display: "flex", gap: 8, alignItems: "center",
      }}>
        <span style={{ fontSize: 16 }}>✅</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: C.green, lineHeight: 1.4 }}>
          {article.done}
        </span>
      </div>

      {/* Stuck? */}
      <div style={{
        margin: "4px 16px 20px", padding: "12px 14px",
        background: C.gray50, borderRadius: 10,
        border: `1px solid ${C.gray200}`,
        textAlign: "center",
      }}>
        <p style={{ margin: 0, fontSize: 13, color: C.gray600 }}>
          Bị kẹt? Gọi tổng đài <strong style={{ color: C.navy }}>1900 xxxx</strong>
        </p>
      </div>
    </div>
  );
}

// ── SCHEMA PANEL ───────────────────────────────────────────────

function SchemaView() {
  const schema = [
    { field: "title", desc: "Tên bài — viết bằng ngôn ngữ tài xế", ex: "\"Cài đặt App VnDriver\"" },
    { field: "time", desc: "Ước lượng thời gian đọc", ex: "\"2 phút\"" },
    { field: "steps[]", desc: "Mảng các bước, tối đa 5", ex: null },
    { field: "  .text", desc: "Hành động — câu lệnh ngắn, bắt đầu bằng động từ", ex: "\"Mở CH Play, tìm vndriver\"" },
    { field: "  .sub", desc: "Hướng dẫn phụ nếu cần, 1 dòng", ex: "\"Cài đặt → Pin → Không hạn chế\"" },
    { field: "  .warn", desc: "Cảnh báo gắn liền bước đó", ex: "\"Bắt buộc — nếu không app bị tắt\"" },
    { field: "  .screen", desc: "Caption cho ảnh minh họa", ex: "\"Cấp quyền cho VnDriver\"" },
    { field: "done", desc: "Kết quả khi hoàn thành — 1 câu", ex: "\"Xong — mở app, đăng nhập.\"" },
  ];

  return (
    <div style={{
      background: "#111827", borderRadius: 14, padding: "20px 20px",
      fontFamily: "ui-monospace, 'SF Mono', monospace",
      maxWidth: 500, width: "100%",
    }}>
      <p style={{
        margin: "0 0 14px", fontSize: 11, fontWeight: 700,
        color: C.amber, textTransform: "uppercase", letterSpacing: "0.08em",
        fontFamily: "-apple-system, sans-serif",
      }}>
        Cấu trúc dữ liệu 1 bài Task Guide
      </p>

      {schema.map((row, i) => (
        <div key={i} style={{
          padding: "6px 0",
          borderBottom: i < schema.length - 1 ? "1px solid #1F2937" : "none",
          display: "flex", gap: 10, alignItems: "baseline",
        }}>
          <code style={{
            fontSize: 12, color: "#67E8F9", flexShrink: 0,
            minWidth: row.field.startsWith("  ") ? undefined : 70,
          }}>
            {row.field}
          </code>
          <span style={{
            fontSize: 11, color: "#94A3B8", flex: 1, lineHeight: 1.5,
            fontFamily: "-apple-system, sans-serif",
          }}>
            {row.desc}
            {row.ex && (
              <span style={{ display: "block", color: "#6B7280", marginTop: 2, fontSize: 10 }}>
                vd: {row.ex}
              </span>
            )}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── WRITING RULES PANEL ────────────────────────────────────────

function RulesView() {
  const rules = [
    {
      do_: "Mở CH Play, tìm \"vndriver\"",
      dont: "Tài xế truy cập vào CH Play (đối với android), tìm kiếm \"vndriver\" sau đó cài đặt ứng dụng về điện thoại của mình",
      rule: "Bỏ chủ ngữ. Bắt đầu bằng động từ.",
    },
    {
      do_: "Bấm Cài đặt → đợi tải xong → bấm Mở",
      dont: "Click chọn vào ứng dụng VnDriver, sau đó chọn vào \"Cài đặt\" và đợi ứng dụng tải về thiết bị",
      rule: "Dùng mũi tên → nối hành động liên tiếp.",
    },
    {
      do_: "Quyền Vị trí → chọn \"Luôn luôn cho phép\"",
      dont: "Kiểm tra lại cài đặt cấp quyền trên ứng dụng: bật luôn luôn cho phép truy cập vị trí, tắt tạm dừng hoạt động nếu không dùng",
      rule: "1 cảnh báo = 1 ý. Tách ra nếu 2 ý.",
    },
    {
      do_: "Xong — mở app, đăng nhập.",
      dont: "Sau khi đã cài đặt xong ứng dụng, chọn vào mục \"Mở\" để truy cập vào ứng dụng.",
      rule: "Kết thúc bằng kết quả, không lặp lại bước.",
    },
  ];

  return (
    <div style={{
      background: "#111827", borderRadius: 14, padding: "20px 20px",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      maxWidth: 500, width: "100%",
    }}>
      <p style={{
        margin: "0 0 16px", fontSize: 11, fontWeight: 700,
        color: C.amber, textTransform: "uppercase", letterSpacing: "0.08em",
      }}>
        Quy tắc viết — Before / After thực tế
      </p>

      {rules.map((r, i) => (
        <div key={i} style={{
          marginBottom: 16,
          paddingBottom: 16,
          borderBottom: i < rules.length - 1 ? "1px solid #1E293B" : "none",
        }}>
          {/* Rule */}
          <p style={{
            margin: "0 0 8px", fontSize: 12, fontWeight: 700,
            color: "#93C5FD", lineHeight: 1.4,
          }}>
            📐 {r.rule}
          </p>

          {/* Don't */}
          <div style={{
            background: "#1C1917", borderLeft: `3px solid ${C.red}`,
            borderRadius: "0 8px 8px 0", padding: "8px 10px", marginBottom: 6,
          }}>
            <span style={{ fontSize: 10, color: "#EF4444", fontWeight: 700, display: "block", marginBottom: 3 }}>
              ✗ CŨ
            </span>
            <span style={{ fontSize: 12, color: "#A8A29E", lineHeight: 1.5 }}>
              {r.dont}
            </span>
          </div>

          {/* Do */}
          <div style={{
            background: "#052E16", borderLeft: `3px solid ${C.green}`,
            borderRadius: "0 8px 8px 0", padding: "8px 10px",
          }}>
            <span style={{ fontSize: 10, color: "#4ADE80", fontWeight: 700, display: "block", marginBottom: 3 }}>
              ✓ MỚI
            </span>
            <span style={{ fontSize: 13, color: "#BBF7D0", lineHeight: 1.5, fontWeight: 600 }}>
              {r.do_}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── MAIN ───────────────────────────────────────────────────────

export default function App() {
  const [tab, setTab] = useState("preview");

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0F172A",
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "24px 16px",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 20, maxWidth: 500 }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: C.white }}>
          Bộ khung nội dung VnDriver
        </h2>
        <p style={{ margin: "6px 0 0", fontSize: 13, color: C.gray400, lineHeight: 1.5 }}>
          Ví dụ thực tế: bài "Cài đặt App" viết lại từ tài liệu gốc
        </p>
      </div>

      {/* Tabs */}
      <div style={{
        display: "flex", gap: 0, marginBottom: 20,
        background: "#1E293B", borderRadius: 10, padding: 3,
      }}>
        {[
          { id: "preview", label: "📱 Preview" },
          { id: "schema",  label: "📦 Cấu trúc" },
          { id: "rules",   label: "📐 Quy tắc viết" },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: "8px 16px", borderRadius: 7, border: "none", cursor: "pointer",
            fontSize: 12, fontWeight: 600, transition: "all 0.15s",
            background: tab === t.id ? C.white : "transparent",
            color: tab === t.id ? C.navy : C.gray400,
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Content area */}
      {tab === "preview" && (
        <div style={{
          width: 375, background: "#111827",
          borderRadius: 40, padding: "12px 6px",
          boxShadow: "0 30px 80px rgba(0,0,0,0.6), inset 0 0 0 2px #374151",
        }}>
          <div style={{
            width: 120, height: 24, background: "#111827",
            borderRadius: 12, margin: "0 auto 8px",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#1F2937" }} />
            <div style={{ width: 40, height: 8, borderRadius: 4, background: "#1F2937" }} />
          </div>
          <div style={{
            borderRadius: 28, overflow: "hidden",
            height: 680, overflowY: "auto",
            background: C.white,
            scrollbarWidth: "none",
          }}>
            <ArticleScreen article={INSTALL_ARTICLE} />
          </div>
          <div style={{
            width: 120, height: 4, borderRadius: 2,
            background: "#374151", margin: "10px auto 0",
          }} />
        </div>
      )}

      {tab === "schema" && <SchemaView />}
      {tab === "rules" && <RulesView />}
    </div>
  );
}
