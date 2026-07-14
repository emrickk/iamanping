import { test } from 'node:test';
import assert from 'node:assert/strict';
import { projects, articles, site } from '../src/data/site-content.ts';

test('site basics', () => {
  assert.equal(site.linkedin, 'https://www.linkedin.com/in/anpingwang/');
  assert.ok(site.blogBase.startsWith('https://theneverless.com'));
});

test('5 projects, all fields present', () => {
  assert.equal(projects.length, 5);
  for (const p of projects) {
    assert.ok(p.title.length > 0);
    assert.ok(p.paragraphs.length >= 1);
    assert.ok(p.paragraphs.every((s) => s.trim().length > 0));
    assert.match(p.blogUrl, /^https:\/\/theneverless\.com\/posts\/[a-z0-9-]+\/$/);
    assert.ok(p.image.endsWith('.png') || p.image.endsWith('.jpeg'));
    assert.equal(typeof p.pending, 'boolean');
  }
});

test('9 articles, dated, sorted newest first, with card fields', () => {
  assert.equal(articles.length, 9);
  for (const a of articles) {
    assert.ok(a.title.length > 0);
    assert.ok(a.summary.length > 10 && a.summary.length < 200);
    assert.ok(Number.isInteger(a.minutes) && a.minutes >= 1 && a.minutes <= 15);
    assert.match(a.date, /^\d{4}-\d{2}-\d{2}$/);
    assert.match(a.blogUrl, /^https:\/\/theneverless\.com\/posts\/[a-z0-9-]+\/$/);
  }
  const dates = articles.map((a) => a.date);
  assert.deepEqual(dates, [...dates].sort().reverse());
});

test('blog URLs are unique across projects and articles', () => {
  const slugs = [...projects, ...articles].map((x) => x.blogUrl);
  assert.equal(new Set(slugs).size, slugs.length, 'duplicate blogUrl');
});

test('no zero-width characters in copy', () => {
  const all = JSON.stringify({ projects, articles });
  assert.ok(!all.includes('​'));
});
