node-converge
===============
converge API wrapper for Node.js, fully promisified

## Functionality
* Card Not Present (`transactions` API)
	* Card tokenization
	* Card fetching
	* Sale with card token
	* Void sale
	* Refund amount

## Updating the framework
* `git tag x.x.x`
* `git push --tags`
* `nom publish`
* 
## Initialization

```
var converge = require('node-converge');
var conf = {
    username: '_your_username_',
    pin: '_your_password_'
    merchant: _your_merchant_,
    environment: 'sandbox'
};
var Converge = new converge(conf);
```

## Usage
See tests https://github.com/Starchup/node-converge/blob/master/test.js
