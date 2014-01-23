/**
 * @file 列表View
 * @author junmer(junmer@foxmail.com)
 */

define(function (require) {

    var BaseView = require('saber-firework/View');
    var dom = require('saber-dom');

    var loading = require('common/loading');

    var showLoading = loading.show;
    var hideLoading = loading.hide;

    function View() {
        BaseView.call(this, 'list');
    }

    View.prototype.className = 'list';

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

        hideLoading();

        renderPager(data, main);

        bindEvents(this);

    };

    /**
     * 渲染列表
     * 
     * @param  {object} template 模板
     * @param  {object} data     数据
     */
    View.prototype.renderList = function (template, data) {

        var tpl = etpl.template(template.list);

        var listGroup = dom.query('.list-group');

        listGroup.innerHTML = tpl(data);

        hideLoading();

        renderPager(data);

    };

    /**
     * 渲染下一页
     * 
     * @param  {object} template 模板
     * @param  {object} data     数据
     */
    View.prototype.renderNextPage = function (template, data) {

        var pager = dom.query('.pager');

        pager.innerHTML = '查看下一页';

        var listGroup = dom.query('.list-group');

        listGroup.innerHTML += template.list(data);

        renderPager(data);

    };

    View.prototype.back = function () {
        hideLoading();
    };

    View.prototype.dispose = function () {
        this.back();
        BaseView.prototype.dispose.call(this);
    };

    /**
     * 渲染翻页组件
     * @inner
     * @param  {object} data 数据
     * @param  {object} main 主区域
     */
    function renderPager(data, main) {
        var pager = dom.query('.pager', main);

        pager.setAttribute('data-page', data.page);

        if( !data.hasNextPage ) {
            dom.addClass(pager, 'disable');
        }
        else {
            dom.removeClass(pager, 'disable');
        }

    }

    /**
     * 绑定 DOM 事件
     * @param  {object} view view
     */
    function bindEvents(view) {

        // 翻页按钮
        var pager = dom.query('.pager', view.main);

        // 点击下一页
        pager.addEventListener('click', function () {

            pager.innerHTML = ''
                + '查看下一页 '
                + '<b class="loading"></b>';

            view.emit(
                'pageChange', 
                +(pager.getAttribute('data-page') || 0) + 1
            );

        });

        // 列表
        var listGroup = dom.query('.list-group', view.main);

        // 查看详情
        listGroup.addEventListener('click', function (e) {

            var list = dom.closest( e.target, 'li' );

            if (!list) {
                return;
            }

            showLoading();

            view.emit('showDetail', {
                key: list.getAttribute('data-key') || '0'
            });
            
        });

    }

    return View;
});
