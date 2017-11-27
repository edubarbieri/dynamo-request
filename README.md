dynamo-request
=========

Simple library to help update properties and call methods in dynamo admin.

## Installation
```
  npm install dynamo-request
```

## Usage    
```javascript
    const request = require('dynamo-request');

    const userPassword = "admin:admin";

    //Update property
    const propertyReq = {
        component : '/atg/commerce/catalog/CatalogTools/',
        propertyName: 'loggingDebug',
        newValue: 'true'
    };

    request.updateProperty('http://localhost:10181', propertyReq, userPassword);

    //Invoke Method
    const methodReq = {
        component : '/atg/commerce/inventory/InventoryCache/',
        invokeMethod: 'flush'
    };
    request.invokeMethod('http://localhost:10181', methodReq, userPassword);


    //You can also combine request for multiple hosts, and update various properties and methods.
    const hosts = [
        'http://prodserver1:10181',
        'http://prodserver1:10281',
        'http://prodserver2:10181'
    ];

    const updates = [propertyReq, methodReq];
    request.process(hosts, updates, userPassword);
    
```

## Contributing

In lieu of a formal style guide, take care to maintain the existing coding style. Lint and test your code