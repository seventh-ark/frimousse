import { describe, expect, it } from "vitest";
import { createUserId } from "../create-user-id";

function generateRandomIp() {
  const octet1 = Math.floor(Math.random() * 223) + 1;
  const octet2 = Math.floor(Math.random() * 256);
  const octet3 = Math.floor(Math.random() * 256);
  const octet4 = Math.floor(Math.random() * 256);

  return `${octet1}.${octet2}.${octet3}.${octet4}`;
}

describe("createUserId", () => {
  it("should generate consistent user IDs for the same IP", () => {
    const userId1 = createUserId("127.0.0.1");
    const userId2 = createUserId("127.0.0.1");

    expect(userId1).toBe(userId2);
  });

  it("should generate different user IDs for different IPs", () => {
    const userId1 = createUserId("127.0.0.1");
    const userId2 = createUserId("192.168.1.1");

    expect(userId1).not.toBe(userId2);
  });

  it("should generate different user IDs for the same IP with different salts", () => {
    const ip = "127.0.0.1";

    const userId1 = createUserId(ip, "123");
    const userId2 = createUserId(ip, "456");

    expect(userId1).not.toBe(userId2);
  });

  it("should have minimal conflicts", () => {
    const samples = 100000;
    const userIds = new Set<string>();
    const conflicts: Array<{ ip: string; userId: string }> = [];

    for (const ip of Array.from({ length: samples }, generateRandomIp)) {
      const userId = createUserId(ip);

      if (userIds.has(userId)) {
        conflicts.push({ ip, userId });
      } else {
        userIds.add(userId);
      }
    }

    // Less than 0.1% chance of conflict
    expect(conflicts.length / samples).toBeLessThan(0.001);
  });
});
