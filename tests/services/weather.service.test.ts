import { describe, expect, it } from "vitest";
import { weatherDescription } from "@/services/external/weather.service";

describe("weatherDescription", () => {
  it("convierte códigos externos en etiquetas comprensibles", () => {
    expect(weatherDescription(0)).toBe("Despejado");
    expect(weatherDescription(61)).toBe("Lluvia");
    expect(weatherDescription(95)).toBe("Tormenta");
  });

  it("conserva una etiqueta segura para códigos desconocidos", () => {
    expect(weatherDescription(999)).toBe("Tormenta");
    expect(weatherDescription(49)).toBe("Condiciones variables");
  });
});
