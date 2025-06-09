// ==UserScript==
// @name         Read Aloud Speedster
// @description  Set playback speed for Read Aloud on ChatGPT.com. Clicking the speed display opens a popup to save the default playback speed and toggle the square design. Also adds color-coded icons for copy, thumbs up, thumbs down, read aloud, and stop buttons. Highlight color for strong text is green in dark mode and violet in light mode.
// @author       Tim Macy
// @license      AGPL-3.0-or-later
// @version      3.0.9.4
// @namespace    TimMacy.ReadAloudSpeedster
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chatgpt.com
// @match        https://*.chatgpt.com/*
// @grant        GM.setValue
// @grant        GM.getValue
// @run-at       document-start
// @homepageURL  https://github.com/TimMacy/ReadAloudSpeedster
// @supportURL   https://github.com/TimMacy/ReadAloudSpeedster/issues
// @updateURL    https://raw.githubusercontent.com/TimMacy/ReadAloudSpeedster/main/ReadAloudSpeedster.js
// @downloadURL  https://raw.githubusercontent.com/TimMacy/ReadAloudSpeedster/main/ReadAloudSpeedster.js
// ==/UserScript==

/************************************************************************
*                                                                       *
*                    Copyright © 2025 Tim Macy                          *
*                    GNU Affero General Public License v3.0             *
*                    Version: 3.0.9.4 - Read Aloud Speedster            *
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
        main form {
            border-top-left-radius: .25em !important;
            border-top-right-radius: .25em !important;
        }

        #thread-bottom-container {
            box-shadow: 0 -20px 20px 0px var(--main-surface-primary) !important;
        }

        /* chatbox border color
        main form > div:first-child {
            border: 1px solid #2d2d2d;
        } */

        .light main form > div:first-child {
            border: 1px solid #e6e6e6;
        }

        /* copy icon */
        button[aria-label="Copy"] .icon-md-heavy,
        div[role="menuitem"]:has(path[d^="M12 7.1a"]),
        button[data-testid="copy-turn-action-button"] svg,
        button.surface-nav-element:has(svg path[d^="M12 7.1a"]) {
            color: darkorange !important;
            opacity: .8;
        }

        /* thumbs up icon */
        button .icon-md path[d^="M12.1318"],
        div[role="menuitem"]:has(path[d^="m4.5 4.944"]),
        button[aria-label="Good response"] .icon-md-heavy,
        button[data-testid="good-response-turn-action-button"] svg {
            color: forestgreen !important;
        }

        /* thumbs down icon */
        button .icon-md path[d^="M11.8727"],
        button[aria-label="Bad response"] .icon-md-heavy,
        button.surface-nav-element:has(svg path[d^="M11.868 21"]),
        button[data-testid="bad-response-turn-action-button"] svg {
            color: crimson !important;
            opacity: .8;
        }

        /* edit in canvas icon */
        button[aria-label="Edit in canvas"] .icon-md {
            color: yellow !important;
            opacity: .8;
        }

        .light button[aria-label="Edit in canvas"] .icon-md {
            color: indigo !important;
            opacity: .8;
        }

        /* switch model icon */
        main .flex.justify-start button[aria-haspopup="menu"][data-state="closed"] > div {
            color: gray !important;
        }

        .light main .flex.justify-start button[aria-haspopup="menu"][data-state="closed"] > div {
            color: dimgray !important;
        }

        /* read aloud and stop icon */
        button[aria-label="Stop"] .icon-md-heavy,
        button[aria-label="Read aloud"] .icon-md-heavy,
        div[role="menuitem"]:has(path[d^="M9 6.25v5.5"]),
        button[data-testid="voice-play-turn-action-button"] svg {
            color: deepskyblue !important;
        }

        /* highlight color - dark mode */
        .markdown strong {
            color: springgreen !important;
        }

        /* sora star icon */
        a:has(svg path[d^="M9.822 2.077c"]),
        div.pointer-events-none path[d^="M10.258"],
        button.surface-nav-element path[d^="M10.258"],
        div[role="menuitem"]:has(path[d^="M9.822 2.077c"]),
        button.surface-nav-element path[d^="M9.822 2.077c"],
        div[role="menuitem"]:has(path[d^="M10.258 1.555c"]) {
            color: gold;
        }

        /* highlight color - light mode */
        .light .markdown strong {
            color: darkviolet !important;
        }

        /* red delete color */
        .text-token-text-destructive,
        button:has(path[d^="m10 11.5 4"]),
        [data-testid="delete-chat-menu-item"],
        div[role="menuitem"]:has(path[d^="M10.556 4a1 1 0"]) {
            color: #e02e2a !important;
        }

        .text-token-text-destructive:hover,
        button:has(path[d^="m10 11.5 4"]):hover,
        [data-testid="delete-chat-menu-item"]:hover,
        div[role="menuitem"]:has(path[d^="M10.556 4a1 1 0"]):hover {
            color: white !important;
            background: rgba(255, 0, 0, .5) !important;
        }

        /* sore green restore color */
        div[role="menuitem"]:has(path[d^="m4.5 4.944"]):hover {
            color: white !important;
            background: rgba(0, 255, 0, .5) !important;
        }

        /* hide dictate button
        button[aria-label="Dictate button"] {
            display: none;
        } */

        /* hide 'view plans' banner
        div.__menu-item:has(svg.icon-md path[d^="M8.44824"]) {
            display: none;
        } */

        /* hide 'chat can make mistakes' text
        div.text-token-text-secondary[class*="md:px-"] {
            display: none;
        } */

        /* add space below chatbox
        .xl\\:px-5, main form {
            padding-bottom: 1rem;
        } */

        /* disable voice mode button
        button[aria-label="Start voice mode"] {
            pointer-events: none;
            opacity: 0.5;
        } */

        /* select color */
        ::selection {
            background-color: var(--text-primary);
            color: var(--main-surface-tertiary);
        }

        /* darker bg for chatbox and header
        main form > div:first-child {
            background-color: #141414 !important;;
        }

        .h-header-height {
            background: #171717 !important;
        } */

        /* hide 'Get Pro' button
        div.flex.shrink-0.gap-2.pb-1.md\\:pb-0 {
            display: none;
        } */

        /* keep icons visible
        main [class*="[mask-image"] {
            mask-image: none !important;
            -webkit-mask-image: none !important;
        } */

        /* left bar section seperators and make it compact */
        .mt-5 {
            margin-top: 10px;
        }

        .__menu-item {
            min-height: calc(var(--spacing)*8);
        }

        .mt-5::before {
            content: '';
            position: absolute;
            width: 100%;
            height: 1px;
            background-color: color(srgb 1 1 1 / 0.17);
            display: block;
            transform: translateY(-5px);
        }

        .light .mt-5::before {
            background-color: color(srgb 0 0 0 / 0.17);
        }

        /* hide plus and pro icon in the avatar
        #page-header .px-1 span {
            display: none;
        } */

        /* remove focus outlines; used for keyboard users and screen readers
        :focus {
            outline: none;
            box-shadow: 0 0 0 0 transparent;
        } */

        /* change width of chat containers */
        #thread-bottom-container > div {
            margin: 0 5vw;
            padding: 0;
        }

        #thread-bottom-container.mb-4.flex.flex-col > #thread-bottom {
            margin: 0 10vw;
        }

        #thread-bottom > div {
            padding-inline: 0 !important;
            --thread-content-margin: 0 !important;
        }

        [data-message-author-role="user"] > div > div {
            max-width: 100%;
            /* background-color: rgba(50, 50, 50, 0.85); */
        }

        .px-\\(--thread-content-margin\\):has([data-message-author-role="user"]) {
            margin: 20px 5vw 20px 30vw;
            padding: 0;
        }
        .px-\\(--thread-content-margin\\):has([data-message-author-role="assistant"]) {
            margin: 20px 5vw;
            padding: 0;
        }

        .grow.overflow-hidden > div > div {
            overflow-x:hidden;
        }

        [class^="_tableContainer_"] {
            padding-right: 10vw;
        }

        .border-token-border-sharp [class^="_tableContainer_"] {
            padding-right: 0;
        }

        .\\[--composer-overlap-px\\:24px\\] {
            --composer-overlap-px: 0;
        }

        .bottom-8 {
            bottom: .5rem;
        }
        
        /* justify text */
        .markdown {
            text-align: justify;
        }

        .markdown h1 {
            text-align: left;
        }
        
        /**************************************
                 Read Aloud Speedster
        **************************************/

        .speed-control-container {
            position: relative;
            display: flex;
            align-items: center;
            margin: 0 8px;
        }

        .speed-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 36px;
            min-width: 36px;
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
            border-radius: 50%;
            border-right: none;
        }

        .speed-btn.plus {
            border-radius: 50%;
            border-left: none;
        }

        .speed-btn.plus::before,
        .speed-btn.minus::before,
        .speed-display::before,
        .speed-display::after {
            content: '';
            position: absolute;
            width: 1px;
            height: 12px;
            background-color: var(--border-default);
            display: var(--show-dividers, block);
        }

        .speed-btn.plus::before {
            right: 0;
        }

        .speed-btn.minus::before {
            left: 0;
        }

        .speed-display::after {
            transform: translateX(18px);
        }

        .speed-display::before {
            transform: translateX(-18px);
        }

        .speed-btn:hover,
        .speed-control-config-popup button:hover {
            background-color: oklab(0 none none/.15);
        }

        .speed-btn:active,
        .speed-control-config-popup button:active {
            background-color: oklab(0 none none/.25);
        }

        .speed-display {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 36px;
            min-width: 36px;
            padding: .5rem;
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
            border: 1px solid var(--border-default);
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
            border: 1px solid rgba(255, 255, 255, 0.27);
            border-radius: 3px;
            background: transparent;
            color: var(--text-primary);
            text-align: center;
            margin-right: 10px;
        }

        .light .speed-control-config-popup input[type="number"] {
            border-color: rgba(0, 0, 0, 0.27);
        }

        .speed-control-config-popup button {
            padding: 4px 8px;
            border: 1px solid rgba(255, 255, 255, 0.27);
            border-radius: 3px;
            background: transparent;
            color: var(--text-secondary);
            cursor: pointer;
        }

        .light .speed-control-config-popup button {
            border-color: rgba(0, 0, 0, 0.27);
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
                    .__menu-item,
                    .rounded-xl,
                    .rounded-3xl,
                    .rounded-b-3xl,
                    .rounded-t-3xl,
                    .rounded-\\[28px\\],
                    .rounded-\\[24px\\],
                    .composer-btn::before,
                    .surface-popover:before {
                        border-radius: 2px !important;
                    }

                    /* popup radii and overlay */
                    .rounded-t-2xl,
                    .rounded-\\[10px\\],
                    .rounded-lg, .rounded-2xl {
                        border-radius: 2px !important;
                    }

                    /* reply radii */
                    .rounded-b-lg,
                    .rounded-\\[14px\\],
                    .rounded-t-\\[20px\\] {
                        border-radius: 0 !important;
                    }

                    /* canvas */
                    main .text-black\\!,
                    #prosemirror-context-children > div,
                    main .shadow-xl:not([role="toolbar"]),
                    main .shadow-lg:not([role="toolbar"]),
                    main div.border-token-border-default.z-70 {
                        border-radius: 0 !important;
                        right: -1px !important;
                        bottom: -1px !important;

                    }

                    .speed-btn,
                    .speed-display,
                    .composer-btn:enabled {
                        border: 1px solid var(--border-default);
                    }

                    :root {
                        --show-dividers: none !important;
                    }

                    .bg-token-border-default {
                        background-color: transparent;
                    }

                    button.composer-btn[data-pill="true"][aria-haspopup="menu"] {
                        margin-left: 8px;
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
        savedSpeed = await GM.getValue('defaultSpeed', 1);
        playbackSpeed = savedSpeed;
        lastUserRate = playbackSpeed;

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
