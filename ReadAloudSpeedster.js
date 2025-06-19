// ==UserScript==
// @name         Read Aloud Speedster
// @description  Set playback speed for Read Aloud on ChatGPT.com. Clicking the speed display opens a settings menu to save the default playback speed and toggle additional UI tweaks. Additionally, adds color-coded icons for copy, thumbs up, thumbs down, edit, read aloud, and stop buttons. Highlight color for strong text is green in dark mode and violet in light mode.
// @author       Tim Macy
// @license      AGPL-3.0-or-later
// @version      3.8.2
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
*                    Version: 3.8.2 - Read Aloud Speedster              *
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
            height: calc(var(--spacing)*5);;
            width: calc(var(--spacing)*5);;
        }

        /* select color */
        ::selection {
            background: #00519d;
            /* cent'anni
            background-color: var(--text-primary);
            color: var(--main-surface-tertiary);
            */
        }

        /* change width of chat containers */
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
            max-width: 100%;
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

        .bottom-8 {
            bottom: .5rem;
        }

        .flex.max-w-full.flex-col.grow:empty + .flex.min-h-\\[46px\\].justify-start [class*="mask-image"] {
            margin-left: calc(6.263% - var(--spacing)*6) !important;
        }

        main div:has(> .loading-shimmer) {
            margin-left: 6.263%;
        }

        div.text-base,div[class*="turn-messages"] {
            --thread-content-max-width: unset!important;
            max-width: 1129px;
        }

        #prosemirror-editor-container,
        #prosemirror-editor-container > .markdown.prose {
            width: 100% !important;
        }

        main .h-full.w-full >.justify-center {
            margin: 0 5dvw !important;
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
            padding: 15px 30px;
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
            width: 100%
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
        }

        .speed-control-config-popup .popup-footer {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
            width: 100%;
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

        .light .speed-control-config-popup input[type="number"] {
            border-color: rgba(0, 0, 0, 0.27);
        }

        .speed-control-config-popup input[type="number"]:hover {
            border-color: color(display-p3 0.1216 0.3059 0.5804)
        }

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
    `;

    // append css
    (document.head
        ? Promise.resolve(document.head)
        : new Promise(resolve => {
            if (document.readyState === 'loading')
                document.addEventListener('DOMContentLoaded', () => resolve(document.head),{once:true});
            else resolve(document.head);
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
            enabled: true,
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
        CodexNxtSora: {
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
                    margin-bottom: -10px!important;
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
                nav .__menu-item,
                nav .__menu-item-trailing-btn {
                    min-height: calc(var(--spacing)*8);
                    max-height:35px;
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
            label: "Remove Focus Outlines (used for keyboard users and screen readers)",
            enabled: false,
            sheet: null,
            style: `
                :focus {
                    outline: none;
                    box-shadow: 0 0 0 0 transparent;
                }
            `
        },
    };

    function applyFeature(key) {
        const feature = features[key];
        if (!feature) return;
        if (feature.enabled) {
            if (!feature.sheet) {
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
        // Apply defaults immediately
        for (const key in features) {
            applyFeature(key);
        }

        // Fetch stored values concurrently
        const entries = await Promise.all(
            Object.keys(features).map(async key => [key, await GM.getValue(key)])
        );

        for (const [key, value] of entries) {
            if (value !== undefined) {
                features[key].enabled = value;
                applyFeature(key);
            }
        }
    };loadCSSsettings();

    let speedDisplayElement = null;
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

    // load playback speed
    async function initializeSpeed() {
        savedSpeed = await GM.getValue('defaultSpeed', 1);
        playbackSpeed = savedSpeed;
        lastUserRate = playbackSpeed;

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

        const headerWrapper = document.createElement('div');
        headerWrapper.classList.add('popup-header');

        const title = document.createElement('a');
        title.classList.add('popup-title');
        title.href = 'https://github.com/TimMacy/ReadAloudSpeedster';
        title.target = '_blank';
        title.rel = 'noopener';
        title.textContent = 'Read Aloud Speedster';

        const versionSpan = document.createElement('span');
        const scriptVersion = GM.info.script.version;
        versionSpan.innerText = `v${scriptVersion}`;
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

        const toggleElements = [];
        for (const key in features) {
            const container = document.createElement('div');
            container.classList.add('toggle-container');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `${key}Toggle`;
            checkbox.checked = features[key].enabled;
            const label = document.createElement('label');
            label.classList.add('toggle-label');
            label.textContent = features[key].label;
            label.htmlFor = checkbox.id;
            container.appendChild(checkbox);
            container.appendChild(label);
            toggleElements.push({ key, checkbox });
            content.appendChild(container);
        }

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

            for (const { key, checkbox } of toggleElements) {
                features[key].enabled = checkbox.checked;
                await GM.setValue(key, features[key].enabled);
                applyFeature(key);
            }

            configPopup.classList.remove('show');
        }

        saveButton.classList.add('save-button');
        saveButton.addEventListener('click', handleSave);

        document.addEventListener('click', handleDocumentClick);

        configPopup.appendChild(headerWrapper);
        configPopup.appendChild(content);

        const footer = document.createElement('div');
        footer.classList.add('popup-footer');

        const copyrightLink = document.createElement('a');
        copyrightLink.href = 'https://github.com/TimMacy';
        copyrightLink.target = '_blank';
        copyrightLink.rel = 'noopener';
        copyrightLink.textContent = 'Copyright © 2025 Tim Macy';

        footer.appendChild(copyrightLink);
        footer.appendChild(saveButton);

        configPopup.appendChild(footer);
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
        if (speedDisplayElement) {
            // speedDisplayElement.textContent = `${playbackSpeed.toFixed(2)}x`; // display speed with always two decimals
            speedDisplayElement.textContent = `${playbackSpeed}x`; // raw speed value without formatting
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
        controlsContainer = null;
        speedDisplayElement = null;
        configPopup?.remove();
    }

    // initialize everything when DOM is fully loaded
    function init() {
        // observer for new audio elements
        observer = new MutationObserver(mutations => {
            if (!document.body.contains(controlsContainer)) createControlButtons();

            let audioFound = false;
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeName === 'AUDIO' || (node.querySelector && node.querySelector('audio'))) {
                        audioFound = true;
                        break;
                    }
                }
                if (audioFound) break;
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
