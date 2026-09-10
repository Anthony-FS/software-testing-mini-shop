import { describe, test, expect } from "vitest";
import { calculateTotal } from "../../src/utils/calculateTotal.js";


describe("calculateTotal", () => {
  test("The total price is calculated correctly when the quantity is greater than 1.", () => {
    const price = 100;
    const quantity = 3;

    const total = calculateTotal(price, quantity);

    expect(total).toBe(300);
  });

  test("The total price is calculated correctly when the quantity is 1.", () => {
    const price = 100;
    const quantity = 1;

    const total = calculateTotal(price, quantity);

    expect(total).toBe(100);
  });

  test("Returns 0 when price is 0 but quantity is correct.", () => {
    const price = 0;
    const quantity = 5;

    const total = calculateTotal(price, quantity);

    expect(total).toBe(0);
  });

  test("Returns 0 when quantity is 0.", () => {
    const price = 100;
    const quantity = 0;

    const total = calculateTotal(price, quantity);

    expect(total).toBe(0);
  });

  test("Returns 0 when quantity is less than 0.", () => {
    const price = 100;
    const quantity = -2;

    const total = calculateTotal(price, quantity);

    expect(total).toBe(0);
  });

  test("Throw error when price is negative.", () => {
    const price = -10;
    const quantity = 2;

    const act = () => calculateTotal(price, quantity);

    expect(act).toThrow("ราคาต้องไม่ติดลบ");
  });
});