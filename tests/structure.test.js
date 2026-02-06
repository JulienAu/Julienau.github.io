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

const PAGES = ['index.html', 'notaires.html', 'coming-soon.html', 'formulaire-vendeur.html', 'formulaire-acquereur.html'];

describe('HTML structure tests', () => {
    for (const page of PAGES) {
        describe(page, () => {
            it('should have a valid DOCTYPE', () => {
                const raw = fs.readFileSync(path.join(ROOT, page), 'utf-8');
                assert.ok(raw.trimStart().startsWith('<!DOCTYPE html>'), `${page} should start with <!DOCTYPE html>`);
            });

            it('should have lang="fr" on html element', () => {
                const doc = loadPage(page);
                assert.strictEqual(doc.documentElement.getAttribute('lang'), 'fr');
            });

            it('should have a charset meta tag', () => {
                const doc = loadPage(page);
                const meta = doc.querySelector('meta[charset]');
                assert.ok(meta, `${page} should have a charset meta tag`);
                assert.strictEqual(meta.getAttribute('charset').toLowerCase(), 'utf-8');
            });

            it('should have a viewport meta tag', () => {
                const doc = loadPage(page);
                const meta = doc.querySelector('meta[name="viewport"]');
                assert.ok(meta, `${page} should have a viewport meta tag`);
                assert.ok(meta.getAttribute('content').includes('width=device-width'));
            });

            it('should have a title element', () => {
                const doc = loadPage(page);
                const title = doc.querySelector('title');
                assert.ok(title, `${page} should have a title element`);
                assert.ok(title.textContent.length > 0, 'Title should not be empty');
                assert.ok(title.textContent.includes('Transactoffice'), 'Title should contain Transactoffice');
            });

            it('should have a header element', () => {
                const doc = loadPage(page);
                assert.ok(doc.querySelector('header'), `${page} should have a header`);
            });

            it('should have a footer element', () => {
                const doc = loadPage(page);
                assert.ok(doc.querySelector('footer'), `${page} should have a footer`);
            });

            it('should have navigation links', () => {
                const doc = loadPage(page);
                const nav = doc.querySelector('nav');
                assert.ok(nav, `${page} should have a nav element`);
                const links = nav.querySelectorAll('a');
                assert.ok(links.length >= 2, `${page} should have at least 2 nav links`);
            });

            it('should have the Transactoffice logo text', () => {
                const doc = loadPage(page);
                const logo = doc.querySelector('.logo');
                assert.ok(logo, `${page} should have a .logo element`);
                assert.ok(logo.textContent.includes('Transactoffice'));
            });
        });
    }
});
