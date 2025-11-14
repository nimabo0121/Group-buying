// utils/parseMag.js
export function parseMag60(raw) {
  return {
    // branch: raw.slice(0, 3),
    suject: raw.slice(3, 5),
    PB_ACNO: raw.slice(0, 12),
    PB_PG: raw.slice(12, 14),
    BAL_RAW:
      raw.slice(14, 27).replace(/\s+/g, "") == ".00"
        ? "0.00"
        : raw.slice(14, 27).replace(/\s+/g, ""),
    // .replace(/:/g, "").replace("=", "."),
    PB_SEQ: raw.slice(27, 28),
    FILLER: raw.slice(28, 60),
  };
}
export function TCBBAccount12(raw) {
  return {
    suject: raw.slice(3, 5),
  };
}
