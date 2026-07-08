function getUsageWindowState(subscription, now = new Date()) {
  const safeSubscription = subscription || {};
  const limit = 3;
  let resetAt = safeSubscription.mockInterviewUsageResetAt
    ? new Date(safeSubscription.mockInterviewUsageResetAt)
    : null;
  let count = Number(safeSubscription.mockInterviewUsageCount || 0);

  const shouldReset = !resetAt || resetAt <= now;
  if (shouldReset) {
    resetAt = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    count = 0;
  }

  return {
    limit,
    count,
    resetAt,
    isResetRequired: shouldReset,
  };
}

function getNextResetDate(now = new Date()) {
  return new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0, 0);
}

module.exports = {
  getUsageWindowState,
  getNextResetDate,
};
