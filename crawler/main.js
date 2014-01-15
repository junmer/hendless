/**
 * @file crawler 
 */

var Crawler = require('./lib/mini-crawler');

var crawler = new Crawler('knewone.com');

var condition = crawler.addFetchCondition(function (item) {

    if (item.pathname === '/' || item.pathname.indexOf('/page/') > -1) {
        return true;
    }

    return false;

});



crawler.on('fetchstart', function (item) {

    console.log('fetchstart:', item.href);

});

crawler.on('fetchcomplete', function (item, responseBuffer) {

    console.log('Completed fetching resource:', item.href);

    // console.log(responseBuffer.toString('utf-8'));

});

crawler.on('complete', function () {

    console.log('complete');

});

crawler.start();