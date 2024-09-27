(function () {
    window.onload = function updateBlockedUrlPath() {

        const queryParams = window.location.search.substr(1).split('&')
            .reduce(function (result, current) {
                const values = current.split('=');
                result[values[0]] = values[1];
                return result;
            }, {});

        const blockType = queryParams.type || 'block';
        const customText = "custom_message_" + blockType
        const blockText = "block_message_" + blockType

        document.getElementById('title').innerHTML = chrome.i18n.getMessage("title_text");
        document.getElementById('blockPageMessage').innerHTML = chrome.i18n.getMessage("block_page_message");
        document.getElementById('blockTypeText').innerHTML = chrome.i18n.getMessage(blockText);
        document.getElementById('customMessage').innerHTML = chrome.i18n.getMessage(customText);
        document.getElementById('blockPageDescription').innerHTML = chrome.i18n.getMessage("block_page_description");
        document.getElementById('defaultMessage').hidden = (blockType === chrome.i18n.getMessage("block_message_block"));
        document.getElementById('inputUrl').value = queryParams.url;
    };
})();