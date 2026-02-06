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

describe('Form pages tests', () => {
    describe('formulaire-vendeur.html', () => {
        it('should have a form element', () => {
            const doc = loadPage('formulaire-vendeur.html');
            const form = doc.querySelector('form');
            assert.ok(form, 'Should have a form element');
        });

        it('should have a submit button', () => {
            const doc = loadPage('formulaire-vendeur.html');
            const submit = doc.querySelector('button[type="submit"], input[type="submit"]');
            assert.ok(submit, 'Should have a submit button');
        });

        it('should have a breadcrumb with navigation', () => {
            const doc = loadPage('formulaire-vendeur.html');
            const breadcrumb = doc.querySelector('.breadcrumb');
            assert.ok(breadcrumb, 'Should have a breadcrumb');
            const links = breadcrumb.querySelectorAll('a');
            assert.ok(links.length >= 1, 'Breadcrumb should have links');
        });

        it('should load jsPDF library', () => {
            const html = fs.readFileSync(path.join(ROOT, 'formulaire-vendeur.html'), 'utf-8');
            assert.ok(html.includes('jspdf'), 'Should include jsPDF library');
        });

        it('should have Inter font family', () => {
            const html = fs.readFileSync(path.join(ROOT, 'formulaire-vendeur.html'), 'utf-8');
            assert.ok(html.includes('Inter'), 'Should use Inter font');
        });

        it('should have valid nav link colors (not using linear-gradient as color)', () => {
            const html = fs.readFileSync(path.join(ROOT, 'formulaire-vendeur.html'), 'utf-8');
            // Check that nav a color is not using linear-gradient (invalid CSS)
            const navAMatch = html.match(/nav\s+a\s*\{[^}]*color:\s*([^;]+);/);
            if (navAMatch) {
                assert.ok(!navAMatch[1].includes('linear-gradient'), 'nav a color should not use linear-gradient (invalid CSS)');
            }
        });
    });

    describe('formulaire-acquereur.html', () => {
        it('should have a form element', () => {
            const doc = loadPage('formulaire-acquereur.html');
            const form = doc.querySelector('form');
            assert.ok(form, 'Should have a form element');
        });

        it('should have a submit button', () => {
            const doc = loadPage('formulaire-acquereur.html');
            const submit = doc.querySelector('button[type="submit"], input[type="submit"]');
            assert.ok(submit, 'Should have a submit button');
        });

        it('should have input fields', () => {
            const doc = loadPage('formulaire-acquereur.html');
            const inputs = doc.querySelectorAll('input, textarea, select');
            assert.ok(inputs.length > 10, 'Should have multiple form inputs');
        });

        it('should have a breadcrumb with navigation', () => {
            const doc = loadPage('formulaire-acquereur.html');
            const breadcrumb = doc.querySelector('.breadcrumb');
            assert.ok(breadcrumb, 'Should have a breadcrumb');
        });

        it('should load jsPDF library', () => {
            const html = fs.readFileSync(path.join(ROOT, 'formulaire-acquereur.html'), 'utf-8');
            assert.ok(html.includes('jspdf'), 'Should include jsPDF library');
        });

        it('should have Inter font family', () => {
            const html = fs.readFileSync(path.join(ROOT, 'formulaire-acquereur.html'), 'utf-8');
            assert.ok(html.includes('Inter'), 'Should use Inter font');
        });

        it('should have valid nav link colors', () => {
            const html = fs.readFileSync(path.join(ROOT, 'formulaire-acquereur.html'), 'utf-8');
            const navAMatch = html.match(/nav\s+a\s*\{[^}]*color:\s*([^;]+);/);
            if (navAMatch) {
                assert.ok(!navAMatch[1].includes('linear-gradient'), 'nav a color should not use linear-gradient');
            }
        });
    });
});
