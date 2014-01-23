/**
 * @file 评论列表Action
 * @author menglingjun(menglingjun@baidu.com)
 */

define(function (require) {

    var BaseAction = require('saber-firework/Action');

    var Model = require('./model/List');
    var View = require('./view/List');

    var router = require('saber-router');

    function Action() {

        BaseAction.call(this, 'list');
        this.view = new View();
        this.model = new Model();

        this.on('leave', leaveHandler);
        this.on('sleep', sleepHandler);
        this.cached = true;
    }

    BaseAction.subClass(Action);

    Action.prototype.enter = function (main, url, query) {
        var action = this;

        // 绑定事件
        bindEvents( action, query );

        return this.model.fetch(query.page || 0, query).then(
            function (res) {
                action.view.render(main, res.template, res.data);
            }
        );
  
    };

    /**
     * Action离开处理
     *
     * @inner
     */
    function leaveHandler() {
        this.view.dispose();
    }

    /**
     * sleep处理
     *
     * @inner
     */
    function sleepHandler() {
        this.view.back();
    }

    /**
     * 绑定事件
     * @param  {object} action action
     * @param  {object} query  query
     */
    function bindEvents(action, query) {

        /**
         * 翻页
         * @param  {number} page   目标页数
         * @param  {object} params 参数 
         */
        action.view.on('pageChange', function (page) {
            
            action.model.fetch(query.id, {
                page: page
            }).then(
                function (res) {

                    action.view.renderNextPage( res.template, res.data );

                }
            );

        });

        /**
         * 查看详情
         * 
         * @param  {object} params 参数 
         */
        action.view.on('showDetail', function (params) {
            
            router.redirect(
                './thing/' 
                + params.key
            );

        });



    }

    return Action;
});
