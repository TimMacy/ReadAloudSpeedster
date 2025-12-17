# Read Aloud Speedster <a href="#-changelog"><img align="right" src="https://img.shields.io/badge/Version-5.14-white.svg" alt="Version: 5.14"></a><a href="https://github.com/TimMacy/ReadAloudSpeedster/blob/main/LICENSE"><img align="right" src="https://img.shields.io/badge/License-AGPL--3.0-blue.svg" alt="GNU Affero General Public License v3.0"></a><a href="https://github.com/TimMacy/ReadAloudSpeedster"><img align="right" src="https://img.shields.io/badge/Status-Maintained-brightgreen.svg" alt="Read Aloud Speedster Status: Maintained"></a>

<a href="#"><picture><source media="(prefers-color-scheme: light)" srcset="https://github.com/user-attachments/assets/d7606cb8-1f8e-43a8-b906-db6edbeab075"/><img align="left" width="120px" alt="Read Aloud Speedster Logo" src="https://github.com/user-attachments/assets/13149deb-3738-49b7-b9e3-69644f77527e"/></picture></a>
This script integrates intuitive playback speed controls into the chatbox interface and navigation buttons into the header to browse between messages. Clicking the speed display opens a settings menu to set a preferred default playback speed and to toggle additional UI tweaks. Additionally, the icons below Chat's responses are color-coded, and bold text is highlighted for clarity.
<br clear="left"/>

<p align="center"><img width="50%" alt="Read Aloud Speedster by Tim Macy Overview" title="Settings Panel" src="https://github.com/user-attachments/assets/11731e93-0eaf-4a29-a948-d99c709066f1" /></p>

## 🪄 Features
- **Native Integration**: Implements a native-looking UI that seamlessly blends with the existing layout in both light and dark modes.
- **Default Speed Control**: Automatically applies the saved playback speed from persistent storage to detected audio elements.
- **Adjust On-the-Fly**: Easily adjust playback speed from 1x to 17x in 0.25x increments using plus/minus buttons.
- **Color-Coded Icons**: Copy, thumbs up/down, read aloud/stop, and edit buttons are assigned specific colors.
- **Highlight Color**: Green in dark mode and violet in light mode.
- **Customizable**: Clicking the speed display opens a settings menu for saving a default speed and toggling various interface options.
   - Square Design, Darker Background for Header and Chat Window, Keep Icons Visible, No Icon Animation, Hide Plus/Pro Avatar icon, Hide "View Plans" and "Get Plus", Hide "Get Pro" Button, Hide "Dictate" Button, Disable Voice Mode Button, Hide "ChatGPT can make mistakes" Text, Codex/Sora and "New project"/"See more" Buttons Next to Each Other, Compact Search and Library Buttons, Compact Sidebar with Separators, Justify Text, Remove Focus Outlines, Navigate Between Messages, User Message Height Limiter, Send Message with Shift+Enter instead of Enter, Quick Model Selector Buttons, and Custom Avatar.

<p align="center"><img width="100%" alt="Read Aloud Speedster by Tim Macy" src="https://github.com/user-attachments/assets/b51bb846-2829-484a-91aa-bd4ead3d94f1" /></p> 

<br><br>

## 🚀 Installation <a href="https://www.opera.com"><img align="right" src="https://img.shields.io/badge/Opera-Untested-yellow.svg" alt="Opera Untested"></a><a href="https://www.microsoft.com/edge"><img align="right" src="https://img.shields.io/badge/Edge-Untested-yellow.svg" alt="Edge Untested"></a><a href="https://www.mozilla.org/firefox"><img align="right" src="https://img.shields.io/badge/Firefox-Supported-brightgreen.svg" alt="Firefox Support"></a><a href="https://www.google.com/chrome"><img align="right" src="https://img.shields.io/badge/Chrome-Supported-brightgreen.svg" alt="Chrome Support"></a><a href="https://www.apple.com/safari"><img align="right" src="https://img.shields.io/badge/Safari-Supported-brightgreen.svg" alt="Safari Support"></a>

