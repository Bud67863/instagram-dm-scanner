// ==UserScript==
// @name         Instagram DM Auto-fill (Instagram DM Sender)
// @namespace    https://bud67863.github.io/instagram-dm-scanner/
// @version      1.0
// @description  When a DM thread is opened from the Instagram DM Sender app, types the prepared message into the compose box. It only types — sending is always your click.
// @match        https://www.instagram.com/*
// @match        https://instagram.com/*
// @run-at       document-start
// @noframes
// @grant        none
// @downloadURL  https://bud67863.github.io/instagram-dm-scanner/instagram-dm-autofill.user.js
// @updateURL    https://bud67863.github.io/instagram-dm-scanner/instagram-dm-autofill.user.js
// ==/UserScript==
(function () {
  'use strict';

  // Capture the payload immediately — Instagram's SPA router rewrites the URL
  // soon after load, which would drop the fragment.
  const m = location.hash.match(/igprefill=([^&]+)/);
  if (!m) return;
  let text;
  try {
    text = decodeURIComponent(escape(atob(decodeURIComponent(m[1]))));
  } catch (e) { return; }
  try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {}

  // Wait for the DM compose box to exist, then type into it.
  let tries = 0;
  const timer = setInterval(() => {
    if (++tries > 120) return clearInterval(timer); // give up after ~36s
    const box = document.querySelector(
      'div[role="textbox"][contenteditable="true"], textarea[placeholder*="essage"]'
    );
    if (!box) return;
    clearInterval(timer);
    box.focus();
    const ok = document.execCommand('insertText', false, text);
    const current = box.tagName === 'TEXTAREA' ? box.value : box.textContent;
    if (!ok || !current || current.trim() === '') {
      // React-compatible fallbacks
      if (box.tagName === 'TEXTAREA') {
        const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
        setter.call(box, text);
        box.dispatchEvent(new Event('input', { bubbles: true }));
      } else {
        box.dispatchEvent(new InputEvent('beforeinput', {
          inputType: 'insertText', data: text, bubbles: true, cancelable: true
        }));
      }
    }
  }, 300);
})();
