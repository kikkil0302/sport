import { describe, expect, it } from "vitest";
import {
  CATALOG_EXERCISES,
  getProgramTemplate,
  PROGRAM_TEMPLATES,
  templateSetCount,
} from "./templates";

describe("PROGRAM_TEMPLATES", () => {
  it("has unique ids", () => {
    const ids = PROGRAM_TEMPLATES.map((template) => template.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("only references exercises from the built-in catalog", () => {
    for (const template of PROGRAM_TEMPLATES) {
      for (const { exercise } of template.exercises) {
        expect(CATALOG_EXERCISES, `${template.id} → ${exercise}`).toHaveProperty(
          exercise,
        );
      }
    }
  });

  it("keeps sets and reps within the backend's accepted ranges", () => {
    for (const template of PROGRAM_TEMPLATES) {
      expect(template.exercises.length).toBeGreaterThan(0);
      for (const { sets, reps } of template.exercises) {
        expect(sets).toBeGreaterThanOrEqual(1);
        expect(sets).toBeLessThanOrEqual(6);
        expect(reps).toBeGreaterThanOrEqual(1);
        expect(reps).toBeLessThanOrEqual(200);
      }
    }
  });

  it("muscle templates target their muscle group", () => {
    const focus: Record<string, string[]> = {
      pectoraux: ["Pectoraux"],
      dos: ["Dos"],
      epaules: ["Épaules"],
      jambes: ["Jambes"],
      bras: ["Biceps", "Triceps"],
      abdominaux: ["Abdominaux"],
    };
    for (const [id, groups] of Object.entries(focus)) {
      const template = getProgramTemplate(id);
      expect(template, id).toBeDefined();
      for (const { exercise } of template!.exercises) {
        expect(groups, `${id} → ${exercise}`).toContain(
          CATALOG_EXERCISES[exercise],
        );
      }
    }
  });

  it("counts total working sets", () => {
    const fullBody = getProgramTemplate("full-body")!;
    expect(templateSetCount(fullBody)).toBe(3 + 3 + 3 + 2 + 3);
  });
});
