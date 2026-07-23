import { describe, it, expect } from "vitest";
import { cardMotionProps } from "../shop-by-category";

describe("cardMotionProps", () => {
  it("active card (distance 0) gets full opacity, scale 1.12, zIndex 10", () => {
    const props = cardMotionProps(0);
    expect(props.scale).toBe(1.12);
    expect(props.opacity).toBe(1);
    expect(props.zIndex).toBe(10);
  });

  it("adjacent card (distance 1) gets opacity 0.75, scale 1.0, zIndex 5", () => {
    const props = cardMotionProps(1);
    expect(props.scale).toBe(1.0);
    expect(props.opacity).toBe(0.75);
    expect(props.zIndex).toBe(5);
  });

  it("adjacent card (distance -1) gets same treatment as distance 1", () => {
    const props = cardMotionProps(-1);
    expect(props.scale).toBe(1.0);
    expect(props.opacity).toBe(0.75);
    expect(props.zIndex).toBe(5);
  });

  it("outer card (distance 2) gets opacity 0.5, scale 0.9, zIndex 1", () => {
    const props = cardMotionProps(2);
    expect(props.scale).toBe(0.9);
    expect(props.opacity).toBe(0.5);
    expect(props.zIndex).toBe(1);
  });

  it("outer card (distance -2) gets same treatment as distance 2", () => {
    const props = cardMotionProps(-2);
    expect(props.scale).toBe(0.9);
    expect(props.opacity).toBe(0.5);
    expect(props.zIndex).toBe(1);
  });
});
