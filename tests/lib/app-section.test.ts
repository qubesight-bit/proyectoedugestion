import { describe, expect, it } from "vitest";
import { APP_SECTIONS, savedView } from "@/lib/app-section";

describe("persistencia de sección", () => {
  it.each(APP_SECTIONS)("restaura %s después de una recarga", (section) => {
    localStorage.setItem("edugestion:app-section", section);
    expect(savedView(localStorage.getItem("edugestion:app-section"))).toBe(section);
  });
  it("ignora valores inexistentes o corruptos", () => {
    expect(savedView("/app/privado")).toBe("home");
    expect(savedView(null)).toBe("home");
  });
});
