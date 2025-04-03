// ==UserScript==
// @name         Read Aloud Speedster
// @description  Set playback speed for Read Aloud on ChatGPT.com. Clicking the speed display opens a popup to save the default playback speed and toggle the square design. Also adds color-coded icons for copy, thumbs up, thumbs down, read aloud, and stop buttons. Highlight color for strong text is green in dark mode and violet in light mode.
// @author       Tim Macy
// @license      GNU AFFERO GENERAL PUBLIC LICENSE-3.0
// @version      3.0.3
// @namespace    TimMacy.ReadAloudSpeedster
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chatgpt.com
// @match        https://*.chatgpt.com/*
// @grant        GM.setValue
// @grant        GM.getValue
// @run-at       document-start
// @homepageURL  https://github.com/TimMacy/ReadAloudSpeedster
// @supportURL   https://github.com/TimMacy/ReadAloudSpeedster/issues
// @updateURL    https://raw.githubusercontent.com/TimMacy/ReadAloudSpeedster/refs/heads/main/ReadAloudSpeedster.js
// @downloadURL  https://raw.githubusercontent.com/TimMacy/ReadAloudSpeedster/refs/heads/main/ReadAloudSpeedster.js
// ==/UserScript==

/************************************************************************
*                                                                       *
*                    Copyright © 2025 Tim Macy                          *
*                    GNU Affero General Public License v3.0             *
*                    Version: 3.0.3 - Read Aloud Speedster              *
*                    All Rights Reserved.                               *
*                                                                       *
*             Visit: https://github.com/TimMacy                         *
*                                                                       *
************************************************************************/

