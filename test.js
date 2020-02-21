/**
 * Modules from the community: package.json
 */
var expect = require('chai').expect;

var converge = require('./converge.js');
var Converge = new converge(
{
    merchant: '000302',
    username: 'democpos',
    pin: 'KR1OONFG7XUFW5YSU91TSXX1PDMRHYRCXUTECRE2B31BXTFM31Y6XZ094NF6L7T5',
    environment: 'sandbox'
});

var cardForeignId, transactionForeignId;

describe('Card Methods', function ()
{
    this.timeout(10000);

    var data = {
        cardNumber: 'xxxxxxxxxxxxxx',
        exp: '02/20',
        cvv: '232',
        firstName: 'Geoffroy',
        lastName: 'Lesage',
        address: '1 Main Street',
        zipcode: '11201'
    };

    it('should create a credit card on Converge', function (done)
    {
        Converge.Card.Create(data).then(function (cardData)
        {
            expect(cardData).to.exist; // jshint ignore:line
            expect(cardData.foreignId).to.exist; // jshint ignore:line

            cardForeignId = cardData.foreignId;

            done();
        }).catch(done);
    });

    // it('should get a credit card from Converge', function (done)
    // {
    //     Converge.Card.Get(
    //     {
    //         foreignKey: cardForeignId

    //     }).then(function (res)
    //     {
    //         expect(res).to.exist; // jshint ignore:line
    //         expect(res.last4).to.exist; // jshint ignore:line
    //         done();
    //     }).catch(done);
    // });

    // it('should bill a credit card on Converge', function (done)
    // {
    //     Converge.Card.Sale(
    //     {
    //         foreignKey: cardForeignId,
    //         amount: 1
    //     }).then(function (saleData)
    //     {
    //         expect(saleData).to.exist; // jshint ignore:line
    //         expect(saleData.foreignId).to.exist; // jshint ignore:line
    //
    //         transactionForeignId = saleData.foreignId;
    //         done();
    //     }).catch(done);
    // });

    // it('should void a credit card on Converge', function (done)
    // {
    //     Converge.Card.Void(
    //     {
    //         transactionForeignKey: transactionForeignId
    //     }).then(function (voidData)
    //     {
    //         expect(voidData).to.exist; // jshint ignore:line
    //         expect(voidData.foreignId).to.exist; // jshint ignore:line
    //         done();
    //     }).catch(done);
    // });

    // it('should refund a credit card on Converge', function (done)
    // {
    //     Converge.Card.Refund(
    //     {
    //         transactionForeignKey: transactionForeignId,
    //         amount: 0.5
    //     }).then(function (refundData)
    //     {
    //         expect(refundData).to.exist; // jshint ignore:line
    //         expect(refundData.foreignId).to.exist; // jshint ignore:line
    //         done();
    //     }).catch(done);
    // });
});