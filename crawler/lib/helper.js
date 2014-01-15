/**
 * @file helper
 */

helper = {};


helper.extend = function (target, source) {
    for (var key in source) {
        if (source.hasOwnProperty(key)) {
            target[key] = source[key];
        }
    }

    return target;
};

helper.funz = function (source) {

    if ('[object Function]' == Object.prototype.toString.call(source)) {
        return source;
    } 
    else {
        return function () {};
    }

};

helper.toUrl = function (item) {

    return ''
        + item.protocol
        + '://'
        + item.hostname
        + ':'
        + item.port
        + item.pathname;
};

helper.trim = function () {
    var trimer = new RegExp(
        '(^[\\s\\t\\xa0\\u3000]+)|([\\u3000\\xa0\\s\\t]+\x24)', 
        'g'
    );
    return function (source) {
        return String(source).replace(trimer, '');
    };
}();

helper.removeQuerystring = function (url) {
    if (url.indexOf('?') > -1) {
        return url.substr(0, url.indexOf('?'));
    } 
    else {
        return url;
    }
};


module.exports = helper;