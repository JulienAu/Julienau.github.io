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

describe('Navigation and links tests', () => {
    describe('index.html', () => {
        it('should have 9 profession cards', () => {
            const doc = loadPage('index.html');
            const cards = doc.querySelectorAll('.profession-card');
            assert.strictEqual(cards.length, 9, 'Should have 9 profession cards');
        });

        it('should have a Notaires card linking to notaires.html', () => {
            const doc = loadPage('index.html');
            const notairesLink = doc.querySelector('a.profession-card[href="notaires.html"]');
            assert.ok(notairesLink, 'Should have a link to notaires.html');
            assert.ok(notairesLink.textContent.includes('Notaires'));
        });

        it('should have 8 profession cards linking to coming-soon.html', () => {
            const doc = loadPage('index.html');
            const comingSoonLinks = doc.querySelectorAll('a.profession-card[href="coming-soon.html"]');
            assert.strictEqual(comingSoonLinks.length, 8, '8 professions should link to coming-soon');
        });

        it('should have all expected professions listed', () => {
            const doc = loadPage('index.html');
            const cards = doc.querySelectorAll('.profession-card h3');
            const professions = Array.from(cards).map(c => c.textContent.trim());
            const expected = [
                'Notaires', 'Commissaires de justice', 'Experts-comptables',
                'Architectes', 'Géomètres-experts', 'Kinésithérapeutes',
                'Infirmiers libéraux', 'Chirurgiens-dentistes', 'Vétérinaires'
            ];
            for (const exp of expected) {
                assert.ok(professions.includes(exp), `Should list profession: ${exp}`);
            }
        });

        it('should have internal anchor links in hero section', () => {
            const doc = loadPage('index.html');
            const heroLinks = doc.querySelectorAll('.hero-cta a');
            assert.ok(heroLinks.length >= 1, 'Hero should have CTA links');
            const hrefs = Array.from(heroLinks).map(l => l.getAttribute('href'));
            assert.ok(hrefs.some(h => h.startsWith('#')), 'Hero should have anchor links');
        });

        it('should have a trust/stats section', () => {
            const doc = loadPage('index.html');
            const trustItems = doc.querySelectorAll('.trust-item');
            assert.ok(trustItems.length >= 3, 'Should have at least 3 trust items');
        });

        it('should have a mission section with features', () => {
            const doc = loadPage('index.html');
            const features = doc.querySelectorAll('.mission-feature');
            assert.strictEqual(features.length, 3, 'Should have 3 mission features');
        });

        it('should have a CTA section', () => {
            const doc = loadPage('index.html');
            const cta = doc.querySelector('.cta-section');
            assert.ok(cta, 'Should have a CTA section');
            const ctaBtn = cta.querySelector('.btn');
            assert.ok(ctaBtn, 'CTA section should have a button');
        });
    });

    describe('notaires.html', () => {
        it('should have a breadcrumb pointing back to index', () => {
            const doc = loadPage('notaires.html');
            const breadcrumb = doc.querySelector('.breadcrumb');
            assert.ok(breadcrumb, 'Should have a breadcrumb');
            const homeLink = breadcrumb.querySelector('a[href="index.html"]');
            assert.ok(homeLink, 'Breadcrumb should link to index.html');
        });

        it('should have Vendeur and Acquéreur buttons', () => {
            const doc = loadPage('notaires.html');
            const buttons = doc.querySelectorAll('.buttons-section .btn');
            assert.strictEqual(buttons.length, 2, 'Should have 2 action buttons');
            const hrefs = Array.from(buttons).map(b => b.getAttribute('href'));
            assert.ok(hrefs.includes('formulaire-vendeur.html'), 'Should link to vendeur form');
            assert.ok(hrefs.includes('formulaire-acquereur.html'), 'Should link to acquereur form');
        });

        it('should have content describing notaires service', () => {
            const doc = loadPage('notaires.html');
            const content = doc.querySelector('.content-wrapper');
            assert.ok(content, 'Should have content wrapper');
            assert.ok(content.textContent.includes('Notaire'), 'Should mention Notaire');
            assert.ok(content.textContent.includes('Office') || content.textContent.includes('Étude'), 'Should mention Office or Étude');
        });
    });

    describe('coming-soon.html', () => {
        it('should have a return-to-home button', () => {
            const doc = loadPage('coming-soon.html');
            const btn = doc.querySelector('a.btn[href="index.html"]');
            assert.ok(btn, 'Should have a link back to index.html');
        });

        it('should display a coming-soon message', () => {
            const doc = loadPage('coming-soon.html');
            const h1 = doc.querySelector('h1');
            assert.ok(h1, 'Should have an h1');
            assert.ok(h1.textContent.toLowerCase().includes('bientôt'), 'Should mention "bientôt"');
        });
    });

    describe('All internal links point to existing files', () => {
        const pages = ['index.html', 'notaires.html', 'coming-soon.html'];
        for (const page of pages) {
            it(`all links in ${page} should reference existing files or anchors`, () => {
                const doc = loadPage(page);
                const links = doc.querySelectorAll('a[href]');
                for (const link of links) {
                    const href = link.getAttribute('href');
                    if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) continue;
                    if (href === '#') continue;
                    // Strip any hash fragment for file check
                    const file = href.split('#')[0];
                    if (file === '') continue; // Pure anchor
                    const filePath = path.join(ROOT, file);
                    assert.ok(fs.existsSync(filePath), `${page}: Link to "${href}" should reference an existing file (looked for ${filePath})`);
                }
            });
        }
    });
});
