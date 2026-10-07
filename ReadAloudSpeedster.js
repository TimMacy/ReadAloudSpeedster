// ==UserScript==
// @name         Read Aloud Speedster
// @description  Set playback speed for Read Aloud on ChatGPT.com, navigate between messages, and open a settings menu by clicking the speed display to toggle additional UI tweaks. Features include color-coded icons under ChatGPT's responses, highlighted color for bold text, compact sidebar, square design, and more.
// @author       Tim Macy
// @license      AGPL-3.0-or-later
// @version      6.2
// @namespace    TimMacy.ReadAloudSpeedster
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chatgpt.com
// @match        https://chatgpt.com/*
// @exclude      https://chatgpt.com/codex/*
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
*                    Copyright © 2026 Tim Macy                          *
*                    GNU Affero General Public License v3.0             *
*                    Version: 6.2 - Read Aloud Speedster                *
*                                                                       *
*             Visit: https://github.com/TimMacy                         *
*                                                                       *
************************************************************************/

(function () {
    'use strict';
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        :root {
            /* colors */
            --CentAnniBlue: rgb(1 105 204);
            --CentAnniBlue-hover: rgb(0 111 222);
            --primaryDefault: var(--color-background-composer-primary, var(--CentAnniBlue));
            --primaryDefault-hover: color-mix(in srgb, var(--primaryDefault), white 10%);
            --color-surface-sidebar: var(--color-surface);

            --transparent-header-bg: black;
            &.light {
                --transparent-header-bg: white;
            }
        }


        /**************************************
                         colors
        **************************************/

        button[aria-label="Send"],
        button[aria-label="Stop"],
        button[aria-label="Start Voice"] {
            transition: opacity .165s cubic-bezier(.5, 1, .9, 1);
            &:hover {
                opacity: .8;
            }
        }

        /* sidebar pinned, project, recents */
        nav[role="navigation"][aria-label="Chat history"] {
            section .truncate,
            .shrink-0.text-xs.text-tertiary {
                text-transform: lowercase;
                color: var(--primaryDefault);
            }

            .shrink-0.text-xs.text-tertiary.hidden {
                display: inline;
            }
        }

        nav[role="navigation"] .text-codex-description,
        [role="presentation"].items-center.justify-center .motion-safe\\:animate-spin svg {
            color: var(--primaryDefault);
        }

        nav section .opacity-75 {
            opacity: 1;
        }

        nav[role="navigation"] a[aria-current="page"] {
            color: var(--app-color-text-foreground, var(--primaryDefault), inherit);
        }

        /* copy icon */
        button[aria-label^="Copy"] {
            color: darkorange;
            opacity: .9;
        }

        /* copied */
        button[aria-label$="copied" i] {
            color: springgreen;
        }

        .light button[aria-label$="copied" i] {
            color: limegreen;
        }

        /* thumbs up icon */
        aside button[aria-label="Yes"],
        [role="menu"][data-state="open"] [role="menuitem"] svg:has(path[d^="M11.2942 1.84473"]) {
            color: #00ad00 !important;
        }

        /* thumbs down icon */
        aside button[aria-label="No"],
        [role="menu"][data-state="open"] [role="menuitem"] svg:has(path[d^="M14.2282 1.83496"]) {
            color: crimson !important;
        }

        /* edit in canvas icon */
        button[aria-label="Edit message"] {
            color: yellow !important;
            opacity: .8;
        }

        .light button[aria-label="Edit message"] {
            color: indigo !important;
            opacity: .8;
        }

        /* switch model icon */
        button[aria-label="Regenerate response"][data-state="open"] {
            color: var(--text-primary);
        }

        /* read aloud and stop icon */
        #CentAnni-speak-btn svg,
        button[aria-label="Preview"],
        button[aria-label="Read aloud"],
        [role="menuitem"]:has(> div > span > svg path[d^="M9.75122 4.09203"]) svg,
        button[aria-label="Stop reading aloud"] svg {
            color: deepskyblue !important;
            opacity: .9;
        }

        button[aria-label="Loading audio…"] {
            opacity: 1;
            color: deepskyblue !important;
        }

        button[aria-label="Temporary chat"] {
            opacity: .7;
        }

        :is(button[aria-label^="Copy"],
        button[aria-label$="copied" i],
        #CentAnni-speak-btn svg,
        button[aria-label="Read aloud"],
        [role="menuitem"]:has(> div > span > svg path[d^="M9.75122 4.09203"]) svg,
        button[aria-label="Stop reading aloud"] svg,
        button[aria-label="Temporary chat"],
        button[aria-label="Preview"]):hover {
            opacity: 1;
        }

        /* highlight color */
        strong.font-semibold {
            color: var(--primaryDefault, var(--CentAnniBlue-hover));
        }

        [aria-label="Composer mode"] span.pointer-events-none.rounded-full.relative {
            border: 1px solid var(--primaryDefault, var(--CentAnniBlue-hover));
        }

        /* pin and unpin color */
        button[aria-label="Pin chat"],
        button[aria-label="Unpin chat"] {
            color: darkorange;
        }

        /* red delete color */
        .text-danger {
            --color-text-danger: #e02e2a;

            &:hover {
                color: white;
                background-color: rgb(255 0 0 / 50%);
            }
        }

        /* chat container and content width */
        [data-pip-obstacle="thread-footer"] {
            margin: 0;
            width: 100%;
            padding: 0 16px;
            max-width: unset;
            box-sizing: border-box;
        }

        [data-thread-user-message-navigation-content="true"] {
            margin: 0;
            max-width: unset;
            padding: 0 6.263%;
            box-sizing: border-box;
        }

        /**************************************
                 Read Aloud Speedster
        **************************************/
        .speed-control-container {
            display: flex;
            z-index: 2077;
            align-items: center;
            background-color: var(--composer-layout-surface-background);
        }

        .speed-btn {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 36px;
            min-width: 0;
            width: 0;
            opacity: 0;
            font-size: .75rem;
            line-height: 1rem;
            font-weight: 600;
            border-radius: 50%;
            pointer-events: none;
            background: transparent;
            color: var(--color-text-secondary, gray);
            cursor: pointer;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            transition: width .5s linear(0, 0.887 15.2%, 1.149 23.6%, 1.296 32.6%, 1.338 39.8%, 1.326 48%, 1.053 82%, 1);

            .speed-control-container:hover & {
                opacity: 1;
                color: var(--app-color-text-foreground, var(--primaryDefault));
                width: 36px;
                pointer-events: auto;
                transition: width .5s linear(0, 0.887 15.2%, 1.149 23.6%, 1.296 32.6%, 1.338 39.8%, 1.326 48%, 1.053 82%, 1) .3s, opacity .5s cubic-bezier(0.4, 0, 0.69, 1) .3s;
            }

            &.plus::before,
            &.plus::after,
            &.minus::before,
            &.minus::after {
                content: '';
                position: absolute;
                width: 1px;
                height: 12px;
                top: 50%;
                transform: translateY(-50%);
                background-color: color-mix(in oklab, var(--app-color-text-foreground) 25%, transparent);
            }

            &.plus::before,
            &.minus::before {
                left: 0;
            }

            &.plus::after,
            &.minus::after {
                right: 0;
            }
        }

        .speed-btn:hover,
        .speed-control-config-popup button:hover {
            background-color: #ffffff1a;
        }

        .light .speed-btn:hover,
        .light .speed-control-config-popup button:hover {
            background-color: #0d0d0d05;
        }

        .speed-btn:active,
        .speed-control-config-popup button:active {
            background-color: #ffffff0d
        }

        .light .speed-btn:active,
        .light .speed-control-config-popup button:active {
            background-color: #0d0d0d0d
        }

        .speed-display {
            display: flex;
            position: relative;
            align-items: center;
            justify-content: center;
            height: 36px;
            min-width: 0;
            width: fit-content;
            padding: .5rem;
            font-size: .75rem;
            line-height: 1rem;
            font-weight: 600;
            background: transparent;
            color: var(--color-text-secondary, gray);
            cursor: default;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            interpolate-size: allow-keywords;
            transition: width .25s cubic-bezier(0.78, 0, 0.22, 1);

            .speed-control-container:hover & {
                width: 50px;
                color: var(--app-color-text-foreground, var(--primaryDefault));
                transition: width .5s cubic-bezier(0.78, 0, 0.22, 1) .3s, color 0s .3s;
            }
        }

        .speed-control-config-popup {
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            background: var(--color-background-panel, #2d2d2d);
            border: 1px solid var(--border-default);
            border-radius: 3px;
            padding: 15px 10px 15px 30px;
            margin-bottom: 4px;
            z-index: 2077;
            display: none;
            flex-direction: column;
            gap: 10px;
            max-height: 40dvh;
            text-rendering: optimizeLegibility !important;
            -webkit-font-smoothing: antialiased !important;
        }

        .speed-control-config-popup .popup-header {
            display: grid;
            grid-template-columns: 1fr auto 1fr;
            align-items: baseline;
            justify-content: center;
            font-family: -apple-system, "Roboto", "Arial", sans-serif;
            color: var(--color-text-secondary, gray);
            font-weight: 600;
            width: 100%;
            padding-right: 20px;
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
            display: block;
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
            padding-right: 20px;
        }

        .speed-control-config-popup .popup-footer a {
            font-family: -apple-system, "Roboto", "Arial", sans-serif;
            font-size: .75rem;
            line-height: 1.5em;
            font-weight: 500;
            color: var(--color-text-secondary, gray);
            text-decoration: none;
            transition: color .2s ease-in-out;
        }

        .speed-control-config-popup .popup-footer a:hover {
            color: #369eff;
        }

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

        .speed-control-config-popup .popup-title:hover,
        .popup-title:hover + .CentAnni-version-label {
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
            box-shadow: 0 -30px 20px 0 var(--color-background-panel, #2d2d2d);
        }

        .speed-control-config-popup.show {
            display: flex;
        }

        .speed-control-config-popup input {
            transition: border-color 0.2s ease-in-out;
        }

        .speed-control-config-popup input[type="number"] {
            width: 6ch;
            border: 1px solid rgba(255, 255, 255, .27);
            border-radius: 3px;
            background: transparent;
            color: var(--color-text, gray);
            text-align: center;
            margin-right: 10px;
        }

        .speed-control-config-popup input[type="number"] {
            -webkit-appearance: none;
            -moz-appearance: textfield !important;
            appearance: none;
        }

        .speed-control-config-popup input[type="number"]::-webkit-outer-spin-button,
        .speed-control-config-popup input[type="number"]::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }

        .speed-control-config-popup input[type="url"] {
            flex: 1;
            color: var(--color-text, gray);
            background: transparent;
            margin-left: 10px;
            border-radius: 3px;
            border: 1px solid rgba(255 255 255 / .27);
        }

        .light .speed-control-config-popup input[type="url"],
        .light .speed-control-config-popup input[type="number"] {
            border-color: rgba(0 0 0 /.27);
        }

        .speed-control-config-popup input[type="url"]:hover,
        .speed-control-config-popup input[type="number"]:hover {
            border-color: color(display-p3 0.1216 0.3059 0.5804);
        }

        .speed-control-config-popup input[type="url"]:focus,
        .speed-control-config-popup input[type="number"]:focus {
            border-color: color(display-p3 0 0.402 1);
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

        .speed-control-config-popup input[type="checkbox"] {
            -webkit-appearance: checkbox !important;
            appearance: auto !important;
            width: 13px;
            height: 13px;
            flex: 0 0 13px;
        }

        .speed-control-config-popup .work-model-settings {
            display: flex;
            flex-direction: column;
            gap: 8px;
            padding-left: 23px;
        }

        .speed-control-config-popup .work-model-settings[hidden] {
            display: none;
        }

        .speed-control-config-popup .work-model-row {
            display: grid;
            grid-template-columns: auto 1fr 1fr;
            align-items: center;
            gap: 10px;
        }

        .speed-control-config-popup .work-model-settings select {
            min-width: 0;
            padding: 4px;
            cursor: pointer;
            border: 1px solid var(--border-default);
            border-radius: 3px;
            background: #212121;
            color: var(--color-text, gray);
        }

        .speed-control-config-popup .work-model-settings select:disabled {
            opacity: .4;
            cursor: not-allowed;
        }

        .speed-control-config-popup .work-model-hint {
            font-size: 12px;
            color: var(--color-text-secondary, gray);
        }

        .speed-control-config-popup .speed-label {
            user-select: none;
            pointer-events: none;
        }

        .speed-control-config-popup button {
            padding: 4px 8px;
            border: 1px solid rgba(255 255 255 /.27);
            border-radius: 3px;
            background: transparent;
            color: var(--color-text-secondary, gray);
            cursor: pointer;
        }

        .light .speed-control-config-popup button {
            border-color: rgba(0 0 0 / .27);
        }

        .speed-control-config-popup .toggle-container {
            display: flex;
            align-items: center;
            text-wrap: nowrap;
            accent-color: var(--primaryDefault);
        }
    `;

    // append css
    const constructedStyleSheet = new CSSStyleSheet();
    constructedStyleSheet.replaceSync(styleSheet.textContent);
    document.adoptedStyleSheets.push(constructedStyleSheet);

    const features = {
        disableVoiceModeBtn: {
            label: "Disable Voice Mode Button",
            enabled: false,
            sheet: null,
            style: `
                button[aria-label="Start Voice"] {
                    opacity: .5;
                    pointer-events: none;
                }
            `
        },
        heightUserMessage: {
            label: "Make User Message Scrollable",
            enabled: true,
            sheet: null,
            style: `
                div[data-user-message-bubble="true"]:has(button[aria-expanded="false"]) {
                    overflow: auto !important;
                    max-height: 25dvh !important;
                    overscroll-behavior: contain;

                    .overflow-hidden {
                        max-height: unset !important;
                    }

                    button[aria-expanded="false"],
                    span[aria-hidden="true"].block {
                        display: none;
                    }
                }
            `
        },
        hideShareIcon: {
            label: "Hide Share Icon Under Messages",
            enabled: false,
            sheet: null,
            style: `
                div[data-thread-find-target="conversation"] {
                    button[aria-label="Share prompt"],
                    button[aria-label="Share"] {
                        display: none;
                    }
                }
            `
        },
        squareDesign: {
            label: 'Square Design',
            enabled: false,
            sheet: null,
            style: `
                :root {
                    --radius-2xl: 0 !important;
                    --radius-xl: 0 !important;
                    --radius-lg: 0 !important;
                }

                [aria-label="Composer mode"] .rounded-full,
                [data-app-shell-focus-area="main"] .rounded-2xl {
                    border-radius: 0;
                }

                [data-codex-window-type=browser] {
                    --radius-xs-base: 0;
                    --radius-sm-base: 0;
                    --radius-md-base: 0;
                    --radius-lg-base: 0;
                    --radius-3xl-base: 0;
                    --radius-4xl-base: 0;
                }

                [data-markdown-copy="code-block"] .px-4.md\\:px-5.pt-0.pb-3 {
                    padding-top: 12px;
                }

                [data-user-message-bubble="true"] {
                    clip-path: polygon(0 0, 100% 0, 100% calc(100% - calc(var(--spacing) * 3)), calc(100% - calc(var(--spacing) * 3)) 100%, 0 100%);

                    &:has(button[aria-expanded="false"]) {
                        clip-path: polygon(0 0, 100% 0, 100% calc(100% - min(40%, calc(var(--spacing) * 7))), calc(100% - calc(var(--spacing) * 7)) 100%, 0 100%);
                    }
                }

                nav[role="navigation"] div[aria-current="page"] {
                    clip-path: polygon(0 0, 100% 0, 100% calc(100% - calc(var(--spacing) * 3)), calc(100% - calc(var(--spacing) * 3)) 100%, 0 100%);
                }

                [role="dialog"][data-state="open"] form .rounded-button-action {
                    border-radius: 0;
                }
            `
        },
        darkerMode: {
            label: "Darker Background for Sidebar and Chatbox",
            enabled: false,
            sheet: null,
            style: `
                :root {
                    --color-background-user-message: black;
                    --color-surface-sidebar: #181818;
                }

                [aria-label="Composer mode"] span.pointer-events-none {
                    &.absolute {
                        background-color: #111111;
                    }

                    &.relative {
                        background-color: var(--color-surface);
                    }
                }

                [role="dialog"][data-state="open"] form {
                    background-color: #2d2d2d;

                    button[type="submit"].text-chart-red {
                        color: white;
                        background-color: rgb(255 0 0 / 50%);

                        &:hover {
                            background-color: #e02e2a;
                        }
                    }
                }

                #app-shell-sidebar {
                    background-color: #181818;
                }

                [data-markdown-copy="code-block"] {
                    background-color: #111111;
                    background-image: unset;

                    [data-markdown-copy="exclude"] {
                        background-color: #141414;
                        background-image: linear-gradient(rgba(241, 241, 241, 0.078));
                    }
                }

                [class^="ComposerLayoutRoot"] {
                    --composer-layout-surface-background: #141414;
                }

                @layer theme, base, components, utilities;
                @layer components {
                    form[data-composer-placement="home"] [data-composer-layout][data-composer-body],
                    form[data-composer-placement="thread"] [data-composer-layout][role="presentation"],
                    [data-composer-utility-bar-variant="default"][data-composer-radius-variant=default],
                    [data-composer-utility-bar-variant=home][data-composer-radius-variant=default] [class^="ComposerLayoutBody"] {
                        border: 1px solid #2d2d2d !important;
                    }
                }

                .group\\/sidebar-rail[data-app-navigation-rail="true"][aria-label="App navigation"] {
                    background-color: #141414;

                    + .sidebar-navigation {
                        border-radius: 0;
                        background-color: #181818;
                    }
                }

                [data-app-shell-workspace-row="true"] [class^="PageSurface"][aria-hidden="true"] {
                    border-radius: 0;
                }

                /* sidebar bg for without app nav bar */
                aside .bg-surface,aside nav[aria-label="Show sidebar"] {background-color:#181818;}

            `
        },
        keepIconsVisible: {
            label: "Keep Icons Visible",
            enabled: false,
            sheet: null,
            style: `
                .group\\/user-message .opacity-0 {
                    opacity: 1;
                }
            `
        },
        hideMistakesTxt: {
            label: 'Hide "ChatGPT can make mistakes" Text',
            enabled: false,
            sheet: null,
            style: `
                .sticky.bottom-0.self-end .text-codex-description[data-markdown-copy="exclude"],
                [data-thread-scroll-footer="true"] div.relative.z-10.pt-2.\\*\\:pointer-events-auto.empty\\:hidden {
                    display: none;
                }

                [data-thread-scroll-footer="true"] {
                    padding-bottom: 12px;
                }
            `
        },
        sideBarReorder: {
            label: "Keep Projects on Top Under Pinned",
            enabled: false,
            sheet: null,
            style: `
                nav[role="navigation"] [data-sidebar-project-container-id="pinned"] .flex.flex-col[tabindex="-1"]:not([aria-label]) {
                    flex-direction: column-reverse;
                }
            `
        },
        sidebarSections: {
            label: "Compact Sidebar with Separators",
            enabled: false,
            sheet: null,
            style: `
                nav[role="navigation"] {
                    > .gap-\\(--sidebar-navigation-header-gap\\) {
                        gap: 0;
                        padding-top: 6px;
                    }

                    > [data-app-action-sidebar-scroll] {
                        padding: 0;
                        gap: 4px;

                        .browser\\:h-9:where([data-codex-window-type=browser] .browser\\:h-9) {
                            height: fit-content;

                            /*
                            .text-tertiary.opacity-75::before {
                                display: block;
                                position: absolute;
                                left: 0;
                                content: '';
                                height: 1px;
                                width: 100%;
                                transform: translateY(-4px);
                                background-color: color-mix(in srgb, var(--color-text) 25%, transparent);
                            }
                            */
                        }
                    }

                    &::after {
                        position: absolute;
                        bottom: 0;
                        content:'';
                        width: 100%;
                        align-self: baseline;
                        height: calc(var(--spacing) * 4);
                        background-image: linear-gradient(to top, var(--color-surface-sidebar), transparent);
                    }
                }

                [data-app-shell-sidebar-open="true"] nav[aria-label="App navigation"] {
                    width: 36px;

                    > .flex.flex-col {
                        padding: 0;

                        button {
                            border-radius: 0;
                        }
                    }
                }

                /* smaller avatar when app sidebar missing */
                nav[role="navigation"][aria-label="Chat history"] + .bottom-0.z-20 {
                    outline: 1px solid color-mix(in srgb, var(--color-text) 25%, transparent);
                    .h-toolbar{min-height:fit-content;}
                    .group{padding:0 10px;min-height: 24px;}
                    .text-codex-description {display: none;}
                }
            `
        },
        justifyText: {
            label: "Justify Text",
            enabled: false,
            sheet: null,
            style: `
                [data-markdown-text-style="assistant-message"] p[class*="Paragraph"] {
                    text-align: justify;
                }
            `
        },
        listDashes: {
            label: "Replace Bullets with Dashes in Lists",
            enabled: false,
            sheet: null,
            style: `
                [data-chatgpt-conversation-selection-target="true"] [class*="UnorderedList"] {
                    list-style: "-";
                    margin-left: -7px;
                }
            `
        },
        removeFocusOutlines: {
            label: "Remove Focus Outlines",
            enabled: false,
            sheet: null,
            style: `
                :root {
                    --color-ring: transparent;
                }
            `
        },
        transparentHeader: {
            label: "Transparent Header",
            enabled: true,
            sheet: null,
            style: `
                [data-app-shell-active-page="true"] main [class*="MainContentFrame"] {
                    margin-top: 0;
                }

                main [class*="MainContentTopFade"] {
                    display: block;
                }

                header [data-app-shell-main-titlebar="true"] {
                    contain: layout !important;
                    overflow: visible !important;

                    > .ms-auto {
                        margin-top: 8px;
                        align-self: flex-start;
                        flex-direction: column;
                    }

                    .gap-toolbar-action {
                        flex-direction: column-reverse;
                    }

                    button[aria-label="Share"] {
                        gap: 0;
                        width: 36px;
                        padding: 0;
                        border: none;
                        font-size: 0;
                        justify-content: center;
                    }

                    [data-app-shell-thread-content-overlap="true"] {
                        max-width: fit-content;
                        align-self: flex-start;
                        backdrop-filter: blur(1px);
                    }
                }
            `
        },
        jumpToChatActive: {
            label: "Add Message Navigation Arrows",
            enabled: true,
            sheet: null,
            style: `
                .CentAnni-style-nav-btn {
                    position: absolute;
                    display: flex;
                    left: 0;
                    width: 32px;
                    height: 32px;
                    justify-content: center;
                    align-items: center;
                    border-radius: 50%;
                    cursor: pointer;
                    z-index: 9999;
                    background-color: var(--color-surface);
                    pointer-events: auto;

                    &:active {
                        opacity: .8;
                    }

                    &.enabled {
                        opacity: 1;
                    }

                    &.disabled {
                        opacity: .5;
                    }

                    &:hover {
                        opacity: 1;
                        color: var(--primaryDefault);
                    }
                }

                #CentAnni-nav-btn-up {
                    top: -122px;
                }
                #CentAnni-nav-btn-down {
                    top: -90px;
                }
            `
        },
        jumpToChat: {
            label: "Navigate to User's Responses Instead of ChatGPT's",
            enabled: false,
            sheet: null,
            style: ``
        },
        readAloudBtn: {
            label: "Add Button to Read Aloud Last Message",
            enabled: true,
            sheet: null,
            style: `
                #CentAnni-speak-btn {
                    position: absolute;
                    display: flex;
                    top: -40px;
                    left: 0;
                    width: 32px;
                    height: 32px;
                    color: deepskyblue;
                    justify-content: center;
                    align-items: center;
                    border-radius: 50%;
                    cursor: pointer;
                    z-index: 9999;
                    background-color: var(--color-surface);
                    pointer-events: auto;

                    &:hover {
                        background-color: rgba(255, 255, 255, .07);
                    }

                    &:active {
                        color: rgb(0, 251, 255);
                    }

                    form[data-composer-placement="thread"]:has(button[aria-label="Stop"]) &.disabled {
                        pointer-events: none;
                        user-select: none;
                        opacity: .5;
                    }
                }
            `
        },
        modelSelector: {
            label: "Add Quick Model Selector Buttons",
            enabled: true,
            sheet: null,
            style: `
                #CentAnni-gpt-model-quickbar {
                    position: relative;
                    display: flex;
                    gap: 4px;
                    order: 2;
                    margin: 0 4px;
                    background: transparent;
                    text-wrap: nowrap;
                    overflow-y: hidden;
                    overflow-x: auto;
                    scrollbar-width: none;
                }

                .CentAnni-gpt-model-btn.CentAnni-active {
                    border-color: var(--primaryDefault, var(--CentAnniBlue));

                    &:hover {
                        border-color: var(--primaryDefault-hover, var(--CentAnniBlue-hover));
                    }
                }

                .CentAnni-gpt-model-btn {
                    font: 600 12px system-ui, -apple-system, "Segoe UI", Roboto, Ubuntu, Cantarell, "Noto Sans", sans-serif;
                    padding: 8px 10px;
                    border-radius: 3px;
                    border: 1px solid rgba(255 255 255 / .1);
                    background: rgba(255 255 255 / .08);
                    color: white;
                    cursor: pointer;
                    margin-right: 4px;
                    text-box: trim-both cap alphabetic;
                    transition: background-color .4s ease, border-color .4s ease;
                }

                .CentAnni-gpt-model-btn:hover {
                    background: rgba(255 255 255 / .12) !important;
                    border-color: rgba(255 255 255 / .25);
                }

                .CentAnni-gpt-model-btn:active {
                    background: rgba(255 255 255 / .2) !important;
                    border-color: rgba(255 255 255 / .5);
                    transition: background-color .25s ease-out, border-color .1s ease-out;
                }

                html.light .CentAnni-gpt-model-btn {
                    border: 1px solid rgba(0 0 0 / .1);
                    color: black;
                }

                html.light .CentAnni-gpt-model-btn:hover {
                    background: rgb(250 250 250) !important;
                    border-color: rgba(0 0 0 / .2);
                }

                html.light .CentAnni-gpt-model-btn:active {
                    background: rgb(245 245 245) !important;
                    border-color: rgba(0 0 0 / .5);
                }

                .hide-model-picker {
                    form button[aria-label="Select ChatGPT model"] {
                        background: transparent;
                    }

                    [data-radix-popper-content-wrapper]:has([data-model-picker-view]) {
                        opacity: 0;
                    }
                }
            `
        },
        hideModelSelector: {
            label: "Hide Model Selector Unless Hovered",
            enabled: false,
            sheet: null,
            style: `
                form button[aria-haspopup="menu"][data-composer-navigation-target="reasoning"] {
                    opacity: 0;

                    &:hover,
                    &[data-state="open"] {
                        opacity: 1;
                    }
                }

                .hide-model-picker form button[aria-label="Select ChatGPT model"] {
                    opacity: 0 !important;
                }
            `
        }
    };

    function applyFeature(key) {
        const feature = features[key];
        if (!feature) return;
        if (feature.enabled) {
            if (feature.style && !feature.sheet) {
                feature.sheet = new CSSStyleSheet();
                feature.sheet.replaceSync(feature.style);
                document.adoptedStyleSheets.push(feature.sheet);
            }
        } else if (feature.sheet) {
            const index = document.adoptedStyleSheets.indexOf(feature.sheet);
            if (index !== -1) document.adoptedStyleSheets.splice(index, 1);
            feature.sheet = null;
        }
    }

    const workModels = ['Luna', 'Terra', 'Sol', 'Astra'];
    const thinkingModes = ['Light', 'Medium', 'High', 'Extra High', 'Max'];
    let workModelButtons = [
        { model: 'Luna', index: 2 },
        { model: 'Sol', index: 2 },
        { model: 'Astra', index: 0 },
        { model: 'Astra', index: 2 },
        { model: '', index: 0 }
    ];

    // load feature settings from config or use defaults
    const loadCSSsettings = async () => {
        // apply defaults immediately
        for (const key in features) applyFeature(key);

        // fetch stored values concurrently
        const entries = await Promise.all(Object.keys(features).map(async key => [key, await GM.getValue(key)]));

        for (const [key, value] of entries) {
            if (value !== undefined) {
                features[key].enabled = value;
                applyFeature(key);
            }
        }

        workModelButtons = await GM.getValue('workModelButtons', workModelButtons);
    };

    let savedSpeed;
    let observer = null;
    let playbackSpeed = 1;
    let configPopup = null;
    const playingAudio = new Set();
    let controlsContainer = null;
    let docListenerActive = false;
    let speedDisplayElement = null;

    const MIN_SPEED = 1;
    const MAX_SPEED = 17;
    const DELTA = 0.25;
    const headerOffset = 15;

    const docElement = document.documentElement;

    // load CSS settings
    const cssSettingsReady = loadCSSsettings();

    // load playback speed
    async function initializeSpeed() {
        savedSpeed = await GM.getValue('defaultSpeed', 1);
        playbackSpeed = savedSpeed;

        updateSpeedDisplay();
        setPlaybackSpeed();
    }

    const configureAudio = audio => {
        if (audio.playbackRate !== playbackSpeed) audio.playbackRate = playbackSpeed;
        if (audio.preservesPitch !== true) audio.preservesPitch = true;
        if (audio.mozPreservesPitch !== true) audio.mozPreservesPitch = true;
        if (audio.webkitPreservesPitch !== true) audio.webkitPreservesPitch = true;
    };

    const nativeAudioPlay = HTMLAudioElement.prototype.play;
    HTMLAudioElement.prototype.play = function (...args) {
        configureAudio(this);
        playingAudio.add(this);
        return nativeAudioPlay.apply(this, args);
    };

    // set playback speed
    function setPlaybackSpeed() {
        playingAudio.forEach(configureAudio);
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
        const workModelElements = [];
        const createElement = (tag, className, attributes = {}) => {
            const element = document.createElement(tag);
            if (className) element.className = className;
            Object.assign(element, attributes);
            return element;
        };

        Object.entries(features).forEach(([key, feature]) => {
            const container = createElement('div', 'toggle-container');
            const checkbox = createElement('input', '', {
                type: 'checkbox',
                id: `${key}Toggle`,
                checked: feature.enabled
            });
            const label = createElement('label', 'toggle-label', {
                textContent: feature.label,
                htmlFor: checkbox.id
            });

            container.append(checkbox, label);
            toggleElements.push({ key, checkbox });
            content.appendChild(container);

            if (key === 'modelSelector') {
                const settings = createElement('div', 'work-model-settings', { hidden: !checkbox.checked });
                settings.appendChild(createElement('span', '', { textContent: 'Work Buttons' }));
                settings.appendChild(createElement('span', 'work-model-hint', { textContent: 'Choose None to hide a button.' }));
                workModelButtons.forEach((config, index) => {
                    const row = createElement('div', 'work-model-row');
                    const model = createElement('select', '', { id: `workModel${index}` });
                    const thinking = createElement('select', '', { disabled: !config.model });
                    model.setAttribute('aria-label', `Work button ${index + 1} model`);
                    thinking.setAttribute('aria-label', `Work button ${index + 1} thinking`);
                    ['', ...workModels].forEach(value => model.appendChild(createElement('option', '', { value, textContent: value || 'None' })));
                    thinkingModes.forEach((value, index) => thinking.appendChild(createElement('option', '', { value: index, textContent: value })));
                    model.value = config.model;
                    thinking.value = config.index;
                    model.onchange = () => { thinking.disabled = !model.value; };
                    row.append(createElement('label', '', { textContent: `Button ${index + 1}`, htmlFor: model.id }), model, thinking);
                    settings.appendChild(row);
                    workModelElements.push({ model, thinking });
                });
                checkbox.onchange = () => { settings.hidden = !checkbox.checked; };
                content.appendChild(settings);
            }
        });

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
            let modelChanged = false;
            for (const { key, checkbox } of toggleElements) {
                if (features[key].enabled !== checkbox.checked) {
                    features[key].enabled = checkbox.checked;
                    if ((key === 'jumpToChatActive' || key === 'readAloudBtn') && !features[key].enabled) setReadAloudPending(false);
                    await GM.setValue(key, features[key].enabled);
                    applyFeature(key);
                    if (key === 'jumpToChat' || key === 'jumpToChatActive') navChanged = true;
                    if (key === 'readAloudBtn') {
                        if (features[key].enabled) addReadAloudBtn();
                        else {
                            readAloudButton?.remove();
                            readAloudButton = null;
                        }
                    }
                }
            }

            const models = workModelElements.map(({ model, thinking }) => ({ model: model.value, index: Number(thinking.value) }));
            if (JSON.stringify(models) !== JSON.stringify(workModelButtons)) {
                workModelButtons = models;
                await GM.setValue('workModelButtons', workModelButtons);
                modelChanged = true;
            }

            if (modelChanged) {
                modelBtnObserver?.disconnect();
                modelQuickbar?.remove();
                modelQuickbar = null;
                if (features.modelSelector.enabled) addModelButtons();
            }

            if (navChanged) {
                navCleanup?.();
                navCleanup = features.jumpToChatActive.enabled ? navBtns() : null;
            }

            readAloudButton?.classList.toggle('disabled', !features.jumpToChatActive.enabled);

            configPopup.classList.remove('show');
            if (docListenerActive) {
                document.removeEventListener('click', handleDocumentClick);
                docListenerActive = false;
            }
        }

        saveButton.classList.add('save-button');
        saveButton.onclick = handleSave;

        configPopup.appendChild(headerWrapper);
        configPopup.appendChild(content);

        const footer = document.createElement('div');
        footer.classList.add('popup-footer');

        const copyrightLink = document.createElement('a');
        copyrightLink.href = 'https://github.com/TimMacy';
        copyrightLink.target = '_blank';
        copyrightLink.rel = 'noopener';
        copyrightLink.textContent = 'Copyright © 2025–2026 Tim Macy';
        copyrightLink.title = 'Copyright © 2025–2026 Tim Macy';

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
        const page = document.querySelector('[data-app-shell-active-page="true"]') || document;
        const addButton = page.querySelector('form [data-composer-footer-responsive] button[aria-label="Add files and more"]');
        if (!addButton?.parentElement) return;
        if (controlsContainer?.isConnected) {
            if (controlsContainer.previousElementSibling !== addButton.parentElement) addButton.parentElement.insertAdjacentElement('afterend', controlsContainer);
            return;
        }

        controlsContainer = document.createElement('div');
        controlsContainer.classList.add('speed-control-container');
        controlsContainer.setAttribute('data-reactroot', '');
        controlsContainer.setAttribute('suppressHydrationWarning', 'true');

        const minusButton = document.createElement('button');
        minusButton.type = 'button';
        minusButton.textContent = '-';
        minusButton.classList.add('speed-btn', 'minus');

        const speedDisplay = document.createElement('span');
        speedDisplay.classList.add('speed-display');
        speedDisplay.textContent = `${playbackSpeed}x`;
        speedDisplayElement = speedDisplay;

        const plusButton = document.createElement('button');
        plusButton.type = 'button';
        plusButton.textContent = '+';
        plusButton.classList.add('speed-btn', 'plus');

        function handleMinus() {
            playbackSpeed = Math.max(MIN_SPEED, playbackSpeed - DELTA);
            updateSpeedDisplay();
            setPlaybackSpeed();
        }

        function handlePlus() {
            playbackSpeed = Math.min(MAX_SPEED, playbackSpeed + DELTA);
            updateSpeedDisplay();
            setPlaybackSpeed();
        }

        function handleSpeedClick(e) {
            e.stopPropagation();
            if (!configPopup?.isConnected) {
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

        minusButton.onclick = handleMinus;
        plusButton.onclick = handlePlus;
        speedDisplay.onclick = handleSpeedClick;

        controlsContainer.appendChild(minusButton);
        controlsContainer.appendChild(speedDisplay);
        controlsContainer.appendChild(plusButton);

        addButton.parentElement.insertAdjacentElement('afterend', controlsContainer);
    }

    // message navigation button section
    const UP_ARROW_PATH = 'M10 3.293l-6.354 6.353a1 1 0 001.414 1.414L9 6.414V17a1 1 0 102 0V6.414l3.939 3.939a1 1 0 001.415-1.414L10 3.293z';
    const DOWN_ARROW_PATH = 'M10 16.707l6.354-6.353a1 1 0 00-1.414-1.414L11 13.586V3a1 1 0 10-2 0v10.586L5.061 8.94a1 1 0 10-1.415 1.415L10 16.707z';
    const createIcon = (pathData) => {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '20');
        svg.setAttribute('height', '20');
        svg.setAttribute('viewBox', '0 0 20 20');
        svg.setAttribute('fill', 'currentColor');
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('fill-rule', 'evenodd');
        path.setAttribute('clip-rule', 'evenodd');
        path.setAttribute('d', pathData);
        svg.appendChild(path);
        const wrapper = document.createElement('div');
        wrapper.className = 'flex w-full items-center justify-center';
        wrapper.appendChild(svg);
        return wrapper;
    };

    const createNavButton = (pathData, label, direction) => {
        const btn = document.createElement('button');
        btn.className = 'CentAnni-style-nav-btn btn relative btn-ghost text-token-text-primary';
        btn.id = 'CentAnni-nav-btn-' + direction;
        btn.setAttribute('aria-label', label);
        btn.appendChild(createIcon(pathData));
        btn.type = 'button';
        return btn;
    };

    const upBtn = createNavButton(UP_ARROW_PATH, 'Jump to previous message', 'up');
    const downBtn = createNavButton(DOWN_ARROW_PATH, 'Jump to next message', 'down');

    let navCleanup = null;
    const stopBtnSelectors = '[data-app-shell-active-page="true"] form button[aria-label="Stop"]';
    function navBtns() {
        const page = document.querySelector('[data-app-shell-active-page="true"]') || document;
        const targetChatSelector = '[data-thread-find-target="conversation"]';
        let targetChat = page.querySelector(targetChatSelector);
        const targetChatBox = page.querySelector('form[data-composer-placement="thread"]');
        if (!(targetChatBox) || !targetChat) return () => {};

        let chatObserver = null;
        let messageCache = [];

        const role = features.jumpToChat?.enabled ? '[data-user-message-bubble="true"]' : '[data-conversation-role="assistant"]';
        const messageSelector = `${role}`;
        const queryMessages = () => {
            if (!targetChat?.isConnected) targetChat = page.querySelector(targetChatSelector);
            if (!targetChat) return [];
            return Array.from(targetChat.querySelectorAll(messageSelector));
        };
        const populateCache = () => { messageCache = queryMessages(); };

        const getNextMessage = () => {
            const current = headerOffset;
            for (const msg of messageCache) {
                const top = msg.getBoundingClientRect().top;
                if (top > current + 1) return msg;
            }
            return null;
        };

        const getPrevMessage = () => {
            const current = headerOffset - 1;
            for (let i = messageCache.length - 1; i >= 0; i--) {
                const rect = messageCache[i].getBoundingClientRect();
                const top = rect.top;
                const bottom = rect.bottom;
                if (top < current && bottom > current) return messageCache[i];
                if (bottom < current - 1) return messageCache[i];
            }
            return null;
        };

        const checkForNewBelow = () => {
            const msgs = queryMessages();
            if (messageCache.length && messageCache.some(msg => !msg.isConnected)) messageCache = [];
            if (msgs.length > messageCache.length) {
                const newMsgs = msgs.slice(messageCache.length);
                messageCache.push(...newMsgs);
                const current = headerOffset;
                for (const msg of newMsgs) {
                    const top = msg.getBoundingClientRect().top;
                    if (top > current + 1) return msg;
                }
            }
            return null;
        };

        const setState = (btn, enabled) => {
            btn.classList.toggle("enabled", enabled);
            btn.classList.toggle("disabled", !enabled);
        };

        const update = () => {
            setState(upBtn, !!getPrevMessage());
            setState(downBtn, !!getNextMessage());
        };

        const getScroller = () => {
            let node = targetChat;
            while (node) {
                const style = getComputedStyle(node);
                if ((style.overflowY === 'auto' || style.overflowY === 'scroll') && node.scrollHeight > node.clientHeight) return node;
                node = node.parentElement;
            }
            return document.scrollingElement;
        };

        const scrollToMessage = (msg) => {
            const scroller = getScroller();
            const breadCrumb = document.querySelector('header nav[aria-label="Breadcrumb"]') ? 36 : 0;
            const scrollerTop = scroller === document.scrollingElement ? 0 : scroller.getBoundingClientRect().top;
            const top = scroller.scrollTop + msg.getBoundingClientRect().top - scrollerTop - headerOffset - breadCrumb;
            scroller.scrollTo({ top, behavior: 'auto' });
        };

        const jump = (prev) => {
            let target = prev ? getPrevMessage() : getNextMessage();
            if (!prev && !target) target = checkForNewBelow();
            if (target) scrollToMessage(target);
            update();
        };

        const createButtons = () => {
            if (upBtn.isConnected) return;

            upBtn.onclick = () => jump(true);
            downBtn.onclick = () => jump(false);

            targetChatBox.append(upBtn, downBtn);

            populateCache();
            startObserver();
        };

        // observer for new messages
        let stopButtonPresent = !!targetChatBox.querySelector(stopBtnSelectors);

        const buttonObserver = new MutationObserver(() => {
            const stopButton = targetChatBox.querySelector(stopBtnSelectors);

            if (stopButton && !stopButtonPresent) stopButtonPresent = true;
            else if (!stopButton && stopButtonPresent) {
                stopButtonPresent = false;
                requestAnimationFrame(() => {
                    checkForNewBelow();
                    requestAnimationFrame(() => {
                        update();
                        if (readAloudPending) readAloud();
                    });
                });
            }
        });

        buttonObserver.observe(targetChatBox, { childList: true, subtree: true, attributes: true, attributeFilter: ['aria-label'] });

        const startObserver = () => {
            if (chatObserver || !targetChat) return;
            if (queryMessages().length) {
                populateCache();
                requestAnimationFrame(() => { requestAnimationFrame(() => update()); });
                return;
            }

            chatObserver = new MutationObserver(() => {
                if (queryMessages().length) {
                    populateCache();
                    stopObserver();
                    requestAnimationFrame(() => { requestAnimationFrame(() => update()); });
                }
            });
            chatObserver.observe(targetChat, { childList: true });
        };

        const stopObserver = () => {
            if (chatObserver) {
                chatObserver.disconnect();
                chatObserver = null;
            }
        };

        createButtons();

        return () => {
            setReadAloudPending(false);
            stopObserver();
            messageCache = [];
            upBtn.remove();
            downBtn.remove();
            buttonObserver?.disconnect();
        };
    }

    // model configurations
    const modelConfigs = {
        'gpt-instant': { endpoint: 'first' },
        'gpt-high': { endpoint: 'last' }
    };

    workModels.forEach(model => thinkingModes.forEach((thinking, index) => {
        modelConfigs[`${model}-${index}`] = { model, index };
    }));

    const getIntelligenceButton = (config) => {
        const ticks = document.querySelectorAll('[data-model-picker-view="simple"] [data-model-picker-power-slider] [data-selected]');
        return ticks[config.index ?? (config.endpoint === 'first' ? 0 : ticks.length - 1)] || null;
    };

    // select GPT model
    let modelObserver, modelCheckFrame, timeout, modelHideTimeout;
    const selectModel = (modelType) => {
        clearTimeout(modelHideTimeout);
        modelObserver?.disconnect();
        modelObserver = null;
        if (modelCheckFrame) {
            cancelAnimationFrame(modelCheckFrame);
            modelCheckFrame = 0;
        }
        if (timeout) {
            clearTimeout(timeout);
            timeout = 0;
        }

        const config = modelConfigs[modelType];
        if (!config) return;

        const cleanup = () => {
            modelObserver?.disconnect();
            modelObserver = null;
            if (modelCheckFrame) {
                cancelAnimationFrame(modelCheckFrame);
                modelCheckFrame = 0;
            }
            if (timeout) {
                clearTimeout(timeout);
                timeout = 0;
            }
            modelHideTimeout = setTimeout(() => docElement.classList.remove('hide-model-picker'), 320);
        };

        const simulateClick = (element) => {
            const rect = element.getBoundingClientRect();
            const centerX = Math.floor(rect.left + rect.width / 2);
            const centerY = Math.floor(rect.top + rect.height / 2);
            const eventOptions = {
                bubbles: true,
                cancelable: true,
                clientX: centerX,
                clientY: centerY,
                composed: true
            };

            if (window.PointerEvent) element.dispatchEvent(new PointerEvent('pointerdown', { ...eventOptions, pointerId: 1, pointerType: 'mouse', isPrimary: true, button: 0, buttons: 1 }));
            element.dispatchEvent(new MouseEvent('mousedown', { ...eventOptions, button: 0, buttons: 1 }));
            if (window.PointerEvent) element.dispatchEvent(new PointerEvent('pointerup', { ...eventOptions, pointerId: 1, pointerType: 'mouse', isPrimary: true, button: 0, buttons: 0 }));
            element.dispatchEvent(new MouseEvent('mouseup', { ...eventOptions, button: 0, buttons: 0 }));

            element.click();
        };

        const check = () => {
            if (config.model) {
                const panel = document.querySelector('[data-model-picker-view]');
                const modelButton = Array.from(panel?.querySelectorAll('[role="menuitemradio"]') || []).find(button => button.textContent.trim().split(/\s+/).pop() === config.model);
                if (!modelButton) return false;
                if (panel.dataset.modelPickerView === 'advanced') {
                    simulateClick(modelButton);
                    return false;
                }
                if (modelButton.getAttribute('aria-checked') !== 'true') {
                    simulateClick(panel.querySelector('[data-model-picker-view-toggle][aria-label="Select model"]'));
                    return false;
                }
            }
            const modelButton = getIntelligenceButton(config);
            if (!modelButton) return false;
            const slider = modelButton.closest('[data-model-picker-power-slider]')?.querySelector('[role="slider"]');
            const selectedIndex = config.index ?? (config.endpoint === 'first' ? 0 : Number(slider?.getAttribute('aria-valuemax')));
            if (Number(slider?.getAttribute('aria-valuenow')) !== selectedIndex) {
                simulateClick(modelButton);
                return false;
            }
            simulateClick(headerButton);
            cleanup();
            return true;
        };

        // open menu selector panel
        const page = document.querySelector('[data-app-shell-active-page="true"]') || document;
        const headerButton = page.querySelector('form [data-composer-footer-responsive] button[aria-label="Select ChatGPT model"]');
        if (!headerButton) return;
        docElement.classList.add('hide-model-picker');
        if (headerButton.getAttribute('aria-expanded') !== 'true') simulateClick(headerButton);

        // model observer
        modelObserver = new MutationObserver(() => {
            if (!modelCheckFrame) {
                modelCheckFrame = requestAnimationFrame(() => {
                    modelCheckFrame = 0;
                    check();
                });
            }
        });
        modelObserver.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['aria-checked', 'aria-valuenow', 'data-active', 'data-selected-reasoning-effort'] });
        timeout = setTimeout(cleanup, 10000);
        check();
    };

    let modelBtnObserver;
    let modelQuickbar = null;

    const addModelButtons = () => {
        const page = document.querySelector('[data-app-shell-active-page="true"]') || document;
        if (page.contains(modelQuickbar) && modelQuickbar.childElementCount) return;
        const modelPicker = page.querySelector('form [data-composer-footer-responsive] button[aria-label="Select ChatGPT model"]');
        if (!modelPicker?.parentElement) return;

        const bar = document.getElementById("CentAnni-gpt-model-quickbar") || document.createElement("div");
        bar.id = "CentAnni-gpt-model-quickbar";
        modelQuickbar = bar;
        const mkBtn = (label, model, clickHandler) => {
            const b = document.createElement("button");
            b.textContent = label;
            b.className = 'CentAnni-gpt-model-btn';
            b.dataset.model = model;
            b.onclick = e => { e.preventDefault(); e.stopPropagation(); clickHandler(); return false; };
            b.onpointerdown = e => { e.preventDefault(); e.stopPropagation(); };
            b.setAttribute('form', 'nope');
            b.type = 'button';
            return b;
        };

        if (bar.previousElementSibling !== modelPicker.parentElement) modelPicker.parentElement.insertAdjacentElement('afterend', bar);

        // color code model button
        const markExtendedButton = () => {
            const targetContainer = bar.parentElement;
            const isWorkMode = !!targetContainer?.closest('form')?.querySelector('[data-composer-markdown][aria-label="Work with ChatGPT"]') || !!docElement.querySelector('a[data-sidebar-item="true"][data-active][aria-label*=", Work"]') || !!docElement.querySelector('#page-header div.font-medium:last-child button[data-state="on"]');
            docElement.classList.toggle('workmode-enabled', isWorkMode);
            const mode = isWorkMode ? 'work' : 'chat';
            if (bar.dataset.mode !== mode) {
                const models = isWorkMode ? workModelButtons.filter(config => config.model).map(config => [`${config.model} ${thinkingModes[config.index]}`, `${config.model}-${config.index}`]) : [['Instant', 'gpt-instant'], ['High', 'gpt-high']];
                bar.replaceChildren(...models.map(([label, model]) => mkBtn(label, model, () => selectModel(model))));
                bar.dataset.mode = mode;
            }
            const picker = targetContainer?.querySelector('button[aria-label="Select ChatGPT model"]');
            const selectedModel = workModels.find(model => picker?.textContent?.includes(model));
            const selectedIndex = ['low', 'medium', 'high', 'xhigh', 'max'].indexOf(picker?.dataset.selectedReasoningEffort);
            const activeModel = isWorkMode ? `${selectedModel}-${selectedIndex}` : picker?.dataset.selectedReasoningEffort === 'none' ? 'gpt-instant' : picker?.dataset.selectedReasoningEffort === 'high' ? 'gpt-high' : '';
            bar.querySelectorAll('.CentAnni-gpt-model-btn').forEach(button => {
                button.classList.toggle('CentAnni-active', button.dataset.model === activeModel);
            });
        };

        modelBtnObserver?.disconnect();
        markExtendedButton();
        modelBtnObserver = new MutationObserver(markExtendedButton);
        modelBtnObserver.observe(bar.parentElement, { childList: true, characterData: true, subtree: true, attributes: true, attributeFilter: ['data-selected-reasoning-effort'] });
    };

    const readAloud = () => {
        if (document.querySelector(stopBtnSelectors)) { setReadAloudPending(!readAloudPending); return; }
        setReadAloudPending(false);

        const buttons = document.querySelectorAll('button[aria-label="More actions"]');
        const button = buttons[buttons.length - 1];
        if (!button) return;

        const closestBtn = button.closest('[data-turn-key]');
        const directButton = closestBtn?.querySelector('button[aria-label="Read aloud"]') || closestBtn?.querySelector('button[aria-label="Stop reading aloud"]');
        if (directButton) { directButton.click(); return; }

        button.focus();
        button.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
        button.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', bubbles: true }));

        setTimeout(() => {
            const clickReadAloud = () => {
                const menu = document.getElementById(button.getAttribute('aria-controls'));
                const menuItem = Array.from(menu?.querySelectorAll('[role="menuitem"]') || []).find(item => item.textContent.trim().toLowerCase() === 'read aloud');
                if (!menuItem) return false;
                menuItem.click();
                return true;
            };

            if (clickReadAloud()) return;
            const observer = new MutationObserver(() => {
                if (!clickReadAloud()) return;
                clearTimeout(observer.timer);
                observer.disconnect();
            });
            observer.timer = setTimeout(() => observer.disconnect(), 1000);
            observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['aria-controls', 'data-state'] });
        }, 100);
    };

    const pauseIconPath = 'M5 4h3v12H5V4zm7 0h3v12h-3V4z';
    const speakerIconPath = 'M9.75122 4.09203C9.75122 3.61482 9.21964 3.35044 8.84399 3.60277L8.77173 3.66039L6.55396 5.69262C6.05931 6.14604 5.43173 6.42255 4.7688 6.48461L4.48267 6.49828C3.52474 6.49851 2.74829 7.27565 2.74829 8.23363V11.7668C2.74829 12.7248 3.52474 13.501 4.48267 13.5012C5.24935 13.5012 5.98874 13.7889 6.55396 14.3069L8.77173 16.3401L8.84399 16.3967C9.21966 16.6493 9.75122 16.3858 9.75122 15.9084V4.09203ZM17.2483 10.0002C17.2483 8.67623 16.9128 7.43233 16.3235 6.34691L17.4924 5.71215C18.1849 6.9875 18.5784 8.4491 18.5784 10.0002C18.5783 11.5143 18.2033 12.9429 17.5413 14.1965C17.3697 14.5212 16.9675 14.6453 16.6428 14.4739C16.3182 14.3023 16.194 13.9001 16.3655 13.5754C16.9288 12.5086 17.2483 11.2927 17.2483 10.0002ZM13.9182 10.0002C13.9182 9.1174 13.6268 8.30445 13.135 7.64965L14.1985 6.85082C14.8574 7.72804 15.2483 8.81952 15.2483 10.0002L15.2336 10.3938C15.166 11.3044 14.8657 12.1515 14.3918 12.8743L14.3069 12.9797C14.0889 13.199 13.7396 13.2418 13.4709 13.0657C13.164 12.8643 13.0784 12.4528 13.2795 12.1457L13.4231 11.9084C13.6935 11.4246 13.8643 10.8776 13.9075 10.2942L13.9182 10.0002ZM13.2678 6.71801C13.5615 6.49772 13.978 6.55727 14.1985 6.85082L13.135 7.64965C12.9144 7.35599 12.9742 6.93858 13.2678 6.71801ZM16.5911 5.44555C16.9138 5.27033 17.3171 5.38949 17.4924 5.71215L16.3235 6.34691C16.1483 6.02419 16.2684 5.62081 16.5911 5.44555ZM11.0813 15.9084C11.0813 17.5226 9.22237 18.3912 7.9895 17.4202L7.87231 17.3205L5.65552 15.2873C5.33557 14.9941 4.91667 14.8313 4.48267 14.8313C2.7902 14.8311 1.41821 13.4594 1.41821 11.7668V8.23363C1.41821 6.54111 2.7902 5.16843 4.48267 5.1682L4.64478 5.16039C5.02003 5.12526 5.37552 4.96881 5.65552 4.71215L7.87231 2.67992L7.9895 2.58031C9.22237 1.60902 11.0813 2.47773 11.0813 4.09203V15.9084Z';
    const svgPath = (() => {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', speakerIconPath);
        return path;
    })();

    let readAloudButton = null;
    let readAloudPending = false;
    const setReadAloudPending = (pending) => {
        readAloudPending = pending;
        if (!readAloudButton) return;
        readAloudButton.querySelector('path')?.setAttribute('d', pending ? pauseIconPath : speakerIconPath);
        readAloudButton.title = pending ? 'Read aloud scheduled, waiting for ChatGPT - click to cancel' : 'Read aloud last message';
        readAloudButton.setAttribute('aria-label', readAloudButton.title);
        readAloudButton.setAttribute('aria-pressed', pending);
    };

    const addReadAloudBtn = () => {
        const page = document.querySelector('[data-app-shell-active-page="true"]') || document;
        const speakBtnLoc = page.querySelector('form[data-composer-placement="thread"]');
        if (!speakBtnLoc || speakBtnLoc.contains(readAloudButton)) return;
        readAloudButton = document.getElementById("CentAnni-speak-btn");
        if (readAloudButton) { speakBtnLoc.appendChild(readAloudButton); return; }

        const speakBtn = document.createElement('button');
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '20');
        svg.setAttribute('height', '20');
        svg.setAttribute('viewBox', '0 0 20 20');
        svg.setAttribute('fill', 'currentColor');
        svg.appendChild(svgPath.cloneNode(true));
        speakBtn.appendChild(svg);
        speakBtn.onclick = readAloud;
        speakBtn.id = 'CentAnni-speak-btn';
        if (!features.jumpToChatActive.enabled) speakBtn.classList.add('disabled');
        readAloudButton = speakBtn;
        setReadAloudPending(readAloudPending);
        speakBtn.type = 'button';
        speakBtnLoc.appendChild(speakBtn);
    };

    let uiRefreshFrame = 0;
    let mainRoot = null;
    let activePage = null;

    const getMissingUi = () => {
        const composer = activePage?.querySelector('[data-composer-placement]');
        const threadComposer = activePage?.querySelector('[data-composer-placement="thread"]');
        return {
            controls: !!composer && !composer.contains(controlsContainer),
            navigation: features.jumpToChatActive.enabled && !!threadComposer && !threadComposer.contains(upBtn) && !!activePage.querySelector('[data-thread-find-target="conversation"]'),
            readAloud: features.readAloudBtn.enabled && !!threadComposer && !threadComposer.contains(readAloudButton),
            models: features.modelSelector.enabled && !!composer && !composer.contains(modelQuickbar)
        };
    };

    const refreshUi = () => {
        uiRefreshFrame = 0;

        const missing = getMissingUi();
        if (missing.controls) createControlButtons();
        if (missing.navigation) {
            navCleanup?.();
            navCleanup = navBtns();
        }
        if (missing.readAloud) addReadAloudBtn();
        if (missing.models) addModelButtons();
    };

    const scheduleUiRefresh = () => {
        if (!uiRefreshFrame) uiRefreshFrame = requestAnimationFrame(refreshUi);
    };

    const observeUiTargets = () => {
        observer.disconnect();
        mainRoot = document.querySelector('#root [data-app-shell-workspace-row]');
        activePage = mainRoot?.querySelector(':scope > [data-app-shell-active-page="true"]') || null;

        if (!mainRoot) {
            observer.observe(document.body, { childList: true, subtree: true });
            return;
        }

        observer.observe(mainRoot, { childList: true });
        for (const page of mainRoot.querySelectorAll(':scope > [data-app-shell-active-page]')) {
            observer.observe(page, { attributes: true, attributeFilter: ['data-app-shell-active-page'] });
        }
        if (activePage) observer.observe(activePage, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-app-shell-active-page'] });
    };

    // initialization after DOM has loaded
    function init() {
        observer = new MutationObserver(mutations => {
            if (!mainRoot?.isConnected || mutations.some(mutation => mutation.target === mainRoot || mutation.type === 'attributes')) observeUiTargets();
            if (uiRefreshFrame) return;
            const missing = getMissingUi();
            if (missing.controls || missing.navigation || missing.readAloud || missing.models) scheduleUiRefresh();
        });

        if (document.body) {
            observeUiTargets();
            cssSettingsReady.then(() => {
                requestIdleCallback(initializeSpeed, { timeout: 2000 });
                requestIdleCallback(createControlButtons, { timeout: 2000 });
                if (features.modelSelector.enabled) requestIdleCallback(addModelButtons, { timeout: 2000 });
                if (features.jumpToChatActive.enabled) requestIdleCallback(() => (navCleanup = navBtns()), { timeout: 2000 });
                if (features.readAloudBtn.enabled) requestIdleCallback(addReadAloudBtn, { timeout: 2000 });
            });
        }
    }

    // wait for DOM to be ready
    const check = () => {
        if (window.threadObserverActive || window.location.pathname.startsWith('/codex')) return;
        window.threadObserverActive = true;

        let timer;

        const done = () => {
            observer?.disconnect();
            clearTimeout(timer);
            clearTimeout(t);
            init();
        };

        const observer = new MutationObserver(() => {
            clearTimeout(timer);
            timer = setTimeout(done, 200);
        });

        const t = setTimeout(done, 2000);
        const target = document.getElementById('thread-bottom');
        if (target) observer.observe(target, { childList: true, subtree: true, attributes: true });
    };
    document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", check, { once: true }) : check();
})();
