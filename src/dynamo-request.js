const request = require('request');

"use strict";


/**
 * Send request to update property in dynamo.
 * @param {string} host - Full host address to send request, Ex: http://localhost:10181.
 * @param {Object} postData - Property data to update in dynamo.
 * @param {string} postData.component - Component path, Ex: /dev/client/soap/AuthorizeTransactionClient.
 * @param {string} postData.propertyName - Property name, Ex: connectionTimeout.
 * @param {string} postData.newValue - New value for property, Ex: 1000.
 * @param {string} userAndPassword - User and password concatend with colon, Ex: admin:passwd
 * @returns {void}
 */
function updateProperty(host, postData, userAndPassword, callback){
    makeRequest(host, postData, userAndPassword, callback);    
}

/**
 * Send request to invoke method in dynamo.
 * @param {string} host - Full host address to send request, Ex: http://localhost:10181.
 * @param {Object} postData - Property data to update in dynamo.
 * @param {string} postData.component - Component path, Ex: /dev/client/soap/AuthorizeTransactionClient.
 * @param {string} postData.invokeMethod - Methos name, Ex: generateSQL.
 * @param {string} userAndPassword - User and password concatend with colon, Ex: admin:passwd
 * @returns {void}
 */
function invokeMethod(host, postData, userAndPassword, callback){
    makeRequest(host, postData, userAndPassword, callback);
}

/**
 * Send request to update property in dynamo.
 * @param {string|string[]} hosts - Full host address to send request, Ex: http://localhost:10181.
 * @param {Object|Object[]} postData - Property data to update or methodos to call in dynamo.
 * @param {string} postData.component - Component path, Ex: /dev/client/soap/AuthorizeTransactionClient.
 * @param {string} postData.propertyName - Property name, Ex: connectionTimeout.
 * @param {string} postData.newValue - New value for property, Ex: 1000.
 * @param {string} postData.invokeMethod - Methos name, Ex: generateSQL.
   @param {string} userAndPassword - User and password concatend with colon, Ex: admin:passwd 
 * @returns {void}
 */    
function process(hosts, postData, userAndPassword){
    //itera varios hosts
    if(hosts instanceof Array){
        hosts.forEach(function(host){
            processSingleHost(host, postData, userAndPassword);
        });
        return;
    }
    //envia somente a 1 host
    processSingleHost(hosts, postData, userAndPassword);
}

function processSingleHost(host, postData, userAndPassword){
    //itera array de propriedades
    if(postData instanceof Array){
        postData.forEach(function(data){
            makeRequest(host, data, userAndPassword);
        });
        return;
    }
    //envia somente 1 propriedade
    makeRequest(host, postData, userAndPassword);
}

function makeRequest(host, postData, userAndPassword, callback) {
    
    var url = host + '/dyn/admin/nucleus' + postData.component;
    if (!url.endsWith('/')) {
        url += '/';
    }
    var options = {
        url: url,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + new Buffer(userAndPassword).toString('base64')
        },
        form: postData,
        timeout : 4000
    };
    if(postData.propertyName){
        console.log('Setting ' + postData.propertyName + ' in ' + url);
    }else if(postData.invokeMethod){
        console.log('Calling method ' + postData.invokeMethod + ' in ' + url);
    }
    request(options, function (error, response, body) {
        let resultError;
        if (error || response.statusCode != 200) {
            let fullMsg = 'ERROR calling: ' + this.href + ', status is: ' + (response ? response.statusCode : 'none') + ', Error: ' + error || '';
            console.log('======ERROR calling: ' + this.href + ', status is: ' + (response ? response.statusCode : 'none') + ', Error: ' + error);
            
            resultError = {
                'requestError' : error || {},
                'longMessage' : fullMsg,
                'message' :  (error ? error.message : 'Response code is ' + response.statusCode)
            };
        }
        let resultData = Object.assign({}, postData);
        resultData.host = host;

        if(typeof callback == 'function'){
            let argNumber = callback.length;
            switch (argNumber) {
                case 0:
                    callback();
                    break;
                case 1:
                    callback(resultError);
                    break;
                default:
                    callback(resultError, resultData);
                    break;
            }
        }


    });
}

module.exports = {
    updateProperty : updateProperty,
    invokeMethod : invokeMethod,
    process : process
};