const test = require("node:test");
const assert = require("node:assert/strict");
const { getUsageWindowState } = require("../src/utils/usageLimits");

test("resets free-tier usage when the month changes", () => {
  const subscription = {
    plan: "FREE",
    mockInterviewUsageCount: 3,
    mockInterviewUsageResetAt: new Date("2024-01-01T00:00:00.000Z"),
  };

  const state = getUsageWindowState(
    subscription,
    new Date("2024-02-01T00:00:00.000Z"),
  );

  assert.equal(state.isResetRequired, true);
  assert.equal(state.count, 0);
  assert.equal(state.limit, 3);
});

test("keeps the current month usage count intact before the limit is reached", () => {
  const subscription = {
    plan: "FREE",
    mockInterviewUsageCount: 2,
    mockInterviewUsageResetAt: new Date("2024-02-01T00:00:00.000Z"),
  };

  const state = getUsageWindowState(
    subscription,
    new Date("2024-02-10T00:00:00.000Z"),
  );

  assert.equal(state.isResetRequired, false);
  assert.equal(state.count, 2);
  assert.equal(state.limit, 3);
});
