chrome.contextMenus.create({
	"title": "Jisho Lookup",
	"id": "Menu",
	"contexts": ["selection"],
});

chrome.contextMenus.create({
	"title": "Search Word",
	"id": "searchWord",
	"parentId": "Menu",
	"contexts": ["selection"],
	"enabled": false
});


chrome.contextMenus.create({
	"title": "Search Kanji",
	"id": "searchKanji",
	"parentId": "Menu",
	"contexts": ["selection"],
	"enabled": false
});

chrome.runtime.onMessage.addListener((msg) => {

	let kanjiOnly = new RegExp(/[\u3400-\u9FBF]/)
	let kanjiHiraKata = new RegExp(/[\u3040-\u309F]|[\u30A0-\u30FF]|[\u3400-\u9FBF]/)

	function buildQuery(info, tab, regex) {
		let selectedText = msg.selection;
		let query = "";
		for (let i = 0; i < selectedText.length; i++) {
			if (selectedText[i].match(regex)) {
				query = query + selectedText[i];
			}
		}

		return query;
	}

	function searchWord(info, tab) {
		let query = buildQuery(info, tab, kanjiHiraKata)
		chrome.tabs.create({ url: `https://jisho.org/search/${query}` })
	}

	function searchKanji(info, tab) {
		let query = buildQuery(info, tab, kanjiOnly)
		for (let i = 0; i < query.length; i++) {
			if (i === 0) {
				chrome.tabs.create({ url: `http://jisho.org/kanji/details/${query[i]}`, selected: true })
			} else {
				chrome.tabs.create({ url: `http://jisho.org/kanji/details/${query[i]}`, selected: false })
			}
		}
	}


	if (msg.request === "yesKanji") {

		chrome.contextMenus.update("searchWord", {
			"enabled": true,
			"onclick": searchWord
		})

		chrome.contextMenus.update("searchKanji", {
			"enabled": true,
			"onclick": searchKanji
		})

	} else if (msg.request === "noKanji") {

		chrome.contextMenus.update("searchWord", {
			"enabled": true,
			"onclick": searchWord
		})

		chrome.contextMenus.update("searchKanji", {
			"enabled": false,
		})

	} else {

		chrome.contextMenus.update("searchWord", {
			"enabled": false,
		})

		chrome.contextMenus.update("searchKanji", {
			"enabled": false,
		})
	}
})