(function() {
    'use strict';
    const className = "sm:mt-5";
    const escapedClassName = CSS.escape(className);
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `

        /**************************************
                     user settings
        **************************************/

        /* chatbox - reduced vertical margin */
        .${escapedClassName} {
            margin-top: .5rem !important;
            margin-bottom: .25rem !important;
        }

        /* chatbox - fade effect for content */
        main form > div > .w-full {
            box-shadow: 0 -10px 10px 0px var(--main-surface-primary);
        }

        /* copy icon */
        button[aria-label="Copy"] .icon-md-heavy {
            color: darkorange !important;
            opacity: .8;
        }

        /* thumbs up icon */
        button[aria-label="Good response"] .icon-md-heavy {
            color: forestgreen !important;
        }

        /* thumbs down icon */
        button[aria-label="Bad response"] .icon-md-heavy {
            color: crimson !important;
            opacity: .8;
        }

        /* read aloud and stop icon */
        button[aria-label="Read aloud"] .icon-md-heavy,
        button[aria-label="Stop"] .icon-md-heavy {
            color: deepskyblue !important;
        }

        /* highlight color - dark mode */
        .markdown strong {
            color: springgreen !important;
        }

        /* highlight color - light mode */
        .light .markdown strong {
            color: darkviolet !important;
        }

        /* hide 'view plans' banner
        .h-full.w-\\[260px\\] .dark\\:border-white\\/20:is(.dark *) {
            display: none;
        } */

        /* hide 'chat can make mistakes' text
        .relative.flex.min-h-8.w-full.items-center.justify-center.p-2.text-center.text-xs.text-token-text-secondary.md\\:px-\\[60px\\] {
            display: none;
        } */

        /* add space below chatbox
        .xl\\:px-5 {
            padding-bottom: 1rem;
        } */

        /* disable voice mode button
        button[aria-label="Start voice mode"] {
            pointer-events: none;
            opacity: 0.5;
        } */

        /* select color */
        ::selection {
            /*background: #00519d;*/
            background-color: var(--text-primary);
            color: var(--main-surface-tertiary);
        }

        /* right button height
        .w-7 {
            width: 2.25rem !important
        }

        .h-7 {
            height: 2.25rem !important
        }

        [data-testid="composer-speech-button"].w-7.\\!h-7,
        button[data-testid="composer-speech-button"] {
            width: 2.25rem !important;
            height: 2.25rem !important;
        } */

        /* darker bg for chatbox and header
        main form .bg-token-main-surface-primary {
            background-color: #141414 !important;;
        }

        .h-header-height {
            background: #171717 !important;
        } */

        /**************************************
                 Read Aloud Speedster
        **************************************/

        .speed-control-container {
            position: relative;
            display: flex;
            align-items: center;
        }

        .speed-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 36px;
            min-width: 36px;
            border: 1px solid var(--border-light);
            font-size: .75rem;
            line-height: 1rem;
            font-weight: 600;
            background: transparent;
            color: var(--text-secondary);
            cursor: pointer;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
        }

        .speed-btn.minus {
            border-radius: 100% 0 0 100%;
            border-right: none;
        }

        .speed-btn.plus {
            border-radius: 0 100% 100% 0;
            border-left: none;
        }

        .speed-btn:hover,
        .speed-control-config-popup button:hover {
            background-color: var(--main-surface-secondary);
        }

        .speed-btn:active,
        .speed-control-config-popup button:active {
            background-color: oklab(0 0 0/.1);
        }

        .speed-display {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 36px;
            min-width: 36px;
            padding: .5rem;
            border: 1px solid var(--border-light);
            font-size: .75rem;
            line-height: 1rem;
            font-weight: 600;
            background: transparent;
            color: var(--text-secondary);
            cursor: default;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
        }

        .speed-control-config-popup {
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            background: var(--main-surface-primary);
            border: 1px solid var(--border-light);
            border-radius: 3px;
            padding: 8px;
            margin-bottom: 4px;
            z-index: 2077;
            display: none;
            flex-direction: row;
            gap: 10px;
        }

        .speed-control-config-popup.show {
            display: flex;
        }

        .speed-control-config-popup input[type="number"] {
            width: 6ch;
            border: 1px solid var(--border-light);
            border-radius: 3px;
            background: transparent;
            color: var(--text-primary);
            text-align: center;
            margin-right: 10px;
        }

        .speed-control-config-popup button {
            padding: 4px 8px;
            border: 1px solid var(--border-light);
            border-radius: 3px;
            background: transparent;
            color: var(--text-secondary);
            cursor: pointer;
        }

        .speed-control-config-popup .toggle-container {
            display: flex;
            align-items: center;
            text-wrap: nowrap;
            gap: 5px;
        }
    `; document.head.appendChild(styleSheet);

    let squareDesignEnabled = false;
    let squareStyleSheet = null;
    let audioListeners = new Map();
    let controlsContainer = null;
    let configPopup = null;
    let observer = null;
    let playbackSpeed = 1;
    let ignoreRateChange = false;
    let lastUserRate = playbackSpeed;
    let savedSpeed;

    const MIN_SPEED = 1;
    const MAX_SPEED = 17;
    const DELTA = 0.25;

    // toggle square design
    function applySquareDesign(enabled) {
        if (enabled) {
            if (!squareStyleSheet) {
                squareStyleSheet = document.createElement('style');
                squareStyleSheet.textContent = `
                    /* button 'send prompt' radius */
                    button[aria-label="Send prompt"], button[aria-label="Stop streaming"], button[aria-label="Start voice mode"] {
                        border-radius: 4px !important;
                    }

                    /* button radii */
                    .btn, .rounded-full {
                        border-radius: 2px !important;
                    }

                    /* button minus radius */
                    .speed-btn.minus {
                        border-radius: 2px 0 0 2px;
                    }

                    /* button plus radius */
                    .speed-btn.plus {
                        border-radius: 0 2px 2px 0;
                    }

                    /* chatbox - radius */
                    .rounded-3xl,
                    .rounded-b-3xl,
                    .rounded-t-3xl,
                    .rounded-\\[28px\\] {
                        border-radius: .25em !important;
                    }

                    /* popup radii */
                    .rounded-lg, .rounded-2xl {
                        border-radius: .25rem !important;
                    }

                    /* reply radii */
                    .rounded-b-lg,
                    .rounded-t-\\[20px\\] {
                        border-radius: 0 !important;
                    }
                `;
                document.head.appendChild(squareStyleSheet);
            }
        } else {
            if (squareStyleSheet) {
                squareStyleSheet.remove();
                squareStyleSheet = null;
            }
        }
    }

    // load playback speed and square design values from config or use default
    async function initializeSpeed() {
        savedSpeed = await GM.getValue('defaultSpeed');
        if (savedSpeed !== undefined) {
            playbackSpeed = savedSpeed;
            lastUserRate = playbackSpeed;
        }

        // load square design setting
        squareDesignEnabled = await GM.getValue('squareDesign');
        if (squareDesignEnabled === undefined) {
            squareDesignEnabled = false;
        }

        applySquareDesign(squareDesignEnabled);
        updateSpeedDisplay();
        setPlaybackSpeed();
    }

    // set playback speed and manage listeners
    function setPlaybackSpeed() {
        const audioElements = document.querySelectorAll('audio');
        audioElements.forEach(audio => {
            if (audioListeners.has(audio)) {
                const { playListener, rateListener } = audioListeners.get(audio);
                audio.removeEventListener('play', playListener);
                audio.removeEventListener('ratechange', rateListener);
                audioListeners.delete(audio);
            }

            audio.playbackRate = playbackSpeed;
            const playListener = () => audio.playbackRate = playbackSpeed;

            const rateListener = () => {
                if (ignoreRateChange) { ignoreRateChange = false; return; }
                audio.playbackRate = lastUserRate;
            };

            audio.addEventListener('play', playListener);
            audio.addEventListener('ratechange', rateListener);
            audioListeners.set(audio, { playListener, rateListener });
        });
    }

    // config popup
    function createConfigPopup() {
        if (configPopup) {
            document.removeEventListener('click', handleDocumentClick);
            configPopup.remove();
        }

        configPopup = document.createElement('div');
        configPopup.classList.add('speed-control-config-popup');

        // input for speed
        const input = document.createElement('input');
        input.type = 'number';
        input.min = MIN_SPEED;
        input.max = MAX_SPEED;
        input.step = DELTA;
        input.value = savedSpeed;

        // square design toggle
        const toggleContainer = document.createElement('div');
        toggleContainer.classList.add('toggle-container');
        const squareCheckbox = document.createElement('input');
        squareCheckbox.type = 'checkbox';
        squareCheckbox.id = 'squareDesignToggle';
        squareCheckbox.checked = squareDesignEnabled;
        const squareLabel = document.createElement('label');
        squareLabel.textContent = 'Square Design';
        squareLabel.htmlFor = 'squareDesignToggle';
        toggleContainer.appendChild(squareCheckbox);
        toggleContainer.appendChild(squareLabel);

        // save button
        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save';

        async function handleSave() {
            const newSpeed = parseFloat(input.value);
            if (newSpeed >= MIN_SPEED && newSpeed <= MAX_SPEED) {
                await GM.setValue('defaultSpeed', newSpeed);
                playbackSpeed = newSpeed;
                updateSpeedDisplay();
                setPlaybackSpeed();
            }

            // save square design setting
            squareDesignEnabled = squareCheckbox.checked;
            await GM.setValue('squareDesign', squareDesignEnabled);
            applySquareDesign(squareDesignEnabled);

            configPopup.classList.remove('show');
        }

        saveButton.addEventListener('click', handleSave);

        document.addEventListener('click', handleDocumentClick);

        configPopup.appendChild(input);
        configPopup.appendChild(toggleContainer);
        configPopup.appendChild(saveButton);
        document.body.appendChild(configPopup);

        return configPopup;
    }

    function handleDocumentClick(e) {
        if (!configPopup.contains(e.target) && !e.target.classList.contains('speed-display')) {
            configPopup.classList.remove('show');
        }
    }

    // speed display
    function updateSpeedDisplay() {
        const speedDisplay = controlsContainer.querySelector('.speed-display');
        if (speedDisplay) {
            // speedDisplay.textContent = `${playbackSpeed.toFixed(2)}x`; // display speed with always two decimals
            speedDisplay.textContent = `${playbackSpeed}x`; // raw speed value without formatting
        }
    }

    // create controls
    function createControlButtons() {
        if (controlsContainer && document.body.contains(controlsContainer)) return;

        controlsContainer = document.createElement('div');
        controlsContainer.classList.add('speed-control-container');

        const minusButton = document.createElement('button');
        minusButton.textContent = '-';
        minusButton.classList.add('speed-btn', 'minus');

        const speedDisplay = document.createElement('span');
        speedDisplay.classList.add('speed-display');
        // speedDisplay.textContent = `${playbackSpeed.toFixed(2)}x`; // display speed with always two decimals
        speedDisplay.textContent = `${playbackSpeed}x`; // raw speed value without formatting

        const plusButton = document.createElement('button');
        plusButton.textContent = '+';
        plusButton.classList.add('speed-btn', 'plus');

        function handleMinus() {
            ignoreRateChange = true;
            playbackSpeed = Math.max(MIN_SPEED, playbackSpeed - DELTA);
            lastUserRate = playbackSpeed;
            updateSpeedDisplay();
            setPlaybackSpeed();
        }

        function handlePlus() {
            ignoreRateChange = true;
            playbackSpeed = Math.min(MAX_SPEED, playbackSpeed + DELTA);
            lastUserRate = playbackSpeed;
            updateSpeedDisplay();
            setPlaybackSpeed();
        }

        function handleSpeedClick(e) {
            e.stopPropagation();
            if (!configPopup || !document.body.contains(configPopup)) {
                configPopup = createConfigPopup();
            }
            configPopup.classList.toggle('show');

            if (configPopup.classList.contains('show')) {
                const rect = e.target.getBoundingClientRect();
                configPopup.style.position = 'absolute';
                configPopup.style.bottom = `${window.innerHeight - rect.top + 10}px`;
                configPopup.style.left = `${rect.left + (rect.width / 2)}px`;
                configPopup.style.transform = 'translateX(-50%)';
            }
        }

        minusButton.addEventListener('click', handleMinus);
        plusButton.addEventListener('click', handlePlus);
        speedDisplay.addEventListener('click', handleSpeedClick);

        controlsContainer.appendChild(minusButton);
        controlsContainer.appendChild(speedDisplay);
        controlsContainer.appendChild(plusButton);

        const target = document.querySelector('div[style*="var(--vt-composer-system-hint-action)"]');
        if (target) target.insertAdjacentElement('beforebegin', controlsContainer);
        else if (document.querySelector('div[style*="var(--vt-composer-attach-file-action)"]')?.insertAdjacentElement('afterend', controlsContainer));
    }

    // handle cleanup
    function cleanup() {
        audioListeners.forEach((listeners, audio) => {
            audio.removeEventListener('play', listeners.playListener);
            audio.removeEventListener('ratechange', listeners.rateListener);
        });

        audioListeners.clear();
        if (observer) { observer.disconnect(); observer = null; }
        controlsContainer?.remove();
        configPopup?.remove();
    }

    // initialize everything when DOM is fully loaded
    function init() {
        // observer for new audio elements
        observer = new MutationObserver(mutations => {
            if (!document.body.contains(controlsContainer)) createControlButtons();

            let audioFound = false;
            for (const mutation of mutations) {
                if (mutation.addedNodes.length) {
                    const newAudioElements = mutation.target.querySelectorAll('audio');
                    if (newAudioElements.length > 0) {
                        audioFound = true;
                        break;
                    }
                }
            }

            if (audioFound) setPlaybackSpeed();
        });

        if (document.body) {
            observer.observe(document.body, { childList: true, subtree: true });

            // initiate the script
            initializeSpeed();
            createControlButtons();
        }
    }

    // wait for document to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else init();

    // cleanup when page unloads
    window.addEventListener('unload', cleanup);
})();
