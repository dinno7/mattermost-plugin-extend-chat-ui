// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import manifest from "./manifest";

import "./style.scss";

function detectDarkTheme() {
  const el = document.getElementById("app-content");
  if (el === null) {
    return;
  }
  const rgb = getComputedStyle(el)
    .backgroundColor.split("(")[1]
    .split(")")[0]
    .split(", ")
    .map(Number);
  const luma = 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
  if (luma < 140) {
    document.body.classList.remove("mm-chat-ui--light-theme");
    document.body.classList.add("mm-chat-ui--dark-theme");
  } else {
    document.body.classList.remove("mm-chat-ui--dark-theme");
    document.body.classList.add("mm-chat-ui--light-theme");
  }
}

export default class MattermostExtendChatUIPlugin {
  #interval: NodeJS.Timeout | null = null;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  public async initialize() {
    // @see https://developers.mattermost.com/extend/plugins/webapp/reference/
    detectDarkTheme();
    this.#interval = setInterval(detectDarkTheme, 5000);
  }

  uninitialize() {
    if (this.#interval) {
      clearInterval(this.#interval);
    }
  }
}

declare global {
  interface Window {
    registerPlugin(
      pluginId: string,
      plugin: MattermostExtendChatUIPlugin
    ): void;
  }
}

window.registerPlugin(manifest.id, new MattermostExtendChatUIPlugin());
