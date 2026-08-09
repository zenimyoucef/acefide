import { describe, expect, it } from "vitest";
import { ALGERIA_WILAYAS } from "./algeria-wilayas";

describe("ALGERIA_WILAYAS", () => {
  it("provides all 69 unique wilayas in official numeric order", () => {
    expect(ALGERIA_WILAYAS).toHaveLength(69);
    expect(new Set(ALGERIA_WILAYAS).size).toBe(69);
    expect(ALGERIA_WILAYAS.slice(58)).toEqual([
      "ولاية آفلو",
      "ولاية بريكة",
      "ولاية القنطرة",
      "ولاية بئر العاتر",
      "ولاية العريشة",
      "ولاية قصر الشلالة",
      "ولاية عين وسارة",
      "ولاية مسعد",
      "ولاية قصر البخاري",
      "ولاية بوسعادة",
      "ولاية الأبيض سيدي الشيخ",
    ]);
  });
});
