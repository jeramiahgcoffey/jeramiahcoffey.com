import { site } from "@/content/site";

export const SOCIAL_IMAGE_ALT =
  "Jeramiah Coffey, founding engineer building software for ABA therapy";

export function SocialImage() {
  return (
    <div
      style={{
        background: "#13110d",
        color: "#eee9df",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "space-between",
        padding: "72px 80px",
        position: "relative",
        width: "100%",
      }}
    >
      <div
        style={{
          border: "1px solid #3a352c",
          display: "flex",
          inset: 30,
          position: "absolute",
        }}
      />

      <div
        style={{
          alignItems: "center",
          color: "#999083",
          display: "flex",
          fontFamily: "monospace",
          fontSize: 24,
          justifyContent: "space-between",
        }}
      >
        <div style={{ alignItems: "center", display: "flex" }}>
          <span
            style={{
              background: "#6ea95e",
              borderRadius: 999,
              display: "flex",
              height: 14,
              marginRight: 12,
              width: 14,
            }}
          />
          jeramiah.localhost
        </div>
        <span>Denver, CO</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            color: "#c8a96a",
            display: "flex",
            fontFamily: "monospace",
            fontSize: 26,
            marginBottom: 20,
          }}
        >
          $ ./jeramiah --status
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 78,
            fontWeight: 700,
            letterSpacing: "-3px",
            lineHeight: 1,
          }}
        >
          {site.name}
        </div>
        <div
          style={{
            color: "#b9b1a5",
            display: "flex",
            fontSize: 34,
            marginTop: 24,
          }}
        >
          Founding engineer building software for ABA therapy.
        </div>
      </div>

      <div
        style={{
          borderTop: "1px solid #3a352c",
          color: "#999083",
          display: "flex",
          fontFamily: "monospace",
          fontSize: 22,
          justifyContent: "space-between",
          paddingTop: 24,
        }}
      >
        <span>healthtech / full stack / infrastructure</span>
        <span style={{ color: "#c8a96a" }}>{site.url.replace("https://", "")}</span>
      </div>
    </div>
  );
}
