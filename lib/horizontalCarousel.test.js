import assert from "node:assert/strict";
import {
  clampCarouselIndex,
  getCarouselSlideIndex,
} from "./horizontalCarousel.js";

assert.equal(clampCarouselIndex(0, 3, 1), 1);
assert.equal(clampCarouselIndex(0, 2, 1), 1);
assert.equal(clampCarouselIndex(3, 0, 1), 2);
assert.equal(clampCarouselIndex(2, 3, 1), 3);
assert.equal(clampCarouselIndex(2, 1, 1), 1);
assert.equal(clampCarouselIndex(4, 4, 1), 4);
assert.equal(clampCarouselIndex(1, 1, 1), 1);

/** @type {HTMLDivElement} */
const mockTrack = {
  clientWidth: 100,
  scrollWidth: 500,
  scrollLeft: 0,
};

assert.equal(getCarouselSlideIndex(mockTrack), 0);

mockTrack.scrollLeft = 34;
assert.equal(getCarouselSlideIndex(mockTrack), 0);

mockTrack.scrollLeft = 36;
assert.equal(getCarouselSlideIndex(mockTrack), 1);

mockTrack.scrollLeft = 250;
assert.equal(getCarouselSlideIndex(mockTrack), 3);

mockTrack.scrollLeft = 450;
assert.equal(getCarouselSlideIndex(mockTrack, { indexThreshold: 0.58 }), 4);

console.log("horizontalCarousel.test.js: ok");
