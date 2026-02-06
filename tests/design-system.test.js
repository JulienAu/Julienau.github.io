const { describe, it } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');

describe('Design system tests', () => {
    describe('styles.css', () => {
        const css = fs.readFileSync(path.join(ROOT, 'styles.css'), 'utf-8');

        it('should exist and not be empty', () => {
            assert.ok(css.length > 100, 'styles.css should have substantial content');
        });

        it('should define CSS custom properties', () => {
            assert.ok(css.includes(':root'), 'Should have :root block for custom properties');
            assert.ok(css.includes('--color-primary'), 'Should define --color-primary');
            assert.ok(css.includes('--color-accent'), 'Should define --color-accent');
            assert.ok(css.includes('--font-sans'), 'Should define --font-sans');
        });

        it('should include responsive breakpoints', () => {
            assert.ok(css.includes('@media'), 'Should have media queries');
            assert.ok(css.includes('768px'), 'Should have mobile breakpoint at 768px');
        });

        it('should define animation keyframes', () => {
            assert.ok(css.includes('@keyframes fadeInUp'), 'Should define fadeInUp animation');
            assert.ok(css.includes('@keyframes pulse-dot'), 'Should define pulse-dot animation');
        });

        it('should define button styles', () => {
            assert.ok(css.includes('.btn'), 'Should define .btn class');
            assert.ok(css.includes('.btn-primary'), 'Should define .btn-primary');
            assert.ok(css.includes('.btn-accent'), 'Should define .btn-accent');
            assert.ok(css.includes('.btn-success'), 'Should define .btn-success');
        });

        it('should define header sticky positioning', () => {
            assert.ok(css.includes('position: sticky'), 'Header should be sticky');
        });

        it('should define scroll reveal classes', () => {
            assert.ok(css.includes('.reveal'), 'Should define .reveal class');
            assert.ok(css.includes('.reveal.visible'), 'Should define .reveal.visible class');
        });

        it('should define mobile menu toggle', () => {
            assert.ok(css.includes('.menu-toggle'), 'Should define .menu-toggle');
            assert.ok(css.includes('nav.open'), 'Should define nav.open state');
        });

        it('should define profession card styles', () => {
            assert.ok(css.includes('.profession-card'), 'Should define .profession-card');
            assert.ok(css.includes('.profession-card:hover'), 'Should define hover state');
        });

        it('should define footer styles', () => {
            assert.ok(css.includes('.footer-grid'), 'Should define .footer-grid');
            assert.ok(css.includes('.footer-bottom'), 'Should define .footer-bottom');
        });
    });

    describe('Google Fonts integration', () => {
        const mainPages = ['index.html', 'notaires.html', 'coming-soon.html'];

        for (const page of mainPages) {
            it(`${page} should link to Google Fonts Inter`, () => {
                const html = fs.readFileSync(path.join(ROOT, page), 'utf-8');
                assert.ok(html.includes('fonts.googleapis.com'), `${page} should link to Google Fonts`);
                assert.ok(html.includes('Inter'), `${page} should use Inter font`);
            });

            it(`${page} should link to styles.css`, () => {
                const html = fs.readFileSync(path.join(ROOT, page), 'utf-8');
                assert.ok(html.includes('href="styles.css"'), `${page} should link to shared stylesheet`);
            });
        }
    });

    describe('Consistent branding', () => {
        const allPages = ['index.html', 'notaires.html', 'coming-soon.html', 'formulaire-vendeur.html', 'formulaire-acquereur.html'];

        for (const page of allPages) {
            it(`${page} should contain Transactoffice branding`, () => {
                const html = fs.readFileSync(path.join(ROOT, page), 'utf-8');
                assert.ok(html.includes('Transactoffice'), `${page} should mention Transactoffice`);
            });

            it(`${page} should have copyright notice`, () => {
                const html = fs.readFileSync(path.join(ROOT, page), 'utf-8');
                assert.ok(html.includes('2025 Transactoffice'), `${page} should have updated copyright year`);
            });
        }
    });
});
