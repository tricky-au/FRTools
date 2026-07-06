// ==UserScript==
// @name         FR Tools (Core)
// @author       Nick Filipovic (DFU)
// @namespace    FRTOOLS
// @version      1.0.0
// @description  Core framework for FR Tools (modular Tampermonkey script for Forensic Register)
// @match        https://vicpol.forensic-register.app/*
// @downloadURL  https://github.com/tricky-au/FRTools/releases/latest/download/FRTools.user.js
// @updateURL    https://github.com/tricky-au/FRTools/releases/latest/download/FRTools.user.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// ==/UserScript==

(function () {
    'use strict';

    const FRTools = {
        modules: {},
        state: { uiOpen: false }
    };

    window.FRTools = FRTools;

    const Storage = {
        get(key, fallback) {
            const val = GM_getValue(key);
            return val === undefined ? fallback : val;
        },
        set(key, value) {
            GM_setValue(key, value);
        }
    };

    FRTools.Storage = Storage;

    GM_addStyle(`
        #frtools-button {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 999999;
            background: #1e88e5;
            color: white;
            border: none;
            border-radius: 50px;
            padding: 10px 14px;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 3px 10px rgba(0,0,0,0.25);
        }

        #frtools-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 520px;
            max-height: 70vh;
            overflow: auto;
            background: white;
            z-index: 1000000;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.4);
            display: none;
            padding: 16px;
        }

        #frtools-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.4);
            z-index: 999999;
            display: none;
        }

        .frtools-title {
            font-size: 16px;
            font-weight: 700;
            margin-bottom: 10px;
        }

        .frtools-section {
            margin-top: 10px;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 6px;
        }
    `);

    function createUI() {

        const btn = document.createElement('button');
        btn.id = 'frtools-button';
        btn.textContent = 'FR Tools';

        const overlay = document.createElement('div');
        overlay.id = 'frtools-overlay';

        const modal = document.createElement('div');
        modal.id = 'frtools-modal';

        modal.innerHTML = `
            <div class="frtools-title">FR Tools</div>

            <div class="frtools-section">
                Core loaded<br>
                Modules: 0
            </div>
        `;

        function open() {
            overlay.style.display = 'block';
            modal.style.display = 'block';
            FRTools.state.uiOpen = true;
        }

        function close() {
            overlay.style.display = 'none';
            modal.style.display = 'none';
            FRTools.state.uiOpen = false;
        }

        btn.addEventListener('click', () => {
            FRTools.state.uiOpen ? close() : open();
        });

        overlay.addEventListener('click', close);

        document.body.appendChild(btn);
        document.body.appendChild(overlay);
        document.body.appendChild(modal);
    }

    function init() {
        createUI();
        console.log('[FR Tools] Core loaded');
    }

    function waitForBody() {
        if (document.body) {
            init();
        } else {
            const obs = new MutationObserver(() => {
                if (document.body) {
                    obs.disconnect();
                    init();
                }
            });
            obs.observe(document.documentElement, { childList: true, subtree: true });
        }
    }

    waitForBody();

})();
