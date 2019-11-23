"use strict"

function displayAboutDialog(clientVersion) {
  const deviceInfo = new UAParser().getResult()["device"];
  alert("AlterStore "+clientVersion+
        " running on "+deviceInfo["vendor"]+" "+deviceInfo["model"]+
        "\n\nMade with <3 by jkelol111. Licensed under the MIT license.");
}

window.addEventListener("DOMContentLoaded", () => {
  var alterstore = new AlterStoreSDK("AlterStoreClient");
  window.addEventListener("keydown", (e) => {
    switch(e.key) {
      case "SoftLeft":
        fetch('/manifest.webapp')
        .then(responseRaw => responseRaw.text())
        .then(responseText => JSON.parse(responseText).version)
        .then(version => displayAboutDialog(version))
        .catch(() => displayAboutDialog("Unknown"));
        break;
      case "Enter":
        nativeToast({message: "Nothing here yet!",
                    position: 'north',
                    timeout: 3000,
                    type: 'error'});
        break;
    }
  });
});