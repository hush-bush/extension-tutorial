chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({
        name: "Jack"
    });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && /^http/.test(tab.url)) { // когда вкладка загружена
    chrome.scripting.insertCSS({            // хуярим css
        target: {tabId: tabId},             //  на вкладку
        files: ["./foreground_styles.css"]          // вот этим файлом
    })
        .then(() => {
            console.log("injected css")
            chrome.scripting.executeScript({        // хуярим скрипт
                target: {tabId: tabId},             //  на вкладку
                files: ["./foreground.js"]          // вот этим файлом
            }) 
                .then(() => {
                    console.log("injected foreground")
                })
            .catch(err => console.log(err));
        })
    }
}) 

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'get_name') {
        chrome.storage.local.get('name', data => {
            if (chrome.runtime.lastError){
                sendResponse({
                    message: "fail"
                });
                return;
            }
            sendResponse({
                message: "success",
                payload: data.name
            });
        });
        return true;
    } else if (request.message === "change_name"){
        chrome.storage.local.set({
            name: request.payload
        }, () => {
            if (chrome.runtime.lastError) {
                sendResponse({ message: 'fail' });
                return;
            }
            
            sendResponse({message: 'success'});
        })
        return true;
    }
})