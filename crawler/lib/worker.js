/**
 * @file Worker
 * @author junmer(junmer@foxmail.com)
 */

var http            = require('http');
var EventEmitter    = require('events').EventEmitter;
var helper          = require('./helper');
var url             = require('url');

function Worker(reqOption) {

    var worker = this;

    worker.discoverRegex = [
        /(\shref\s?=\s?|\ssrc\s?=\s?|url\()([^\"\'\s>\)]+)/ig,
        /(\shref\s?=\s?|\ssrc\s?=\s?|url\()['"]([^"']+)/ig,
        /http(s)?\:\/\/[^?\s><\'\"]+/ig,
        /url\([^\)]+/ig,
        /^javascript\:[a-z0-9\$\_\.]+\(['"][^'"\s]+/ig
    ];

    worker.reqOption = reqOption || {};

}

Worker.publisher = new EventEmitter();

Worker.prototype.fetch = function (item, callback) {

    var worker = this;

    var reqOption = helper.extend(worker.reqOption, item);
    
    // var reqOption = item;

    if (!reqOption) {
        return;
    }
    
    var req = http.get(reqOption, function (res) {

        var chunks = [],
            length = 0;

        res
            .on('data', function (chunk) {

                length += chunk.length;
                chunks.push(chunk);

            })
            .on('end', function () {

                var data = new Buffer(length),
                    pos = 0,
                    l = chunks.length;

                for (var i = 0; i < l; i++) {
                    chunks[i].copy(data, pos);
                    pos += chunks[i].length;
                }

                res.body = data;

                helper.funz(callback)(null, reqOption, data, res);

                worker.handleRes(reqOption, data, res);

            })
            .on('error', function (err) {
                helper.funz(callback)(err, item);
                // free worker
                Worker.publisher.emit('publish', worker, []);
            });

    })
    .on('error', function (err) {
        helper.funz(callback)(err, item);
        // free worker
        Worker.publisher.emit('publish', worker, []);
    });

    req.end();

};

Worker.prototype.handleRes = function (item, data) {
    var worker = this;

    var resourceText = data.toString('utf8');

    var resources = [];

    function cleanURL(URL) {
        
        return URL
            .replace(/^(\s?href|\s?src)=['"]?/i, '')
            .replace(/^\s*/, '')
            .replace(/^url\(['"]*/i, '')
            .replace(/^javascript\:[a-z0-9]+\(['"]/i, '')
            .replace(/^javascript\:;/i, '') 
            .replace(/["'\)]$/i, '')
            .replace(/^\/\//, item.protocol + '://')
            .replace(/\&amp;/i, '&')
            .split('#')
            .shift();
    }

    // Clean links
    function cleanAndQueue(urlMatch) {

        if (!urlMatch) {
            return [];
        }

        return urlMatch
            .map(cleanURL)
            .reduce(function (list, URL) {

                // resolve pathname
                try {

                    URL = url.resolve(
                        item.protocol + '//' + item.hostname, 
                        URL
                    );
      
                } 
                catch (e) {
                    return list;
                }

                // empty filter
                if (!URL.length) {
                    return list;
                }

                // exist filter
                if (
                    resources.reduce(function (prev, current) {
                        return prev || current === URL;
                    }, false)
                    ) {

                    return list;
                }

                return list.concat(URL);
            }, []);
    }

    var urlList = worker.discoverRegex
        .reduce(function (list, regex) {    // 正则找

            return list.concat(
                cleanAndQueue(
                    resourceText.match(regex)
                )
            );

        }, [])
        .reduce(function (list, check) {       // 去重

            if (list.indexOf(check) < 0) {
                return list.concat([check]);
            }

            return list;
        }, []);

    Worker.publisher.emit('publish', worker, urlList);

};

Worker.prototype.free = function () {
    delete this;
};

module.exports = Worker;