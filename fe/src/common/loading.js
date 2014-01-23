/**
 * @file loading 
 * @author cxl(chenxinle@baidu.com)
 *         mlj[menglingjun@baidu.com]
 */

define(function( require ) {

    var dom = require('saber-dom');

    var WEBSITE_CLS = 'loading-website';
    var WEBSITE_CLS_REG = new RegExp('\\s+' + WEBSITE_CLS + '($|\s)');

    var hideTimer;
    var showTimer;

    function hideLoading() {
        if (hideTimer) {
            clearTimeout(hideTimer);
            hideTimer = null;
        }
        if (showTimer) {
            clearTimeout(showTimer);
            showTimer = null;
        }

        var ele = dom.query('.global-loading');
        if (ele && ele.className.indexOf(WEBSITE_CLS) >= 0) {
            ele.className = ele.className.replace(
                WEBSITE_CLS_REG, function ($0, $1) {
                    return $1;
                }
            );
        }
    }

    function showLoading() {

        showTimer = setTimeout(function () {
            var ele = dom.query('.global-loading');
            if (ele) {
                ele.className += ' ' + WEBSITE_CLS;
                hideTimer = setTimeout(hideLoading, 3000);
            }
        }, 80);

    }

    return {
        show: showLoading,
        hide: hideLoading,
    };

});
