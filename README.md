# node-converge
converge API wrapper for Node.js, fully promisified

#### Initialization

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

#### Usage

```
Converge.Card.Create(
{
    cardNumber: 'xxxxxxxxxxxxxxxx',
    exp: 'xx/xx',
    cvv: 'xxx',
    firstName: 'x',
    lastName: 'x',
    address: 'x',
    zipcode: 'xxxxx'
});
```
```
Converge.Card.Sale(
{
    foreignKey: __your_card_id__,
    amount: 1
});
```