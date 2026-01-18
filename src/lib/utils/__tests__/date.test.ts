import {
  formatDate,
  formatOffsetForApi,
  formatTime,
  getDelayMinutes,
  isServiceDelayed,
  parseTimeToMinutes,
} from "@/lib/utils/date";

describe("date utils", () => {
  describe("formatDate", () => {
    it("formats date as YYYY-MM-DD", () => {
      const date = new Date("2026-01-19T12:00:00Z");
      expect(formatDate(date)).toBe("2026-01-19");
    });
  });

  describe("formatTime", () => {
    it("formats time as HH:MM", () => {
      const date = new Date("2026-01-19T14:35:00");
      expect(formatTime(date)).toBe("14:35");
    });
  });

  describe("formatOffsetForApi", () => {
    it("formats positive offset correctly", () => {
      expect(formatOffsetForApi(90)).toBe("PT01:30:00");
    });

    it("formats negative offset correctly", () => {
      expect(formatOffsetForApi(-30)).toBe("-PT00:30:00");
    });
  });

  describe("parseTimeToMinutes", () => {
    it("parses time string to minutes", () => {
      expect(parseTimeToMinutes("14:30")).toBe(870); // 14*60 + 30
      expect(parseTimeToMinutes("00:00")).toBe(0);
      expect(parseTimeToMinutes("23:59")).toBe(1439);
    });
  });

  describe("isServiceDelayed", () => {
    it("returns true when expected is later than aimed", () => {
      expect(isServiceDelayed("14:30", "14:35")).toBe(true);
    });

    it("returns false when on time", () => {
      expect(isServiceDelayed("14:30", "14:30")).toBe(false);
    });

    it("returns false when early", () => {
      expect(isServiceDelayed("14:30", "14:25")).toBe(false);
    });
  });

  describe("getDelayMinutes", () => {
    it("calculates delay correctly", () => {
      expect(getDelayMinutes("14:30", "14:35")).toBe(5);
      expect(getDelayMinutes("14:30", "14:30")).toBe(0);
      expect(getDelayMinutes("14:30", "14:25")).toBe(-5);
    });
  });
});
