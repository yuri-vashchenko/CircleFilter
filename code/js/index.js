$("#from-internet").click( function() {
    //$.ajax({
    //    type: "POST",
    //    
    //});
    chrome.tabs.create({ 
        url: chrome.extension.getURL('index.html')
    });
});