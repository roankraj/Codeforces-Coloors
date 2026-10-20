chrome.commands.onCommand.addListener(async function(o){o==="toggle-focus-mode"&&chrome.storage.local.get("focus",async function(c){const s=c.focus||!1;await chrome.storage.local.set({focus:!s})})});
