/**
 * @file 简单的 爬虫
 */


var EventEmitter    = require('events').EventEmitter;
var util            = require('util');
var url             = require('url');
var helper          = require('./helper');
var CookieJar       = require('./cookies.js');
var Queue           = require('./queue');
var Factory         = require('./factory');


/**
 * 爬虫
 * @param {string} hostname     hostname
 * @param {string} pathname     pathname
 * @param {number} port     port
 * @param {interval} interval interval
 */
function Crawler(hostname, pathname, port, interval) {

    var crawler                 = this;

    // 目标 hostname
    crawler.hostname            = hostname || '';

    // 目标 路径
    crawler.pathname            = pathname || '/';

    // 目标 端口
    crawler.port                = port || 80;

    // 默认 protocol
    crawler.protocol            = 'http:';

    // 任务 间隔时间
    crawler.interval            = interval || 250;

    // User Agent
    crawler.userAgent           = ''
        + 'Mozilla/5.0 '
        + '(Windows NT 6.2; WOW64) '
        + 'AppleWebKit/537.36 '
        + '(KHTML, like Gecko) '
        + 'Chrome/31.0.1650.63 Safari/537.36';

    // cookie 相关
    crawler.acceptCookies       = true;
    crawler.cookies             = new CookieJar();

    // 任务队列
    crawler.queue               = new Queue();

    // 过滤条件
    crawler._filters            = [];

    // 忽略 url ? 后的 query
    crawler.stripQuerystring    = false;

    // 已经抓取完的
    crawler._fetched            = [];

    // 下载工厂
    crawler.factory             = new Factory(crawler);


    // mixin emitter
    EventEmitter.call(crawler);

}

// mixin emitter
util.inherits(Crawler, EventEmitter);

Crawler.prototype.start = function () {

    var crawler = this;

    // start once
    if (crawler.queue.bottom() === undefined) {

        crawler.queue.push({
            protocol: crawler.protocol,
            hostname: crawler.hostname,
            port: crawler.port,
            pathname: crawler.pathname
        });

    }

    // protocol filter
    crawler.addFetchCondition(function (item) {
        
        return item.protocol === crawler.protocol;

    });

    // fetch once
    crawler.addFetchCondition(function (item) {
        
        if (crawler._fetched[item.pathname]) {
            return false;
        } 
        else {
            crawler._fetched[item.pathname] = 1;
            return true;
        }


    });

    crawler.intervalInstance = setInterval(function () {

        var i = Math.min(
            crawler.factory.max - crawler.factory.jobs,
            crawler.queue.length
        ) || 1;

        for (; i > 0;  i--) {

            crawler.crawl.call(crawler);

        }       

    }, crawler.interval);

    crawler.emit('crawlstart');

    process.nextTick(function () {

        crawler.crawl();

    });

    return crawler;
};

Crawler.prototype.crawl = function () {

    var crawler = this;

    var item = crawler.queue.bottom();

    if (item) {
        
        if (typeof item === 'string') { // url2obj
            item = url.parse(item);
        }
        else if (typeof item.href === 'undefined') {
            item = url.format(item);    // format
            item = url.parse(item);     // url2obj
        }

        // stripQuerystring
        if (crawler.stripQuerystring) {
            item.href = helper.removeQuerystring(item.href);
            item = url.parse(item.href);
        }

        crawler.filter(item, function (ignore) {

            if (ignore) {
                return crawler.queue.pop();
            } 
            else {

                // get worker
                crawler.factory.getWorker(function (worker) {

                    crawler.emit('fetchstart', item);

                    crawler.queue.pop();

                    // new worker
                    worker.fetch(
                        item, 
                        function (err, item, responseBuffer, response) {

                            if (err) {
                                throw err;
                            }

                            // set cookie
                            if (
                                response
                                    .headers
                                    .hasOwnProperty('set-cookie')
                            ) {

                                crawler
                                    .cookies
                                    .addFromHeaders(
                                        response.headers['set-cookie']
                                    );
                            }
                            
                            crawler.emit(
                                'fetchcomplete', 
                                item,
                                responseBuffer,
                                response
                            );
                        }
                    );
                    

                });
            }
        });
    
    }
    else {

        // 工作完成
        crawler.factory.done(function () {

            // 工作完成 + 没有新任务 = done
            if (!crawler.queue.bottom()) {

                crawler.emit('complete');
                crawler.stop();

            }

        });
    

    }

};

/**
 * 过滤器
 */
Crawler.prototype.filter = function (item, callback) { 
    var crawler = this;
    var match = true;
    var filterLength = crawler._filters.length;

    crawler._filters.forEach(function (filter, index) {

        match = match && filter(item);

        if (filterLength - index === 1) {
            callback(!match);
        }

    });
};

Crawler.prototype.addFetchCondition = function (callback) {
    var crawler  = this;
    crawler._filters.push(helper.funz(callback));
};

Crawler.prototype.stop = function () {
    var crawler = this;
    
    clearInterval(crawler.intervalInstance);

    process.exit();

    return crawler;
};

module.exports = Crawler;