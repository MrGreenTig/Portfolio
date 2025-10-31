const test = require('node:test');
const assert = require('node:assert/strict');

const { getVisibleCards } = require('../sliderUtils');

test('returns 1 card for viewports narrower than 600px', () => {
  assert.equal(getVisibleCards(320), 1);
  assert.equal(getVisibleCards(599), 1);
});

test('returns the expected number of cards for wider screens', () => {
  assert.equal(getVisibleCards(600), 2);
  assert.equal(getVisibleCards(800), 2);
  assert.equal(getVisibleCards(900), 3);
  assert.equal(getVisibleCards(1199), 3);
  assert.equal(getVisibleCards(1200), 4);
  assert.equal(getVisibleCards(1600), 4);
});

test('handles boundary values consistently', () => {
  assert.equal(getVisibleCards(599.9), 1);
  assert.equal(getVisibleCards(600), 2);
  assert.equal(getVisibleCards(899.9), 2);
  assert.equal(getVisibleCards(900), 3);
  assert.equal(getVisibleCards(1199.9), 3);
  assert.equal(getVisibleCards(1200), 4);
});
