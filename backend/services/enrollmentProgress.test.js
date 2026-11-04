const assert = require('node:assert/strict');
const { test } = require('node:test');
const { deriveEnrollmentProgress } = require('./enrollmentProgress');

test('all completed lessons keep a completed enrollment complete', () => {
  const update = deriveEnrollmentProgress('COMPLETED', 4, 4);
  assert.equal(update.progress, 100);
  assert.equal(update.status, 'COMPLETED');
  assert.ok(update.completedAt instanceof Date);
});

test('lesson records, not a client supplied number, determine progress', () => {
  const update = deriveEnrollmentProgress('ACTIVE', 3, 4);
  assert.equal(update.progress, 75);
  assert.equal(update.status, undefined);
});

test('a completed enrollment reopens only when its derived lesson progress falls below 100', () => {
  const update = deriveEnrollmentProgress('COMPLETED', 2, 4);
  assert.equal(update.progress, 50);
  assert.equal(update.status, 'ACTIVE');
  assert.equal(update.completedAt, null);
});
