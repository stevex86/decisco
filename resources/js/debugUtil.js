(() => {
    window.onload = function getDebugParameters() {
        const queryParams = window.location.search.substr(1).split('&')
            .reduce(function (result, current) {
                const values = current.split('=');
                result[values[0]] = values[1];
                return result;
            }, {});

        const errorMessage = queryParams.error && decodeURIComponent(queryParams.error);
        if (errorMessage) {
            document.getElementById('error').innerHTML = errorMessage;
            document.getElementById('error').style.visibility = 'visible';
            document.getElementById('debugParams').style.visibility = 'hidden';
        } else {
            document.getElementById('collectionDateTime').innerHTML = `Debug Info. collected at: ${Date()}`;
            document.getElementById('os').innerHTML = decodeURIComponent(queryParams.os);
            document.getElementById('osVersion').innerHTML = decodeURIComponent(queryParams.osVersion);
            document.getElementById('status').innerHTML = decodeURIComponent(queryParams.status);
            document.getElementById('userEmail').innerHTML = decodeURIComponent(queryParams.userEmail);
            document.getElementById('localIP').innerHTML = decodeURIComponent(queryParams.localIP);
            if(queryParams.policyUrl=='NA')
                document.getElementById('policyUrlSpan').innerHTML = 'Information not available';
             else{
            document.getElementById('policyUrl').innerText = decodeURIComponent(queryParams.policyUrl);
            document.getElementById('policyUrl').href = decodeURIComponent(queryParams.policyUrl);
             }
            document.getElementById('error').innerHTML = '';
            document.getElementById('error').style.visibility = 'hidden';
            document.getElementById('debugParams').style.visibility = 'visible';
        }
    };
})();