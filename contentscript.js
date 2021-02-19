document.addEventListener("mousedown", function (click) {

	if (click.button === 2) {
		let selection = window.getSelection().toString().trim();
		if (selection.match(/[\u3400-\u9FBF]/)) {
			chrome.runtime.sendMessage({
				request: "yesKanji",
				selection: selection
			});
		}

		else if (selection.match(/[\u3040-\u309F]|[\u30A0-\u30FF]/)) {
			chrome.runtime.sendMessage({
				request: "noKanji",
				selection: selection
			});
		}

		else {
			chrome.runtime.sendMessage({
				request: "noJapanese",
				selection: selection
			});
		}
	}

});

