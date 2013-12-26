$("#from-internet").click( function( activeTab ) {
    chrome.tabs.create({ 
        url: chrome.extension.getURL('index.html')
    });
});