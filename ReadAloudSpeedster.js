// ==UserScript==
// @name         Read Aloud Speedster
// @description  Set playback speed for Read Aloud on ChatGPT.com, navigate between messages, choose a custom avatar by entering an image URL, and open a settings menu by clicking the speed display to toggle additional UI tweaks. Features include color-coded icons under ChatGPT's responses, highlighted color for bold text, compact sidebar, square design, and more.
// @author       Tim Macy
// @license      AGPL-3.0-or-later
// @version      4.3
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
*                    Version: 4.3 - Read Aloud Speedster                *
*                                                                       *
*             Visit: https://github.com/TimMacy                         *
*                                                                       *
************************************************************************/

(function() {
    'use strict';
    const className = "sm:mt-5";
    const escapedClassName = CSS.escape(className);
    const escapeURL = url => url.replace(/["\\]/g,'\\$&');
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        /**************************************
                 default root settings
        **************************************/

        :root {
            --user-chat-width: 100%; // original 70%
            --sidebar-width: 260px;
            --sidebar-section-margin-top: 1.25rem;
            --sidebar-section-first-margin-top: .5rem;
            --sidebar-rail-width: calc(var(--spacing)*13);
            --header-height: calc(var(--spacing)*13);
            --white: #fff;
            --black: #000;
            --gray-50: #f9f9f9;
            --gray-100: #ececec;
            --gray-200: #e3e3e3;
            --gray-300: #cdcdcd;
            --gray-400: #b4b4b4;
            --gray-500: #9b9b9b;
            --gray-600: #676767;
            --gray-700: #424242;
            --gray-750: #2f2f2f;
            --gray-800: #212121;
            --gray-900: #171717;
            --gray-950: #0d0d0d;
            --red-500: #e02e2a;
            --red-700: #911e1b;
            --brand-purple: #ab68ff;
            --yellow-900: #4d3b00;
        }

        /**************************************
                    general settings
        **************************************/

        /* chatbox - reduced vertical margin */
        .${escapedClassName} {
            margin-top: .5rem !important;
            margin-bottom: .25rem !important;
        }

        main button.cursor-pointer.z-10 {
            bottom:50px;
        }

        /* chatbox - fade effect for content */
        main form {
            border-top-left-radius: .25em !important;
            border-top-right-radius: .25em !important;
        }

        #thread-bottom-container {
            box-shadow: 0 -20px 20px 0px var(--main-surface-primary) !important;
        }

        /* copy icon */
        button[aria-label="Copy"],
        div[role="menuitem"]:has(path[d^="M12 7.1a"]),
        header button:has(path[d^="M12.668 10.667C12"]),
        button[data-testid="copy-turn-action-button"] svg,
        button.surface-nav-element:has(svg path[d^="M12 7.1a"]) {
            color: darkorange !important;
            opacity:.9;
        }

        /* copied */
        button:has(svg path[d^="M15.483"]) {
            color: springgreen;
        }

        .light button:has(svg path[d^="M15.483"]) {
            color: limegreen;
        }

        /* thumbs up icon */
        button .icon-md path[d^="M12.1318"],
        button svg path[d^="M10.9153"],
        button[aria-label="Good response"],
        div[role="menuitem"]:has(path[d^="m4.5 4.944"]),
        button[data-testid="good-response-turn-action-button"] svg {
            color: #00ad00 !important;
            opacity:.9;
        }

        /* thumbs down icon */
        button[aria-label="Bad response"],
        button .icon-md path[d^="M11.8727"],
        button svg path[d^="M12.6687"],
        button.surface-nav-element:has(svg path[d^="M11.868 21"]),
        button[data-testid="bad-response-turn-action-button"] svg {
            color: crimson !important;
            opacity:.9;
        }

        /* edit in canvas icon */
        button[aria-label="Edit message"],
        button[aria-label="Edit in canvas"],
        button:has(svg path[d^="M12.0303 4.11328"]) {
            color: yellow !important;
            opacity: .8;
        }

        .light button[aria-label="Edit message"],
        .light button[aria-label="Edit in canvas"],
        .light button:has(svg path[d^="M12.0303 4.11328"]) {
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
        button[aria-label="Read aloud"],
        div[role="menuitem"]:has(path[d^="M9 6.25v5.5"]),
        button[data-testid="voice-play-turn-action-button"] svg {
            color: deepskyblue !important;
            opacity:.9;
        }

        button[aria-label="Stop"] {color: deepskyblue !important;}

        /* share icon */
        article button[aria-label="Share"] {
            opacity:.8;
        }

        /* hover opacity icons */
        :is(
            main button[aria-label="Turn on temporary chat"],
            button[aria-label="Copy"],
            div[role="menuitem"]:has(path[d^="M12 7.1a"]),
            header button:has(path[d^="M12.668 10.667C12"]),
            button[data-testid="copy-turn-action-button"] svg,
            button.surface-nav-element:has(svg path[d^="M12 7.1a"]),
            button .icon-md path[d^="M12.1318"],
            button svg path[d^="M10.9153"],
            button[aria-label="Good response"],
            div[role="menuitem"]:has(path[d^="m4.5 4.944"]),
            button[data-testid="good-response-turn-action-button"] svg,
            button[aria-label="Bad response"],
            button .icon-md path[d^="M11.8727"],
            button svg path[d^="M12.6687"],
            button.surface-nav-element:has(svg path[d^="M11.868 21"]),
            button[data-testid="bad-response-turn-action-button"] svg,
            button[aria-label="Edit message"],
            button[aria-label="Edit in canvas"],
            button:has(svg path[d^="M12.0303 4.11328"]),
            .light button[aria-label="Edit message"],
            .light button[aria-label="Edit in canvas"],
            .light button:has(svg path[d^="M12.0303 4.11328"]),
            button[aria-label="Read aloud"],
            div[role="menuitem"]:has(path[d^="M9 6.25v5.5"]),
            button[data-testid="voice-play-turn-action-button"] svg,
            article button[aria-label="Share"]
        ):hover {opacity:1;}

        main button[aria-label="Turn on temporary chat"] {
            opacity:.7;
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

        /* highlight color - dark mode */
        .markdown strong {
            color: springgreen !important;
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

        /* stop icon size inner */
        #thread-bottom-container .icon-lg {
            height: calc(var(--spacing)*5);
            width: calc(var(--spacing)*5);
        }

        /* select color */
        ::selection {
            background-color: var(--text-primary);
            color: var(--main-surface-tertiary);
        }

        /* change width of chat containers */
        div.text-base.my-auto:has(.bg-token-main-surface-tertiary),
        #thread-bottom-container > div {
            margin: 0 6.263%;
            padding: 0;
        }

        #thread-bottom-container.mb-4.flex.flex-col > #thread-bottom {
            margin: 0 12.525%;
        }

        #thread-bottom > div {
            padding-inline: 0 !important;
            --thread-content-margin: 0 !important;
        }

        [data-message-author-role="user"] > div > div {
            width: 100%;
        }

        .px-\\(--thread-content-margin\\):has([data-message-author-role="user"]) {
            margin: 20px 6.263% 20px 37.574%;
            padding: 0;
        }

        .px-\\(--thread-content-margin\\):has([data-message-author-role="assistant"]) {
            margin: 20px 6.263%;
            padding: 0;
        }

        .grow.overflow-hidden > div > div {
            overflow-x:hidden;
        }

        [class^="_tableContainer_"] {
            padding-right: 12.525%;
        }

        .border-token-border-sharp [class^="_tableContainer_"] {
            padding-right: 0;
        }

        .\\[--composer-overlap-px\\:24px\\] {
            --composer-overlap-px: 0;
        }

        .flex.max-w-full.flex-col.grow:empty + .flex.min-h-\\[46px\\].justify-start [class*="mask-image"] {
            margin-left: calc(6.263% - var(--spacing)*6) !important;
        }

        main div.text-base.my-auto:has(.loading-shimmer) {
            padding-left: 6.263%;
        }

        main .mx-\\[calc\\(--spacing\\(-2\\)-1px\\)\\]:not(.loading-shimmer) {
            margin-left:-6px;
        }

        div.text-base,div[class*="turn-messages"] {
            --thread-content-max-width: unset!important;
            max-width: 1129px;
        }

        #prosemirror-editor-container,
        #prosemirror-editor-container > .markdown.prose {
            width: 100% !important;
        }

        main.min-h-0 .h-full.w-full >.justify-center {
            margin: 0 5dvw !important;
        }

        main div.flex.basis-auto.flex-col .pb-25 {
            padding:0;
        }

        :root:has(#stage-slideover-sidebar) main div.flex.basis-auto.flex-col.grow.overflow-hidden > div {
            position: fixed;
            bottom: 125px;
            height: calc(100dvh - 177px);
            width: -webkit-fill-available;
            width: -moz-available;
            width: fill-available;
        }

        main #thread article div.mt-3.w-full.empty\\:hidden {
            margin-bottom:20px;
        }

        /* menu hover shadow fix */
        .shadow-long:is(.dark *) {
            --tw-shadow: 0px 8px 16px 0px var(--tw-shadow-color,#00000052),0px 0px 1px 0px var(--tw-shadow-color,#0000009e) !important;
            box-shadow: var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow) !important;
            border:1px solid #272727 !important;
        }

        .shadow-long {
            --tw-shadow: 0px 8px 12px 0px var(--tw-shadow-color,var(--shadow-color-1,#00000014)),0px 0px 1px 0px var(--tw-shadow-color,var(--shadow-color-2,#0000009e)) !important;
            box-shadow: var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow) !important;
            border: 1px solid #e6e6e6 !important;
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

        .speed-btn:hover,.speed-control-config-popup button:hover {
            background-color: #ffffff1a;
        }

        .light .speed-btn:hover,.light .speed-control-config-popup button:hover {
            background-color: #0d0d0d05;
        }

        .speed-btn:active,.speed-control-config-popup button:active {
            background-color: #ffffff0d
        }

        .light .speed-btn:active,.light .speed-control-config-popup button:active {
            background-color: #0d0d0d0d
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
            padding: 15px 10px 15px 30px;
            margin-bottom: 4px;
            z-index: 2077;
            display: none;
            flex-direction: column;
            gap: 10px;
            max-height: 40dvh;
            text-rendering:optimizeLegibility !important;
            -webkit-font-smoothing:antialiased !important;
        }

        .speed-control-config-popup .popup-header {
            display: grid;
            grid-template-columns: 1fr auto 1fr;
            align-items: baseline;
            justify-content: center;
            font-family: -apple-system, "Roboto", "Arial", sans-serif;
            color: var(--text-secondary);
            font-weight: 600;
            width: 100%;
            padding-right:20px;
            text-decoration: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
        }

        .speed-control-config-popup .popup-title {
            grid-column: 2;
            text-align: center;
            text-decoration: none;
            text-overflow: ellipsis;
            white-space: normal;
            cursor: pointer;
            display:block;
            opacity: .8;
            cursor: pointer;
            transition: opacity .5s;
        }

        .speed-control-config-popup .popup-content {
            overflow-y: auto;
            overflow-x: hidden;
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 10px;
            padding-bottom: 30px;
            padding-right: 20px;
        }

        .speed-control-config-popup .popup-footer {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
            width: 100%;
            padding-right:20px;
        }

        .speed-control-config-popup .popup-footer a {
            font-family: -apple-system, "Roboto", "Arial", sans-serif;
            font-size: .75rem;
            line-height: 1.5em;
            font-weight: 500;
            color: var(--text-secondary);
            text-decoration: none;
            transition: color 0.2s ease-in-out;
        }

        .speed-control-config-popup .popup-footer a:hover { color: #369eff; }

        .CentAnni-version-label {
            grid-column: 3;
            padding: 0;
            margin: 0 0 0 5px;
            color: ghostwhite;
            cursor: default;
            opacity: .3;
            justify-self: start;
            max-width: 10ch;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-size: 9px;
            line-height: 1.2;
            transition: opacity .5s;
        }

        .speed-control-config-popup .popup-title:hover,.popup-title:hover + .CentAnni-version-label {
            opacity: 1;
        }

        .speed-control-config-popup .popup-footer::before {
            content: "";
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 3.2rem;
            pointer-events: none;
            box-shadow: 0 -30px 20px 0 var(--main-surface-primary);
        }

        .speed-control-config-popup.show {
            display: flex;
        }

        .speed-control-config-popup input {
            transition: border-color 0.2s ease-in-out;
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

        .speed-control-config-popup input[type="url"] {
            flex: 1;
            color: var(--text-primary);
            background: transparent;
            margin-left: 10px;
            border-radius: 3px;
            border: 1px solid rgba(255, 255, 255, .27);
        }

        .light .speed-control-config-popup input[type="url"],
        .light .speed-control-config-popup input[type="number"] {
            border-color: rgba(0, 0, 0, 0.27);
        }

        .speed-control-config-popup input[type="url"]:hover,
        .speed-control-config-popup input[type="number"]:hover {
            border-color: color(display-p3 0.1216 0.3059 0.5804)
        }

        .speed-control-config-popup input[type="url"]:focus,
        .speed-control-config-popup input[type="number"]:focus {
            border-color: color(display-p3 0 0.402 1)
        }

        .speed-control-config-popup .toggle-label {
            width: 100%;
            padding-left: 10px;
        }

        .speed-control-config-popup input[type="checkbox"],
        .speed-control-config-popup .toggle-label:hover {
            text-decoration: underline;
            cursor: pointer;
        }

        .speed-control-config-popup .speed-label {
            user-select: none;
            pointer-events: none;
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
        }

        .CentAnni-style-nav-btn.enabled  {
            opacity: 1;
        }

        .CentAnni-style-nav-btn.disabled {
            opacity: .5;
        }

        .CentAnni-style-nav-btn:active {
            opacity: .8;
        }
    `;

    // append css
    (document.head
        ? Promise.resolve(document.head)
        : new Promise(resolve => {
            document.readyState === 'loading'
                ? document.addEventListener('DOMContentLoaded', () => resolve(document.head),{once:true})
                : resolve(document.head);
        })
    ).then(head => {
        if (head)
            head.appendChild(styleSheet);
        else {
            document.documentElement.appendChild(styleSheet);
            console.error("Read Aloud Speedster: Failed to find head element. Using backup to append stylesheet.");
        }
    });

    const features = {
        squareDesign: {
            label: 'Square Design',
            enabled: false,
            sheet: null,
            style: `
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
                .rounded-md,
                .__menu-item,
                .rounded-xl,
                .rounded-3xl,
                .rounded-b-3xl,
                .rounded-t-3xl,
                .rounded-\\[36px\\],
                .rounded-\\[28px\\],
                .rounded-\\[24px\\],
                .composer-btn::before,
                .surface-popover:before,
                .__menu-item-trailing-btn {
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

                main div:has(.loading-shimmer) a>span.rounded-ee-full,
                main div:has(.loading-shimmer) a>span.rounded-se-full {
                    border-start-end-radius: 2px;
                    border-end-end-radius: 2px;
                }
            `
        },
        darkerMode: {
            label: "Darker Background for Header and Chatbox",
            enabled: false,
            sheet: null,
            style: `
                main form > div:first-child {
                    background-color: #141414 !important;
                    border: 1px solid #2d2d2d;
                }

                .h-header-height {
                    background: #181818 !important;
                }
            `
        },
        jumpToChat: {
            label: "Navigate to User's Responses Instead of ChatGPT's",
            enabled: false,
            sheet: null,
            style: ``
        },
        heightUserMessage: {
            label: "User Message Height Limiter",
            enabled: true,
            sheet: null,
            style: `
                div[data-message-author-role="user"]  div.whitespace-pre-wrap {
                    max-height: 25dvh;
                    overflow:auto;
                    padding-right:15px;
                }

                div[data-message-author-role="user"]  div.relative {
                    padding-right:5px;
                }

                main .bg-token-main-surface-tertiary {
                    padding-right:0;
                }

                main .bg-token-main-surface-tertiary .justify-end,
                main .bg-token-main-surface-tertiary>div.overflow-auto {
                    padding-right:12px;
                }
            `
        },
        hideShareIcon: {
            label: "Hide Share Icon",
            enabled: false,
            sheet: null,
            style: `
                article button[aria-label="Share"] {
                    display: none;
                }
            `
        },
        keepIconsVisible: {
            label: "Keep Icons Visible",
            enabled: false,
            sheet: null,
            style: `
                main [class*="[mask-image"] {
                    mask-image: none !important;
                    -webkit-mask-image: none !important;
                }

                .group\\/turn-messages .pointer-events-none.opacity-0 {
                    opacity: 1 !important;
                    pointer-events: auto !important;
                }
            `
        },
        reduceAnimation: {
            label: "No Icon Animation",
            enabled: false,
            sheet: null,
            style: `
                .motion-safe\\:transition-opacity {
                    transition-duration: unset;
                    transition-property: none;
                    transition-timing-function: unset;
                }
            `
        },
        hidePlusAvatar: {
            label: "Hide Plus/Pro Icon in Avatar",
            enabled: false,
            sheet: null,
            style: `
                header button[aria-label="Open profile menu"] span,
                main button[aria-label="Open Profile Menu"] span span,
                #page-header #conversation-header-actions button[aria-label="Open profile menu"] span {
                    display: none;
                }
            `
        },
        hideViewPlans: {
            label: "Hide 'View plans'",
            enabled: true,
            sheet: null,
            style: `
                div.__menu-item:has(svg path[d^="M8.44824"]) {
                    display: none !important;
                }
            `
        },
        hideGetProBtn: {
            label: "Hide 'Get Pro' Button",
            enabled: false,
            sheet: null,
            style: `
                .flex > button.btn-primary:first-child:last-child {
                    display: none;
                }
            `
        },
        hideDictateBtn: {
            label: "Hide 'Dictate' Button",
            enabled: false,
            sheet: null,
            style: `
                button[aria-label="Dictate button"] {
                    display: none;
                }
            `
        },
        disableVoiceModeBtn: {
            label: "Disable Voice Mode Button",
            enabled: false,
            sheet: null,
            style: `
                button[aria-label="Start voice mode"] {
                    pointer-events: none;
                    opacity: 0.5;
                }
            `
        },
        hideMistakesTxt: {
            label: "Hide 'ChatGPT can make mistakes' Text",
            enabled: false,
            sheet: null,
            style: `
                div.text-token-text-secondary[class*="md:px-"] {
                    display: none;
                }

                .xl\\:px-5, main form {
                    padding-bottom: 1rem;
                }
            `
        },
        codexNxtSora: {
            label: "Codex and Sora Buttons Next to Each Other",
            enabled: true,
            sheet: null,
            style: `
                nav > aside > a.group.__menu-item#sora,
                nav > aside > a.group.__menu-item[href="/codex"] {
                    width:calc(50% - 6px);
                }

                nav > aside > a.group.__menu-item#sora {
                    transform:translate(100%,-100%);
                    margin-bottom:-36px;
                }
            `
        },
        projectNxtMore: {
            label: "'New project' and 'See more' Buttons Next to Each Other",
            enabled: true,
            sheet: null,
            style: `
                nav #snorlax-heading {
                    display:flex;
                    flex-direction:column;
                }

                nav > #snorlax-heading > div:first-child,
                nav > #snorlax-heading > div:last-child {
                    width:calc(50% - 6px);
                }

                nav > #snorlax-heading > div:last-child {
                    position: absolute;
                    transform:translateX(100%);
                    flex-direction:row-reverse;
                    padding:8px 10px 8px 20px;
                    order:-1;
                }
            `
        },
        navIconsUp: {
            label: "Compact Search and Library Buttons",
            enabled: true,
            sheet: null,
            style: `
                nav > aside > a:has(svg path[d^="M2.6687"]),
                nav > aside > div:has(svg path[d^="M14.0857"]) div.text-token-text-tertiary,
                nav > aside > a:has(svg path[d^="M9.38759"]) div.text-token-text-tertiary {
                    display: none;
                }

                .tall\\:top-header-height,
                nav > aside.last\\:mb-5.mt-\\(--sidebar-section-first-margin-top\\) {
                    height: 0;
                    padding:0;
                    margin-bottom: -8px;
                }

                nav > aside > div:has(svg path[d^="M14.0857"]),nav > aside > a:has(svg path[d^="M9.38759"]) {
                    margin: 0;
                    z-index: 31;
                    color: var(--text-tertiary);
                }

                nav > aside > div:has(svg path[d^="M14.0857"]) {
                    transform: translate(52px, -44px);
                    width: 40px;
                }

                nav > aside > a:has(svg path[d^="M9.38759"]) {
                    transform: translate(100px, -80px);
                    width: 92px;
                }

                nav > aside > div:has(svg path[d^="M14.0857"]):hover,
                nav > aside > a:has(svg path[d^="M9.38759"]):hover,
                nav button:has(svg path[d^="M6.83496"]):hover {
                    color:var(--text-primary);
                }
            `
        },
        sidebarSections: {
            label: "Compact Sidebar with Separators",
            enabled: true,
            sheet: null,
            style: `
                nav .__menu-item:not(:has(svg path[d^="M14.0857"])):not(:has(svg path[d^="M9.38759"])),
                nav .__menu-item-trailing-btn {
                    min-height: calc(var(--spacing)*8);
                    max-height:32px;
                }

                .self-stretch {
                    align-self:center;
                }

                nav .__menu-item-trailing-btn:hover {
                    background: rgba(255, 255, 255, .1);
                }

                nav .light .__menu-item-trailing-btn:hover {
                    background: rgba(1, 1, 1, .1);
                }

                nav .mt-\\(--sidebar-section-first-margin-top\\),
                nav .pt-\\(--sidebar-section-first-margin-top\\),
                nav .mt-\\(--sidebar-section-margin-top\\),
                nav .pt-\\(--sidebar-section-margin-top\\) {
                    margin-top: 10px!important;
                    padding: 0!important;
                }

                nav .mt-\\(--sidebar-section-first-margin-top\\)::before,
                nav .pt-\\(--sidebar-section-first-margin-top\\)::before,
                nav .mt-\\(--sidebar-section-margin-top\\)::before,
                nav .pt-\\(--sidebar-section-margin-top\\)::before {
                    content: '';
                    position: absolute;
                    width: 100%;
                    height: 1px;
                    background-color: color(srgb 1 1 1 / 0.17);
                    display: block;
                    transform: translateY(-5px);
                }

                nav .light .mt-\\(--sidebar-section-first-margin-top\\)::before,
                nav .light .pt-\\(--sidebar-section-first-margin-top\\)::before,
                nav .light .mt-\\(--sidebar-section-margin-top\\)::before,
                nav .light .pt-\\(--sidebar-section-margin-top\\)::before {
                    background-color: color(srgb 0 0 0 / 0.17);
                }

                nav .tall\\:top-header-height {
                    margin-top:0!important;
                }

                nav .tall\\:top-header-height::before {
                    background-color:transparent;
                }

                .tall\\:top-header-height,
                nav > aside.last\\:mb-5.mt-\\(--sidebar-section-first-margin-top\\) {
                    margin-bottom: -10px!important;
                }

                nav > #history > aside > h2 {
                    padding:3px 10px 0 10px;
                }
            `
        },
        justifyText: {
            label: "Justify Text",
            enabled: true,
            sheet: null,
            style: `
                .markdown {
                    text-align: justify;
                }

                .markdown h1 {
                    text-align: left;
                }
            `
        },
        removeFocusOutlines: {
            label: "Remove Focus Outlines",
            enabled: false,
            sheet: null,
            style: `
                :focus {
                    outline: none;
                    box-shadow: 0 0 0 0 transparent;
                }

                [data-testid="profile-button"] .group-focus-visible\\:ring-2 {
                    --tw-ring-shadow: 0 0 #0000;
                    --tw-ring-offset-shadow: 0 0 #0000;
                }
            `
        },
        changeAvatar: {
            label: "Custom Avatar",
            enabled: false,
            sheet: null,
            style: `
                [data-testid="profile-button"] img[alt="Profile image"] {
                    content: url("setAvatarURL");
                }
            `
        },
    };

    function applyFeature(key) {
        const feature = features[key];
        if (!feature) return;
        if (feature.enabled) {
            if (feature.style && !feature.sheet) {
                feature.sheet = document.createElement('style');
                feature.sheet.textContent = feature.style;
                document.head.appendChild(feature.sheet);
            }
        } else if (feature.sheet) {
            feature.sheet.remove();
            feature.sheet = null;
        }
    }

    // load feature settings from config or use defaults
    const loadCSSsettings = async () => {
        // apply defaults immediately
        for (const key in features) applyFeature(key);

        // fetch stored values concurrently
        const entries = await Promise.all(Object.keys(features).filter(key => key !== 'changeAvatar').map(async key => [key, await GM.getValue(key)]));

        for (const [key, value] of entries) {
            if (value !== undefined) {
                features[key].enabled = value;
                applyFeature(key);
            }
        }
    };loadCSSsettings();

    let speedDisplayElement = null;
    let playingAudio = new Set();
    let playListener = null;
    let rateListener = null;
    let controlsContainer = null;
    let configPopup = null;
    let docListenerActive = false;
    let observer = null;
    let playbackSpeed = 1;
    let ignoreRateChange = false;
    let lastUserRate = playbackSpeed;
    let savedSpeed;
    let savedAvatarURL;

    const MIN_SPEED = 1;
    const MAX_SPEED = 17;
    const DELTA = 0.25;

    // load playback speed
    async function initializeSpeed() {
        savedSpeed = await GM.getValue('defaultSpeed', 1);
        playbackSpeed = savedSpeed;
        lastUserRate = playbackSpeed;

        savedAvatarURL = await GM.getValue('avatarURL','');
        const sanitizedURL = escapeURL(savedAvatarURL);
        features.changeAvatar.style = savedAvatarURL?features.changeAvatar.style.replace('setAvatarURL',sanitizedURL):features.changeAvatar.style;
        features.changeAvatar.enabled = !!savedAvatarURL;

        applyFeature('changeAvatar');
        updateSpeedDisplay();
        setPlaybackSpeed();
    }

    // set playback speed and manage listeners
    function setPlaybackSpeed() {
        playingAudio.forEach(audio => audio.playbackRate = playbackSpeed);

        if (!playListener) {
            playListener = e => {
                const audio = e.target;
                if (!(audio instanceof HTMLAudioElement)) return;
                audio.playbackRate = playbackSpeed;
                playingAudio.add(audio);

                const remove = () => {playingAudio.delete(audio);};
                audio.addEventListener('pause',remove,{once:true});
                audio.addEventListener('ended',remove,{once:true});
            };
            document.addEventListener('play',playListener,true);
        }

        if (!rateListener) {
            rateListener = e => {
                const audio = e.target;
                if (!(audio instanceof HTMLAudioElement)) return;
                if (ignoreRateChange) {ignoreRateChange = false;return;}
                audio.playbackRate = lastUserRate;
            };
            document.addEventListener('ratechange',rateListener,true);
        }
    }

    // config popup
    function createConfigPopup() {
        if (configPopup) {
            document.removeEventListener('click', handleDocumentClick);
            docListenerActive = false;
            configPopup.remove();
        }

        configPopup = document.createElement('div');
        configPopup.classList.add('speed-control-config-popup');

        const headerWrapper = document.createElement('div');
        headerWrapper.classList.add('popup-header');

        const title = document.createElement('a');
        title.href = 'https://github.com/TimMacy/ReadAloudSpeedster';
        title.target = '_blank';
        title.rel = 'noopener';
        title.textContent = 'Read Aloud Speedster';
        title.title = 'GitHub Repository for Read Aloud Speedster';
        title.classList.add('popup-title');

        const versionSpan = document.createElement('span');
        const scriptVersion = GM.info.script.version;
        versionSpan.textContent = `v${scriptVersion}`;
        versionSpan.classList.add('CentAnni-version-label');

        headerWrapper.appendChild(title);
        headerWrapper.appendChild(versionSpan);

        const content = document.createElement('div');
        content.classList.add('popup-content');

        // input for speed
        const speedContainer = document.createElement('div');
        speedContainer.classList.add('toggle-container');

        const speedLabel = document.createElement('span');
        speedLabel.classList.add('speed-label');
        speedLabel.textContent = 'Default Playback Speed';

        const input = document.createElement('input');
        input.id = 'defaultSpeedInput';
        input.type = 'number';
        input.min = MIN_SPEED;
        input.max = MAX_SPEED;
        input.step = DELTA;
        input.value = savedSpeed;

        speedContainer.appendChild(input);
        speedContainer.appendChild(speedLabel);
        content.appendChild(speedContainer);

        // build settings interface
        const toggleElements = [];
        const createElement = (tag,className,attributes = {}) => {
            const element = document.createElement(tag);
            if (className) element.className = className;
            Object.assign(element,attributes);
            return element;
        };

        Object.entries(features).filter(([key]) => key !== 'changeAvatar').forEach(([key,feature]) => {
            const container = createElement('div','toggle-container');
            const checkbox = createElement('input','', {
                type: 'checkbox',
                id: `${key}Toggle`,
                checked: feature.enabled
            });
            const label = createElement('label','toggle-label', {
                textContent: feature.label,
                htmlFor: checkbox.id
            });

            container.append(checkbox,label);
            toggleElements.push({key,checkbox});
            content.appendChild(container);
        });

        const avatarContainer = createElement('div','toggle-container');
        const avatarLabel = createElement('span','speed-label',{textContent:features.changeAvatar.label});
        const avatarInput = createElement('input','', {
            type: 'url',
            placeholder: 'Image URL',
            id: 'avatarUrlInput',
            value: savedAvatarURL||''
        });

        avatarContainer.append(avatarLabel, avatarInput);
        content.appendChild(avatarContainer);

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

            let navChanged = false;
            for (const { key,checkbox } of toggleElements) {
                if (features[key].enabled !== checkbox.checked) {
                    features[key].enabled = checkbox.checked;
                    await GM.setValue(key,features[key].enabled);
                    applyFeature(key);
                    if (key === 'jumpToChat') navChanged = true;
                }
            }

            const url = avatarInput.value.trim();
            await GM.setValue('avatarURL',url);
            savedAvatarURL = url;
            features.changeAvatar.enabled = !!url;

            const sanitizedURL = escapeURL(url);
            url
            ? (features.changeAvatar.style = features.changeAvatar.style.replace(/setAvatarURL|https?:[^\"]+/,sanitizedURL),features.changeAvatar.sheet?features.changeAvatar.sheet.textContent = features.changeAvatar.style:applyFeature('changeAvatar'))
            : applyFeature('changeAvatar');

            if (navChanged) {
                navCleanup?.();
                navCleanup = navBtns();
            }

            configPopup.classList.remove('show');
            if (docListenerActive) {
                document.removeEventListener('click', handleDocumentClick);
                docListenerActive = false;
            }
        }

        saveButton.classList.add('save-button');
        saveButton.addEventListener('click', handleSave);

        configPopup.appendChild(headerWrapper);
        configPopup.appendChild(content);

        const footer = document.createElement('div');
        footer.classList.add('popup-footer');

        const copyrightLink = document.createElement('a');
        copyrightLink.href = 'https://github.com/TimMacy';
        copyrightLink.target = '_blank';
        copyrightLink.rel = 'noopener';
        copyrightLink.textContent = 'Copyright © 2025 Tim Macy';
        copyrightLink.title = 'Copyright © 2025 Tim Macy';

        footer.appendChild(copyrightLink);
        footer.appendChild(saveButton);

        configPopup.appendChild(footer);
        document.body.appendChild(configPopup);

        return configPopup;
    }

    function handleDocumentClick(e) {
        if (!configPopup.contains(e.target) && !e.target.classList.contains('speed-display')) {
            configPopup.classList.remove('show');
            document.removeEventListener('click', handleDocumentClick);
            docListenerActive = false;
        }
    }

    // speed display
    function updateSpeedDisplay() {
        if (speedDisplayElement) {
            speedDisplayElement.textContent = `${playbackSpeed}x`;
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
        speedDisplay.textContent = `${playbackSpeed}x`;
        speedDisplayElement = speedDisplay;

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
            const show = configPopup.classList.toggle('show');

            if (show) {
                if (!docListenerActive) {
                    document.addEventListener('click', handleDocumentClick);
                    docListenerActive = true;
                }
                const rect = e.target.getBoundingClientRect();
                configPopup.style.position = 'absolute';
                configPopup.style.bottom = `${window.innerHeight - rect.top + 10}px`;
                configPopup.style.left = `${rect.left + (rect.width / 2)}px`;
                configPopup.style.transform = 'translateX(-50%)';
            } else if (docListenerActive) {
                document.removeEventListener('click', handleDocumentClick);
                docListenerActive = false;
            }
        }

        minusButton.addEventListener('click', handleMinus);
        plusButton.addEventListener('click', handlePlus);
        speedDisplay.addEventListener('click', handleSpeedClick);

        controlsContainer.appendChild(minusButton);
        controlsContainer.appendChild(speedDisplay);
        controlsContainer.appendChild(plusButton);
        document.querySelector('div[style*="var(--vt-composer-attach-file-action)"],div[data-testid="composer-action-file-upload"]')?.insertAdjacentElement('afterend', controlsContainer);
    }

    // message navigation button section
    const HEADER_OFFSET = 52;
    const UP_ARROW_PATH = 'M10 3.293l-6.354 6.353a1 1 0 001.414 1.414L9 6.414V17a1 1 0 102 0V6.414l3.939 3.939a1 1 0 001.415-1.414L10 3.293z';
    const DOWN_ARROW_PATH = 'M10 16.707l6.354-6.353a1 1 0 00-1.414-1.414L11 13.586V3a1 1 0 10-2 0v10.586L5.061 8.94a1 1 0 10-1.415 1.415L10 16.707z';
    const createIcon = (pathData) => {
        const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
        svg.setAttribute('width','20');
        svg.setAttribute('height','20');
        svg.setAttribute('viewBox','0 0 20 20');
        svg.setAttribute('fill','currentColor');
        const path = document.createElementNS('http://www.w3.org/2000/svg','path');
        path.setAttribute('fill-rule','evenodd');
        path.setAttribute('clip-rule','evenodd');
        path.setAttribute('d',pathData);
        svg.appendChild(path);
        const wrapper = document.createElement('div');
        wrapper.className = 'flex w-full items-center justify-center';
        wrapper.appendChild(svg);
        return wrapper;
    };

    const createNavButton = (pathData,label) => {
        const btn = document.createElement('button');
        btn.className = 'CentAnni-style-nav-btn btn relative btn-ghost text-token-text-primary';
        btn.setAttribute('aria-label',label);
        btn.appendChild(createIcon(pathData));
        return btn;
    };

    const upBtn = createNavButton(UP_ARROW_PATH, 'Jump to previous message');
    const downBtn = createNavButton(DOWN_ARROW_PATH, 'Jump to next message');

    let navCleanup = null;
    function navBtns() {
        const targetChat = document.querySelector('main > #thread div.flex.basis-auto.flex-col.grow');
        const actions = document.querySelector('#conversation-header-actions');
        const shareBtn = actions.querySelector('button[aria-label="Share"]');
        if (!shareBtn || !actions || !targetChat) return;

        let chatObserver = null;
        let messageCache = [];

        const role = features.jumpToChat?.enabled?'user':'assistant';
        const queryMessages = () => Array.from(targetChat.querySelectorAll(`article:has([data-message-author-role="${role}"]:not([data-message-id^="placeholder-request"]))`));
        const populateCache = () => {messageCache = queryMessages();};

        const getNextMessage = () => {
            const current = window.scrollY + HEADER_OFFSET;
            for (const msg of messageCache) {
                const top = msg.getBoundingClientRect().top + window.scrollY;
                if (top > current + 1) return msg;
            }
            return null;
        };

        const getPrevMessage = () => {
            const current = window.scrollY + HEADER_OFFSET;
            for (let i = messageCache.length - 1; i >= 0; i--) {
                const rect = messageCache[i].getBoundingClientRect();
                const top = rect.top + window.scrollY;
                const bottom = rect.bottom + window.scrollY;
                if (top < current && bottom > current) return messageCache[i];
                if (bottom < current - 1) return messageCache[i];
            }
            return null;
        };

        const checkForNewBelow = () => {
            const msgs = queryMessages();
            if (msgs.length > messageCache.length) {
                const newMsgs = msgs.slice(messageCache.length);
                messageCache.push(...newMsgs);
                const current = window.scrollY + HEADER_OFFSET;
                for (const msg of newMsgs) {
                    const top = msg.getBoundingClientRect().top + window.scrollY;
                    if (top > current + 1) return msg;
                }
            }
            return null;
        };

        const setState = (btn, enabled) => {
            btn.classList.toggle("enabled",enabled);
            btn.classList.toggle("disabled",!enabled);
        };

        const update = () => {
            setState(upBtn,!!getPrevMessage());
            setState(downBtn,!!getNextMessage());
        };

        const jump = (prev) => {
            let target = prev?getPrevMessage():getNextMessage();
            if (!prev && !target) target = checkForNewBelow();
            if (target) target.scrollIntoView({behavior:'auto',block:'start'});
            update();
        };

        const createButtons = () => {
            if (document.body.contains(upBtn)) return;

            upBtn.onclick = () => jump(true);
            downBtn.onclick = () => jump(false);

            actions.insertBefore(downBtn,shareBtn);
            actions.insertBefore(upBtn,downBtn);

            populateCache();
            startObserver();
        };

        const startObserver = () => {
            if (chatObserver||!targetChat) return;
            if (queryMessages().length) {
                populateCache();
                update();
                return;
            }

            chatObserver = new MutationObserver(() => {
                if (queryMessages().length) {
                    populateCache();
                    stopObserver();
                    setTimeout(update,250);
                }
            });
            chatObserver.observe(targetChat,{childList:true});
        };

        const stopObserver = () => {
            if (chatObserver) {
                chatObserver.disconnect();
                chatObserver = null;
            }
        };

        createButtons();

        return () => {
            stopObserver();
            messageCache = [];
            upBtn.remove();
            downBtn.remove();
        };
    }

    // initialization after DOM has loaded
    function init() {
        observer = new MutationObserver(mutations => {
            const hasMainMutations = mutations.some(mutation => mutation.target.closest("#main"));
            if (!hasMainMutations)return;

            // observer for new audio elements
            const audioFound = mutations.some(mutation => Array.from(mutation.addedNodes).some(node => node.nodeName === 'AUDIO' || (node.querySelector && node.querySelector('audio'))));

            // handle UI updates and audio playback speed
            if (audioFound) setPlaybackSpeed();
            if (!document.body.contains(controlsContainer)) createControlButtons();
            if (!document.querySelector('#conversation-header-actions button[aria-label="Jump to next message"]')) {
                navCleanup?.();
                navCleanup = navBtns();
            }
        });

        if (document.body) {
            observer.observe(document.body,{childList:true,subtree:true});

            initializeSpeed();
            createControlButtons();
            navCleanup = navBtns();
        }
    }

    // wait for document to be ready
    document.readyState === "loading"?document.addEventListener("DOMContentLoaded", init,{once:true}):init();
})();
