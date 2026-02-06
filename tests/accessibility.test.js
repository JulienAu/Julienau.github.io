const { describe, it } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const ROOT = path.resolve(__dirname, '..');

function loadPage(filename) {
    const html = fs.readFileSync(path.join(ROOT, filename), 'utf-8');
    return new JSDOM(html).window.document;
}

const MAIN_PAGES = ['index.html', 'notaires.html', 'coming-soon.html'];

describe('Accessibility tests', () => {
    for (const page of MAIN_PAGES) {
        describe(page, () => {
            it('should have a meta description', () => {
                const doc = loadPage(page);
                const meta = doc.querySelector('meta[name="description"]');
                assert.ok(meta, `${page} should have a meta description`);
                assert.ok(meta.getAttribute('content').length > 20, 'Meta description should be meaningful');
            });

            it('should have navigation with aria-label', () => {
                const doc = loadPage(page);
                const nav = doc.querySelector('nav[aria-label]');
                assert.ok(nav, `${page} should have nav with aria-label`);
            });

            it('should have a mobile menu toggle button with aria attributes', () => {
                const doc = loadPage(page);
                const toggle = doc.querySelector('.menu-toggle');
                assert.ok(toggle, `${page} should have a menu toggle button`);
                assert.ok(toggle.getAttribute('aria-label'), 'Menu toggle should have aria-label');
                assert.ok(toggle.hasAttribute('aria-expanded'), 'Menu toggle should have aria-expanded');
            });

            it('should have proper heading hierarchy (h1 before h2)', () => {
                const doc = loadPage(page);
                const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
                assert.ok(headings.length > 0, `${page} should have headings`);
                // First heading should be h1
                const firstHeading = headings[0];
                assert.strictEqual(firstHeading.tagName, 'H1', `${page}: first heading should be h1`);
            });

            it('should have decorative elements marked with aria-hidden', () => {
                const doc = loadPage(page);
                const icons = doc.querySelectorAll('.icon, .logo-mark, .coming-soon-icon, .mission-feature-icon');
                for (const icon of icons) {
                    assert.strictEqual(
                        icon.getAttribute('aria-hidden'),
                        'true',
                        `${page}: Decorative element should have aria-hidden="true"`
                    );
                }
            });

            it('should have a logo link with aria-label', () => {
                const doc = loadPage(page);
                const logoLink = doc.querySelector('a.logo[aria-label]');
                assert.ok(logoLink, `${page} should have logo link with aria-label`);
            });
        });
    }
});
