const { describe, it } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const ROOT = path.resolve(__dirname, '..');

describe('JavaScript functionality tests', () => {
    describe('index.html mobile menu', () => {
        it('should toggle nav open class on menu button click', () => {
            const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf-8');
            const dom = new JSDOM(html, { runScripts: 'dangerously', resources: 'usable' });
            const doc = dom.window.document;

            const toggle = doc.getElementById('menu-toggle');
            const nav = doc.getElementById('main-nav');
            assert.ok(toggle, 'Menu toggle button should exist');
            assert.ok(nav, 'Nav element should exist');

            // Simulate click
            toggle.click();
            assert.ok(nav.classList.contains('open'), 'Nav should have "open" class after click');
            assert.strictEqual(toggle.getAttribute('aria-expanded'), 'true', 'aria-expanded should be true');

            // Click again to close
            toggle.click();
            assert.ok(!nav.classList.contains('open'), 'Nav should not have "open" class after second click');
        });

        it('should close menu when nav link is clicked', () => {
            const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf-8');
            const dom = new JSDOM(html, { runScripts: 'dangerously', resources: 'usable' });
            const doc = dom.window.document;

            const toggle = doc.getElementById('menu-toggle');
            const nav = doc.getElementById('main-nav');

            // Open menu
            toggle.click();
            assert.ok(nav.classList.contains('open'), 'Nav should be open');

            // Click a nav link
            const link = nav.querySelector('a');
            link.click();
            assert.ok(!nav.classList.contains('open'), 'Nav should close after link click');
        });
    });

    describe('index.html scroll reveal setup', () => {
        it('should have reveal elements in the DOM', () => {
            const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf-8');
            const dom = new JSDOM(html);
            const doc = dom.window.document;

            const reveals = doc.querySelectorAll('.reveal');
            assert.ok(reveals.length > 0, 'Should have elements with .reveal class');

            const staggerChildren = doc.querySelectorAll('.stagger-children');
            assert.ok(staggerChildren.length > 0, 'Should have elements with .stagger-children class');
        });
    });

    describe('index.html header scroll effect', () => {
        it('should have site-header with id for scroll detection', () => {
            const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf-8');
            const dom = new JSDOM(html);
            const doc = dom.window.document;

            const header = doc.getElementById('site-header');
            assert.ok(header, 'Should have header with id="site-header"');
        });
    });

    describe('notaires.html and coming-soon.html mobile menu', () => {
        for (const page of ['notaires.html', 'coming-soon.html']) {
            it(`${page} should have working menu toggle`, () => {
                const html = fs.readFileSync(path.join(ROOT, page), 'utf-8');
                const dom = new JSDOM(html, { runScripts: 'dangerously', resources: 'usable' });
                const doc = dom.window.document;

                const toggle = doc.getElementById('menu-toggle');
                const nav = doc.getElementById('main-nav');
                assert.ok(toggle, `${page}: Menu toggle should exist`);
                assert.ok(nav, `${page}: Nav should exist`);

                toggle.click();
                assert.ok(nav.classList.contains('open'), `${page}: Nav should open on click`);
            });
        }
    });
});
