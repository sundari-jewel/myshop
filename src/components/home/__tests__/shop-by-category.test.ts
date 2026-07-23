import { describe, it, expect } from "vitest";
import { cardMotionProps } from "../shop-by-category";

describe("cardMotionProps", () => {
  it("active card (distance 0) gets full width and full opacity", () => {
    const props = cardMotionProps(0);
    expect(props.width).toBe(540);
    expect(props.opacity).toBe(1);
  });

  it("adjacent card (distance 1) gets reduced width and partial opacity", () => {
    const props = cardMotionProps(1);
    expect(props.width).toBe(190);
    expect(props.opacity).toBe(0.82);
  });

  it("adjacent card (distance -1) gets same treatment as distance 1", () => {
    const props = cardMotionProps(-1);
    expect(props.width).toBe(190);
    expect(props.opacity).toBe(0.82);
  });

  it("outer card (distance 2) gets minimum width and low opacity", () => {
    const props = cardMotionProps(2);
    expect(props.width).toBe(120);
    expect(props.opacity).toBe(0.55);
  });

  it("outer card (distance -2) gets same treatment as distance 2", () => {
    const props = cardMotionProps(-2);
    expect(props.width).toBe(120);
    expect(props.opacity).toBe(0.55);
  });
});
