import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { toggleMenu, closeMenuOnLink } from '../src/navigation.js';
import { getSlideIndex } from '../src/gallery.js';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');

test('menu opens and closes from its accessible expanded state', () => {
  assert.equal(toggleMenu('false'), true);
  assert.equal(toggleMenu('true'), false);
  assert.equal(toggleMenu(null), true);
});

test('only navigation links trigger closing', () => {
  assert.equal(closeMenuOnLink(null), false);
  assert.equal(closeMenuOnLink({ href: '#visit' }), true);
});

test('every internal anchor points to an existing section', () => {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(ids.length, new Set(ids).size, 'IDs must be unique');
  for (const [, target] of html.matchAll(/href="#([^"]+)"/g)) {
    assert.ok(ids.includes(target), `Missing anchor target: ${target}`);
  }
});

test('published content preserves legal identity and confirmed public details', () => {
  for (const content of ['Heavenly Hope Church Incorporated', 'Heavenly Hope Apostolic Church', '1 Everton Road', 'Rooms 2 &amp; 3', '2019', 'Fines Victoria', 'Christmas Box', 'Every Sunday at 11:30am']) {
    assert.ok(html.includes(content), `Missing supplied content: ${content}`);
  }
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
  assert.ok(html.includes('lang="en-AU"'));
  assert.ok(!html.includes('<form'), 'Do not offer a contact form without a backend');
});

test('carousel moves forward, backward and wraps at either end', () => {
  assert.equal(getSlideIndex(0, 1, 6), 1);
  assert.equal(getSlideIndex(5, 1, 6), 0);
  assert.equal(getSlideIndex(0, -1, 6), 5);
  assert.equal(getSlideIndex(2, -15, 6), 5);
  assert.equal(getSlideIndex(0, 1, 1), 0);
  assert.throws(() => getSlideIndex(0, 1, 0), RangeError);
  assert.throws(() => getSlideIndex(0.5, 1, 6), TypeError);
});

test('gallery has eleven distinct local photos and one initially visible slide', async () => {
  const slides = [...html.matchAll(/<figure class="photo-slide"([^>]*)>/g)];
  assert.equal(slides.length, 11);
  slides.forEach(([, attributes], index) => {
    assert.ok(attributes.includes(`aria-label="${index + 1} of 11"`));
  });
  assert.equal(slides.filter(([, attributes]) => !attributes.includes('hidden')).length, 1);
  const paths = [...html.matchAll(/<img[^>]*src="(\/images\/church\/[^"]+)"[^>]*alt="([^"]+)"/g)];
  assert.equal(paths.length, 11);
  assert.equal(new Set(paths.map(([, path]) => path)).size, 11);
  const bytes = [];
  for (const [, path, alt] of paths) {
    assert.ok(alt.length > 20);
    const photo = await readFile(new URL(`../public${path}`, import.meta.url));
    assert.equal(photo[0], 0xff);
    assert.equal(photo[1], 0xd8);
    bytes.push(photo.toString('base64'));
  }
  assert.equal(new Set(bytes).size, 11, 'Carousel photos must be distinct');
  assert.ok(html.includes('id=61581878207037'));
  assert.ok(!html.includes('fbcdn.net'), 'Do not publish expiring Facebook image URLs');
});

test('external new-tab links have safe relationship and accessible disclosure', () => {
  const links = [...html.matchAll(/<a\b[^>]*target="_blank"[^>]*>[\s\S]*?<\/a>/g)];
  assert.ok(links.length > 0);
  for (const [link] of links) {
    assert.match(link, /rel="noopener noreferrer"/);
    assert.match(link, /opens in a new tab/);
  }
});

test('header uses only the Heavenly Hope logo with an accessible description', async () => {
  const header = html.match(/<header[\s\S]*?<\/header>/)[0];
  assert.equal((header.match(/<img\b/g) ?? []).length, 1);
  assert.ok(header.includes('heavenly-hope-logo.png'));
  const image = await readFile(new URL('../public/images/branding/heavenly-hope-logo.png', import.meta.url));
  assert.equal(image.subarray(1, 4).toString(), 'PNG');
  assert.ok(header.includes('alt="Heavenly Hope Ministry"'));
  assert.ok(!html.includes('apostolic-church-emblem.png'));
});

test('contact email opens an email client and preserves the supplied address', () => {
  assert.ok(html.includes('href="mailto:heavenlyhopeincorporated@gmail.com">heavenlyhopeincorporated@gmail.com</a>'));
});

test('WDP support is the final section before the footer with accurate guidance and working enquiry links', () => {
  const section = html.match(/<section class="wdp section"[\s\S]*?<\/section>/)?.[0];
  assert.ok(section);
  assert.match(html, /<section class="wdp section"[\s\S]*?<\/section>\s*<\/main>\s*<footer/);
  assert.ok(section.includes('A WDP is not an automatic fine waiver.'));
  assert.ok(section.includes('subject to eligibility, eligible fines and approval'));
  assert.ok(section.includes('Please don’t include fine notices, identity documents or sensitive personal information'));
  assert.ok(section.includes('https://online.fines.vic.gov.au/support/work-and-Development-Permit'));
  assert.ok(section.includes('mailto:heavenlyhopeincorporated@gmail.com?subject=Work%20and%20Development%20Permit%20enquiry'));
  assert.ok(html.includes('href="#wdp"'));
});
