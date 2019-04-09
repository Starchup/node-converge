/**
 * Modules from the community: package.json
 */
var xmlP = require('fast-xml-parser');
var rp = require('request-promise');
var got = require('got');

var production = 'https://api.convergepay.com/VirtualMerchant/processxml.do';
var sandbox = 'https://api.demo.convergepay.com/VirtualMerchantDemo/processxml.do';

/**
 * Constructor
 */
var converge = function (config)
{
    var self = this;

    self.Card = {
        Create: function (options)
        {
            self.Util.validateArgument(options, 'options');
            self.Util.validateArgument(options.cardNumber, 'options.cardNumber');
            self.Util.validateArgument(options.exp, 'options.exp');

            var xmlTransaction = 'xmldata=<txn>\n';
            xmlTransaction += '<ssl_merchant_id>' + self.CONFIG.merchant + '</ssl_merchant_id>\n';
            xmlTransaction += '<ssl_user_id>' + self.CONFIG.username + '</ssl_user_id>\n';
            xmlTransaction += '<ssl_pin>' + self.CONFIG.pin + '</ssl_pin>\n';

            xmlTransaction += '<ssl_transaction_type>ccgettoken</ssl_transaction_type>\n';
            xmlTransaction += '<ssl_add_token>Y</ssl_add_token>\n';
            xmlTransaction += '<ssl_verify>Y</ssl_verify>\n';
            xmlTransaction += '<ssl_test_mode>' + self.TEST_MODE + '</ssl_test_mode>\n';
            xmlTransaction += '<ssl_show_form>false</ssl_show_form>';
            xmlTransaction += '<ssl_result_format>HTML</ssl_result_format>\n';
            xmlTransaction += '<ssl_cvv2cvc2_indicator>1</ssl_cvv2cvc2_indicator>\n';

            xmlTransaction += '<ssl_card_number>' + options.cardNumber + '</ssl_card_number>\n';
            xmlTransaction += '<ssl_exp_date>' + options.exp.replace('/', '') + '</ssl_exp_date>\n';
            xmlTransaction += '<ssl_cvv2cvc2>' + options.cvv + '</ssl_cvv2cvc2>\n';
            xmlTransaction += '<ssl_first_name>' + options.firstName + '</ssl_first_name>\n';
            xmlTransaction += '<ssl_last_name>' + options.lastName + '</ssl_last_name>\n';
            xmlTransaction += '<ssl_avs_zip>' + options.zipcode + '</ssl_avs_zip>\n';
            xmlTransaction += '<ssl_avs_address>' + options.address + '</ssl_avs_address>\n';

            xmlTransaction += '</txn>\n';

            return rp.post(
            {
                url: self.baseUrl,
                form: xmlTransaction
            }).then(function (res)
            {
                if (!res) self.Util.throwInvalidDataError(res);

                var resJSON = xmlP.parse(res);
                if (!resJSON || !resJSON.txn)
                {
                    self.Util.throwInvalidDataError(res);
                }

                if (resJSON.txn.ssl_result === 1)
                {
                    throw new Error('Card could not be tokenized: ' + resJSON.txn.ssl_result_message);
                }

                return resJSON.txn.ssl_token;
            });
        },
        Get: function (options)
        {
            self.Util.validateArgument(options, 'options');
            self.Util.validateArgument(options.foreignKey, 'options.foreignKey');

            var xmlTransaction = 'xmldata=<txn>\n';
            xmlTransaction += '<ssl_merchant_id>' + self.CONFIG.merchant + '</ssl_merchant_id>\n';
            xmlTransaction += '<ssl_user_id>' + self.CONFIG.username + '</ssl_user_id>\n';
            xmlTransaction += '<ssl_pin>' + self.CONFIG.pin + '</ssl_pin>\n';

            xmlTransaction += '<ssl_transaction_type>ccquerytoken</ssl_transaction_type>\n';
            xmlTransaction += '<ssl_test_mode>' + self.TEST_MODE + '</ssl_test_mode>\n';
            xmlTransaction += '<ssl_show_form>false</ssl_show_form>';
            xmlTransaction += '<ssl_result_format>HTML</ssl_result_format>\n';
            xmlTransaction += '<ssl_entry_mode>01</ssl_entry_mode>\n';
            xmlTransaction += '<ssl_get_token>01</ssl_get_token>\n';

            xmlTransaction += '<ssl_token>' + options.foreignKey + '</ssl_token>\n';

            xmlTransaction += '</txn>\n';

            return rp.post(
            {
                url: self.baseUrl,
                form: xmlTransaction
            }).then(function (res)
            {
                if (!res) self.Util.throwInvalidDataError(res);

                var resJSON = xmlP.parse(res);
                if (!resJSON || !resJSON.txn)
                {
                    self.Util.throwInvalidDataError(res);
                }

                if (resJSON.txn.ssl_result === 1)
                {
                    throw new Error('Could not get card: ' + resJSON.txn.ssl_result_message);
                }

                var expDate = String(resJSON.txn.ssl_exp_date);
                var expMonth = expDate.slice(0, expDate.length === 3 ? 1 : 2);
                var expYear = expDate.slice(-2);

                return {
                    cardHolderName: resJSON.txn.ssl_first_name + ' ' + resJSON.txn.ssl_last_name,
                    expirationMonth: expMonth,
                    expirationYear: expYear,
                    last4: resJSON.txn.ssl_account_number.slice(-4),
                    imageUrl: null,
                    cardType: resJSON.txn.ssl_card_type,
                    postalCode: resJSON.txn.ssl_avs_zip
                };
            });
        },
        Sale: function (options)
        {
            self.Util.validateArgument(options, 'options');
            self.Util.validateArgument(options.amount, 'options.amount');
            self.Util.validateArgument(options.foreignKey, 'options.foreignKey');

            var xmlTransaction = 'xmldata=<txn>\n';
            xmlTransaction += '<ssl_merchant_id>' + self.CONFIG.merchant + '</ssl_merchant_id>\n';
            xmlTransaction += '<ssl_user_id>' + self.CONFIG.username + '</ssl_user_id>\n';
            xmlTransaction += '<ssl_pin>' + self.CONFIG.pin + '</ssl_pin>\n';

            xmlTransaction += '<ssl_transaction_type>ccsale</ssl_transaction_type>\n';
            xmlTransaction += '<ssl_test_mode>' + self.TEST_MODE + '</ssl_test_mode>\n';
            xmlTransaction += '<ssl_show_form>false</ssl_show_form>';
            xmlTransaction += '<ssl_result_format>HTML</ssl_result_format>\n';
            xmlTransaction += '<ssl_entry_mode>01</ssl_entry_mode>\n';
            xmlTransaction += '<ssl_get_token>01</ssl_get_token>\n';

            xmlTransaction += '<ssl_token>' + options.foreignKey + '</ssl_token>\n';
            xmlTransaction += '<ssl_amount>' + options.amount + '</ssl_amount>\n';

            xmlTransaction += '</txn>\n';

            return rp.post(
            {
                url: self.baseUrl,
                form: xmlTransaction
            }).then(function (res)
            {
                if (!res) self.Util.throwInvalidDataError(res);

                var resJSON = xmlP.parse(res);
                if (!resJSON || !resJSON.txn)
                {
                    self.Util.throwInvalidDataError(res);
                }

                if (resJSON.txn.ssl_result === 1)
                {
                    throw new Error('Card could not be tokenized: ' + resJSON.txn.ssl_result_message);
                }

                return resJSON.txn.ssl_txn_id;
            });
        },
        Void: function (options)
        {
            self.Util.validateArgument(options, 'options');
            self.Util.validateArgument(options.transactionForeignKey, 'options.transactionForeignKey');

            var xmlTransaction = 'xmldata=<txn>\n';
            xmlTransaction += '<ssl_merchant_id>' + self.CONFIG.merchant + '</ssl_merchant_id>\n';
            xmlTransaction += '<ssl_user_id>' + self.CONFIG.username + '</ssl_user_id>\n';
            xmlTransaction += '<ssl_pin>' + self.CONFIG.pin + '</ssl_pin>\n';

            xmlTransaction += '<ssl_transaction_type>ccvoid</ssl_transaction_type>\n';
            xmlTransaction += '<ssl_test_mode>' + self.TEST_MODE + '</ssl_test_mode>\n';
            xmlTransaction += '<ssl_show_form>false</ssl_show_form>';
            xmlTransaction += '<ssl_result_format>HTML</ssl_result_format>\n';
            xmlTransaction += '<ssl_entry_mode>01</ssl_entry_mode>\n';
            xmlTransaction += '<ssl_get_token>01</ssl_get_token>\n';

            xmlTransaction += '<ssl_txn_id>' + options.transactionForeignKey + '</ssl_txn_id>\n';

            xmlTransaction += '</txn>\n';

            return rp.post(
            {
                url: self.baseUrl,
                form: xmlTransaction
            }).then(function (res)
            {
                if (!res) self.Util.throwInvalidDataError(res);

                var resJSON = xmlP.parse(res);
                if (!resJSON || !resJSON.txn)
                {
                    self.Util.throwInvalidDataError(res);
                }

                if (resJSON.txn.ssl_result === 1)
                {
                    throw new Error('Card could not be tokenized: ' + resJSON.txn.ssl_result_message);
                }

                return resJSON.txn.ssl_txn_id;
            });
        },
        Refund: function (options)
        {
            self.Util.validateArgument(options, 'options');
            self.Util.validateArgument(options.amount, 'options.amount');
            self.Util.validateArgument(options.transactionForeignKey, 'options.transactionForeignKey');

            var xmlTransaction = 'xmldata=<txn>\n';
            xmlTransaction += '<ssl_merchant_id>' + self.CONFIG.merchant + '</ssl_merchant_id>\n';
            xmlTransaction += '<ssl_user_id>' + self.CONFIG.username + '</ssl_user_id>\n';
            xmlTransaction += '<ssl_pin>' + self.CONFIG.pin + '</ssl_pin>\n';

            xmlTransaction += '<ssl_transaction_type>ccreturn</ssl_transaction_type>\n';
            xmlTransaction += '<ssl_test_mode>' + self.TEST_MODE + '</ssl_test_mode>\n';
            xmlTransaction += '<ssl_show_form>false</ssl_show_form>';
            xmlTransaction += '<ssl_result_format>HTML</ssl_result_format>\n';
            xmlTransaction += '<ssl_entry_mode>01</ssl_entry_mode>\n';
            xmlTransaction += '<ssl_get_token>01</ssl_get_token>\n';

            xmlTransaction += '<ssl_txn_id>' + options.transactionForeignKey + '</ssl_txn_id>\n';
            xmlTransaction += '<ssl_amount>' + options.amount + '</ssl_amount>\n';

            xmlTransaction += '</txn>\n';

            return rp.post(
            {
                url: self.baseUrl,
                form: xmlTransaction
            }).then(function (res)
            {
                if (!res) self.Util.throwInvalidDataError(res);

                var resJSON = xmlP.parse(res);
                if (!resJSON || !resJSON.txn)
                {
                    self.Util.throwInvalidDataError(res);
                }

                if (resJSON.txn.ssl_result === 1)
                {
                    throw new Error('Card could not be tokenized: ' + resJSON.txn.ssl_result_message);
                }

                return resJSON.txn.ssl_txn_id;
            });
        }
    };

    self.Util = {
        validateArgument: function (arg, name)
        {
            if (arg === null || arg === undefined)
            {
                throw new Error('Required argument missing: ' + name);
            }
        },
        throwInvalidDataError: function (res)
        {
            throw new Error('Invalid response data: ' + JSON.stringify(res));
        }
    };

    self.Util.validateArgument(config.merchant, 'merchant');
    self.Util.validateArgument(config.username, 'username');
    self.Util.validateArgument(config.pin, 'pin');
    self.Util.validateArgument(config.environment, 'environment');

    self.CONFIG = JSON.parse(JSON.stringify(config));

    self.baseUrl = sandbox;
    self.TEST_MODE = 'Y';
    if (self.CONFIG.environment === 'Production')
    {
        self.TEST_MODE = 'N';
        self.baseUrl = production;
    }

    return self;
};

module.exports = converge;