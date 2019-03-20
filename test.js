/**
 * Modules from the community: package.json
 */
var expect = require('chai').expect;

var converge = require('./converge.js');
var Converge = new converge(
{
    merchant: 'xxxx',
    username: 'xxxx',
    pin: 'xxxx',
    environment: 'xxxx'
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
        address: '1 Main StreetF',
        zipcode: '11201'
    };

    it('should create a credit card on Converge', function (done)
    {
        Converge.Card.Create(data).then(function (foreignId)
        {
            expect(foreignId).to.exist; // jshint ignore:line
            cardForeignId = foreignId;
            done();
        }).catch(done);
    });

    it('should get a credit card from Converge', function (done)
    {
        Converge.Card.Get(
        {
            foreignKey: 'stuff'

        }).then(function (res)
        {
            expect(res).to.exist; // jshint ignore:line
            expect(res.last4).to.exist; // jshint ignore:line
            done();
        }).catch(done);
    });

    it('should bill a credit card on Converge', function (done)
    {
        Converge.Card.Sale(
        {
            foreignKey: cardForeignId,
            amount: 1
        }).then(function (foreignId)
        {
            expect(foreignId).to.exist; // jshint ignore:line
            transactionForeignId = foreignId;
            done();
        }).catch(done);
    });

    it('should void a credit card on Converge', function (done)
    {
        Converge.Card.Void(
        {
            transactionForeignKey: transactionForeignId
        }).then(function (res)
        {
            expect(token.foreignId).to.exist; // jshint ignore:line
            done();
        }).catch(done);
    });

    it('should refund a credit card on Converge', function (done)
    {
        Converge.Card.Refund(
        {
            transactionForeignKey: transactionForeignId,
            amount: 0.5
        }).then(function (foreignId)
        {
            expect(foreignId).to.exist; // jshint ignore:line
            done();
        }).catch(done);
    });
});