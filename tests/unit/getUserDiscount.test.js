import { describe, test, expect, vi } from "vitest";
import { getUserDiscount } from "../../src/services/getUserDiscount.js";

describe("getUserDiscount", () => {
  test("Receive a 20% discount refund for gold level users.", () => {
    const userId = 1;
    const userRepository = {
      findById: vi.fn().mockReturnValue({ id: 1, membership: "gold" }),
    };

    const discount = getUserDiscount(userId, userRepository);

    expect(discount).toBe(20);
  });

  test("A 10% discount will be given back to Silver level users.", () => {
    const userId = 2;
    const userRepository = {
      findById: vi.fn().mockReturnValue({ id: 2, membership: "silver" }),
    };

    const discount = getUserDiscount(userId, userRepository);

    expect(discount).toBe(10);
  });

  test("Refund 0 discount for basic level users.", () => {
    const userId = 3;
    const userRepository = {
      findById: vi.fn().mockReturnValue({ id: 3, membership: "basic" }),
    };

    const discount = getUserDiscount(userId, userRepository);

    expect(discount).toBe(0);
  });

  test("Throw error when user (null) is not found.", () => {
    const userId = 999;
    const userRepository = {
      findById: vi.fn().mockReturnValue(null),
    };

    expect(() => getUserDiscount(userId, userRepository)).toThrow(
      "ไม่พบ user นี้ในระบบ"
    );
  });

  test("Throw error when user (undefined) is not found.", () => {
    const userId = 1000;
    const userRepository = {
      findById: vi.fn().mockReturnValue(undefined),
    };

    expect(() => getUserDiscount(userId, userRepository)).toThrow(
      "ไม่พบ user นี้ในระบบ"
    );
  });

  test("Call findById with the correct userId only once.", () => {
    const userId = 5;
    const userRepository = {
      findById: vi.fn().mockReturnValue({ id: 5, membership: "silver" }),
    };

    getUserDiscount(userId, userRepository);

    expect(userRepository.findById).toHaveBeenCalledWith(5);
    expect(userRepository.findById).toHaveBeenCalledTimes(1);
  });
});