1. **Install or open a userscript manager**.
   A userscript manager is required, such as [Userscripts for Safari](https://itunes.apple.com/us/app/userscripts/id1463298887) or [Tampermonkey](https://www.tampermonkey.net/) (available for [Chrome](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo), [Microsoft Edge](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd), [Safari](https://apps.apple.com/us/app/tampermonkey/id1482490089), [Opera Next](https://addons.opera.com/en/extensions/details/tampermonkey-beta/), and [Firefox](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/).
2. **Install** [ReadAloudSpeedster.js](https://raw.githubusercontent.com/TimMacy/ReadAloudSpeedster/refs/heads/main/ReadAloudSpeedster.js)

> [!NOTE]
> This script is designed primarily for desktop browsers; compatibility and functionality on mobile devices may vary.

<br>

## 📜 Changelog
- **5.14**: adjustments for ChatGPT Images
- **5.13**: adjustments for the latest DOM changes
- **5.12.1**: adjustments for the latest DOM changes
- **5.12**: update for GPT 5.2 and adjustments for the latest DOM changes
- **5.11.2**: adjustments for the latest DOM changes
- **5.11.1**: fixed margins in Deep Research's result
- **5.11**: adjustments for the latest DOM changes (Group Chat)
- **5.10**: new feature: Use 'Extended Thinking' by Default
- **5.9**: new feature: "'Show additional models' Active" as the necessary information for "auto-adjust based on 'Show additional models' setting" was removed from the DOM
- **5.8.4**: adjustments for the latest DOM changes
- **5.8.3**: adjustments for the latest DOM changes
- **5.8.2**: adjustments for the latest DOM changes
- **5.8.1**: adjustments for the latest DOM changes
- **5.8**: fixed avatar loading bug, and Quick Model Selector Buttons now auto-adjust based on 'Show additional models' setting
- **5.7**: adjustments for the latest DOM changes
- **5.6**: optimized Quick Model Selector Buttons and general initialization of the script
- **5.5**: bug fixes, improvements, and adjustments for the latest DOM changes
- **5.4**: bug fixes and improvements; new features: Replace Bullets with Dashes in Lists
- **5.3**: bug fixes and improvements
- **5.2.5**: bug fixes and adjustments for the latest changes; new features: Quick Model Selector Buttons, Button to Read Aloud Last Message
- **5.1.2**: fixed input field padding
- **5.1.1**: fixed input field padding in projects
- **5.1**: bug fixes, improvements, and adjustments for the latest changes
- **5.0**: adjustments for GPT-5
- **4.8.5**: bug fixes and adjustments for the latest changes
- **4.8.1**: added custom avatar support for Sora
- **4.8.1**: adjustments for the latest changes (added option to hide 'Get Plus')
- **4.8**: bug fixes and a new toggleable option has been added to the settings menu: Send Message with Shift+Enter instead of Enter
- **4.7**: bug fixes and adjustments for the latest changes
- **4.5.3.2**: bug fixes (user message square design fix)
- **4.5.3.1**: adjustments for the latest changes
- **4.3.6**: bug fixes, improvements, and adjustments for the latest changes
- **4.3**: Firefox support and improvements
- **4.2**: bug fixes and improvements. new toggleable options have been added to the settings menu: user message height limiter and custom avatar support via URL
- **4.0**: bug fixes and improvements. new toggleable options have been added to the settings menu: grouping Codex/Sora and "New project"/"See more" buttons, compacting search and library buttons, browsing to user or ChatGPT's responses
- **3.8.3**: Sora bug fix
- **3.8.2**: adjustments for the latest changes
- **3.8**: bug fixes and improvements. new toggleable option: Compact Search and Library Buttons
- **3.7**: bug fixes and improvements. new toggleable options have been added to the settings menu: a darker background for the header and chat window, persistent icon visibility, reduced icon animation, hide the Plus/Pro avatar, hide the "View Plans," "Get Pro," and "Dictate" buttons, disable the voice mode button, hide the "ChatGPT can make mistakes" text, compact sidebar with separators, justified text, and removed focus outlines
- **3.1.1**: Updated stylesheet injection logic
- **3.1**: adjustments for the latest changes
- **3.0.9.7**: adjustments for the latest changes (fixed margins, menu bar, and box-shadow on hover)
- **3.0.9.4**: adjustments for the latest changes (updated icon CSS selector to match new DOM)
- **3.0.9.3**: adjustments for the latest changes (updated 'view plans' CSS selector to match new DOM)
- **3.0.9.2**: adjustments for the latest changes
- **3.0.9**: bug fixes and improvements, added icon color support for Sora and Codex
- **3.0.8.2**: adjustments for the latest changes
- **3.0.8.1**: fixed spacing for research sources button when using square design
- **3.0.8**: adjustments for the latest changes
- **3.0.7.1**: dark and light mode adjustments for “Edit in canvas” and “Switch model” icons
- **3.0.7**: improvements
- **3.0.3**: bug fixes
- **3.0.2**: bug fixes
- **3.0.1**: bug fixes
- **3.0**: initial public release

<br>

## ⚖️ License
The code in `ReadAloudSpeedster.js` is licensed under the GNU Affero General Public License v3.0 or later (AGPL-3.0-or-later). See the [LICENSE](https://github.com/TimMacy/ReadAloudSpeedster/blob/main/LICENSE) file for details. Not licensed under the AGPL are the `README.md` and all images. Copyright © 2025 Tim Macy. All rights reserved.

<br>

> [!TIP]
> # 💡 YouTube Alchemy
> A toolkit that enhances YouTube by customizing the layout and adding more than 130 seamless, native-feeling features. Designed to be resource-efficient, it primarily relies on YouTube's own event listeners while using timeouts and mutation observers strategically to minimize overhead. Additionally, a main settings panel, along with three sub-panels, provides an intuitive interface for easy customization.
>
> <br>
>
> **Install It from the Official Repository: [https://github.com/TimMacy/YouTubeAlchemy](https://github.com/TimMacy/YouTubeAlchemy)**
>
> <br>
> <p align="center"><img width="100%" alt="YouTube Alchemy by Tim Macy" src="https://github.com/user-attachments/assets/926371c9-09b7-4ab9-b8a4-53c8c0e59dcf" /></p>

<br>

## 🔸 Disclaimer
*Read Aloud Speedster* is an independent, private project. It’s not affiliated with, endorsed by, sponsored by, or in any way officially connected to OpenAI, ChatGPT, or any related entity. "ChatGPT" and the ChatGPT logo are trademarks of OpenAI; all other trademarks are the property of their respective owners.
