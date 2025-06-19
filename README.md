# Read Aloud Speedster <a href="#changelog"><img align="right" src="https://img.shields.io/badge/Version-3.8.2-white.svg" alt="Version: 3.8.2"></a><a href="https://github.com/TimMacy/ReadAloudSpeedster/blob/main/LICENSE"><img align="right" src="https://img.shields.io/badge/License-AGPL--3.0-blue.svg" alt="GNU Affero General Public License v3.0"></a><a href="https://github.com/TimMacy/ReadAloudSpeedster"><img align="right" src="https://img.shields.io/badge/Status-Maintained-brightgreen.svg" alt="Read Aloud Speedster Status: Maintained"></a>

This script integrates intuitive playback speed controls into the chatbox interface. Clicking the speed display opens a settings menu to set a preferred default playback speed and to toggle additional UI tweaks. Additionally, the icons below Chat's responses are color-coded, and bold text is highlighted for clarity.

<p align="center"><img width="50%" alt="Settings Panel" title="Settings Panel" src="https://github.com/user-attachments/assets/cb120c02-0e8d-49f7-a192-958b90943540" /></p>

## Features
- **Native Integration**: Implements a native-looking UI that seamlessly blends with the existing layout in both light and dark modes.
- **Default Speed Control**: Automatically applies the saved playback speed from persistent storage to detected audio elements.
- **Adjust On-the-Fly**: Easily adjust playback speed from 1x to 17x in 0.25x increments using plus/minus buttons.
- **Color-Coded Icons**: Copy, thumbs up/down, read aloud/stop, and edit buttons are assigned specific colors.
- **Highlight Color**: Green in dark mode and violet in light mode.
- **Customizable**: Clicking the speed display opens a settings menu for saving a default speed and toggling various interface options.
   - Square Design, Darker Background for Header and Chat Window, Keep Icons Visible, No Icon Animation, Hide Plus/Pro Avatar icon, Hide "View Plans", Hide "Get Pro" Button, Hide "Dictate" Button, Disable Voice Mode Button, Hide "ChatGPT can make mistakes" text, Compact Sidebar with Separators, Justify Text, and Remove Focus Outlines.

<p align="center"><img width="100%" alt="Read Aloud Speedster by Tim Macy" src="https://github.com/user-attachments/assets/b51bb846-2829-484a-91aa-bd4ead3d94f1" /></p> 

<br><br>

## Installation <a href="https://www.opera.com"><img align="right" src="https://img.shields.io/badge/Opera-Untested-yellow.svg" alt="Opera Untested"></a><a href="https://www.microsoft.com/edge"><img align="right" src="https://img.shields.io/badge/Edge-Untested-yellow.svg" alt="Edge Untested"></a><a href="https://www.mozilla.org/firefox"><img align="right" src="https://img.shields.io/badge/Firefox-Untested-yellow.svg" alt="Firefox Untested"></a><a href="https://www.google.com/chrome"><img align="right" src="https://img.shields.io/badge/Chrome-Supported-brightgreen.svg" alt="Chrome Support"></a><a href="https://www.apple.com/safari"><img align="right" src="https://img.shields.io/badge/Safari-Supported-brightgreen.svg" alt="Safari Support"></a>

1. **Install or open a userscript manager**.
   A userscript manager is required, such as [Userscripts for Safari](https://itunes.apple.com/us/app/userscripts/id1463298887) or [Tampermonkey](https://www.tampermonkey.net/) (available for [Chrome](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo), [Microsoft Edge](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd), [Safari](https://apps.apple.com/us/app/tampermonkey/id1482490089), [Opera Next](https://addons.opera.com/en/extensions/details/tampermonkey-beta/), and [Firefox](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/).
2. **Install** [ReadAloudSpeedster.js](https://raw.githubusercontent.com/TimMacy/ReadAloudSpeedster/refs/heads/main/ReadAloudSpeedster.js)

## Changelog
- **3.8.2**: adjustments for the latest changes
- **3.8**: bug fixes and improvements. new toggleable option: Compact Search and Library Buttons
- **3.7**: bug fixes and improvements. new toggleable options have been added to the settings menu: a darker background for the header and chat window, persistent icon visibility, reduced icon animation, hide the Plus/Pro avatar, hide the "View Plans," "Get Pro," and "Dictate" buttons, disable the voice mode button, hide the "ChatGPT can make mistakes" text, compact sidebar with separators, justified text, and removed focus outlines.
- **3.1.1**: Updated stylesheet injection logic.
- **3.1**: Adjustments for the latest changes.
- **3.0.9.7**: adjustments for the latest changes (fixed margins, menu bar, and box-shadow on hover).
- **3.0.9.4**: adjustments for the latest changes (updated icon CSS selector to match new DOM).
- **3.0.9.3**: adjustments for the latest changes (updated 'view plans' CSS selector to match new DOM).
- **3.0.9.2**: adjustments for the latest changes.
- **3.0.9**: bug fixes and improvements, added icon color support for Sora and Codex.
- **3.0.8.2**: adjustments for the latest changes.
- **3.0.8.1**: fixed spacing for research sources button when using square design.
- **3.0.8**: adjustments for the latest changes.
- **3.0.7.1**: dark and light mode adjustments for “Edit in canvas” and “Switch model” icons.
- **3.0.7**: improvements.
- **3.0.3**: bug fixes.
- **3.0.2**: bug fixes.
- **3.0.1**: bug fixes.
- **3.0**: initial public release.

## License
The code in `ReadAloudSpeedster.js` is licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). See the [LICENSE](https://github.com/TimMacy/ReadAloudSpeedster/blob/main/LICENSE) file for details. The `README.md` and all images are Copyright © 2025 Tim Macy. All rights reserved.

<br>

> [!TIP]
> # YouTube Alchemy
> A toolkit that enhances YouTube by customizing the layout and adding more than 130 seamless, native-feeling features. Designed to be resource-efficient, it primarily relies on YouTube's own event listeners while using timeouts and mutation observers strategically to minimize overhead. Additionally, a main settings panel, along with three sub-panels, provides an intuitive interface for easy customization.
>
> <br>
>
> **Install It from the Official Repository: [https://github.com/TimMacy/YouTubeAlchemy](https://github.com/TimMacy/YouTubeAlchemy)**
>
> <br>
> <p align="center"><img width="100%" alt="YouTube Alchemy by Tim Macy" src="https://github.com/user-attachments/assets/42016ac0-b4b1-4b02-a6dc-23620b127e10" /></p>
