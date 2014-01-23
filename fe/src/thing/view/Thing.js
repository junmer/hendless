/**
 * @file 物品View
 * @author junmer(junmer@foxmail.com)
 */

define(function (require) {

    var BaseView = require('saber-firework/View');

    var loading = require('common/loading');

    var showLoading = loading.show;
    var hideLoading = loading.hide;

    function View() {
        BaseView.call(this, 'thing');
    }

    View.prototype.className = 'thing';

    /**
     * 渲染主体
     * 
     * @param  {object} main     主区域
     * @param  {object} template 模板
     * @param  {object} data     数据
     */
    View.prototype.render = function (main, template, data) {

        BaseView.prototype.render.call(this, main);

        main.innerHTML = ''
            + template.nav() 
            + template.main( data );

    };

    View.prototype.back = function () {
        hideLoading();
    };

    View.prototype.dispose = function () {
        this.back();
        BaseView.prototype.dispose.call(this);
    };

    return View;
});
