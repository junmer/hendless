/**
 * @file Factory
 * @author junmer(junmer@foxmail.com)
 */

var Worker    = require('./worker');
var helper    = require('./helper');

function Factory(crawler) {

    var factory = this;

    factory.crawler = crawler;

    factory.max = crawler.max || 20;

    factory.jobs = 0;

    factory.workers = [];

    factory.subscribe(Worker.publisher);
}


Factory.prototype.getReqOption = function () {
    var factory = this;
    var crawler = factory.crawler;

    return {
        hostname: crawler.hostname,
        pathname: crawler.pathname,
        port: crawler.port,
        protocol: crawler.protocol,
        headers: {
            cookies: crawler.cookies.toString(),
            userAgent: crawler.userAgent
        }
    };
};

Factory.prototype.getWorker = function (callback) {
    var factory = this;

    if (factory.max - factory.jobs > 0) {

        ++factory.jobs;
        
        var worker = new Worker(
                factory.getReqOption()
            );

        callback(
            worker, 
            factory.workers.push(worker),
            factory.workers.length
        );
    }

};

Factory.prototype.subscribe = function (publisher) {
    var factory = this;

    publisher.on('publish', function (worker, urls) {

        // free jobs
        --factory.jobs;

        // push queue
        factory.crawler.queue.push.apply(
            factory.crawler.queue,
            urls
        );

        worker.free();

    });

};

Factory.prototype.done = function (callback) {
    var factory = this;

    if (factory.jobs === 0) {
        helper.funz(callback)(factory.workers);
    }

};

module.exports = Factory;