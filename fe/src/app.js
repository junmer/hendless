/**
 * @file 主框架
 * @author cxl(c.xinle@gmail.com)
 *         junmer(junmer@foxmail.com)
 */

define(function (require) {

    var dom = require('saber-dom');
    var curry = require('saber-lang/curry');
    var router = require('saber-router');
    var viewport = require('saber-viewport');
    
    // var env = require('saber-env');
    // var Resolver = require('saber-promise');
    // var Emitter = require('saber-emitter');

    var slide = require('saber-viewport/transition/slide');
    require('saber-tap').mixin(document.body);
    // fix for `:active`
    document.addEventListener('touchstart', function () {}, false);

    var model = {};

    var cachedAction = {};

    var waitingActions = [];

    /**
     * 锁定视图
     * 放置重复转场
     *
     * @inner
     */
    function lockViewPort(locked) {
        var res = false;

        if (locked === false) {
            if (model.lockedTimer) {
                clearTimeout(model.lockedTimer);
                model.lockedTimer = null;
                res = true;
            }
        }
        else if (!model.lockedTimer) {
            model.lockedTimer = setTimeout(curry(lockViewPort, false), 3000);
            res = true;
        }

        return res;
    }

    /**
     * 隐藏全局加载浮层
     *
     * @inner
     */
    function hideGlobalLoading() {
        if (!hideGlobalLoading.hide) {
            dom.removeClass(dom.query('.global-loading'), 'show');
            hideGlobalLoading.hide = true;
        }
    }

    /**
     * 转场操作
     *
     * @inner
     */
    function transition(action, page, url, index) {
        hideGlobalLoading();

        // 转场前滚动条设置
        var scrollTop = document.body.scrollTop;
        if (model.action) {
            model.action.scrollTop = scrollTop;
        }
        var ele = page.main;
        ele.style.marginTop = scrollTop - (action.scrollTop || 0) + 'px';

        // 设置转场效果及方向
        page.enter('slide', {
            direction: model.pageIndex < index 
                            ? slide.RIGHT
                            : slide.LEFT
        });
        // 保存当前视图信息
        model.action = action;
        model.url = url;
        model.pageIndex = index;
        model.page = page;

        // 缓存Action
        if (page.cached) {
            cachedAction[url] = action;
        }
        else if (cachedAction[url]) {
            delete cachedAction[url];
        }
    }

    
    /**
     * 处理等待的Action
     * 目前只处理最后一个等待的请求
     *
     * @inner
     */
    function processWaiting() {
        var params = waitingActions.pop();
        if (model.timer) {
            clearTimeout(model.timer);
        }

        lockViewPort(false);

        waitingActions = [];
        if (params) {
            loadAction.apply(window, params);
        }
    }

    /**
     * 转场结束处理
     *
     * @inner
     */
    function finishTransition(action) {
        // 转场后滚动条设置
        var ele = model.page.main;
        ele.style.marginTop = '0';
        document.body.scrollTop = action.scrollTop || 0;

        action.emit('finishtransition');

        processWaiting();
    }

    /**
     * 清理缓存的Action
     *
     * @inner
     */
    function cleanCache(url, Action) {
        var action;
        Object.keys(cachedAction).forEach(function (key) {
            action = cachedAction[key];
            if (url !== key && action instanceof Action) {
                action.emit('leave');
                delete cachedAction[key];
            }
        });
    }

    /**
     * refresh Action
     *
     * @inner
     */
    function refreshAction(url, query) {
        var action = model.action;

        if (action.refresh) {
            action.refresh(query);
            processWaiting();
        }
        else if (action.cached) {
            action.emit('sleep');
            action.wakeup && action.wakeup(url, query);
            finishTransition(action);
        }
        else {
            action.emit('leave');
            action.enter(model.page.main, url, query)
                    .then(curry(finishTransition, action));
        }
    }

    /**
     * enter Action
     *
     * @inner
     */
    function enterAction(url, query, index, Action) {
        cleanCache(url, Action);

        var action = cachedAction[url];
        if (!action) {
            action = new Action();
        }

        if (model.action) {
            if (model.action.cached) {
                model.action.emit('sleep');
            }
            else {
                model.action.emit('leave');
            }
        }
        
        var page = viewport.load(url, {cached: action.cached});
        page.on('afterenter', curry(finishTransition, action));

        if (cachedAction[url]) {
            action.wakeup && action.wakeup(url, query);
            transition(action, page, url, index);
        }
        else {
            action.enter(page.main, url, query)
                .then(curry(transition, action, page, url, index));
        }
    }

    /**
     * 加载Action
     *
     * @inner
     */
    function loadAction(config, url, query) {

        if (!lockViewPort()) {
            waitingActions.push([config, url, query]);
            return;
        }

        // 百度统计
        // _hmt.push(['_trackPageview', url]);

        if (model.url === url) {
            refreshAction(url, query);
        }
        else {
            enterAction(url, query, config.index, config.Action);
        }
    }

    /**
     * 加载配置信息
     *
     * @inner
     */
    function loadConfig(config) {
        config.forEach(function (item) {
            router.add(item.path, curry(loadAction, item));
        });
    }

    // 加载action配置
    loadConfig(require('./list/config'));
    // loadConfig(require('./thing/config'));

    /*
    // 全局错误页面
    loadConfig([
        {path: '/error', index: 100, Action: require('./Error')}
    ]);

    Resolver.enableGlobalEvent(Emitter);
    Resolver.on('reject', function (reason) {
        if (reason.message == 'GO_ERROR') {
            model.loading = false;
            router.redirect('/error');
        }
    });
    */
    
    return {
        /**
         * 初始化
         *
         * @public
         */
        init: function () {

            var options = {
                    duration: 0.3
                };
            
            viewport.init('viewport', options);

            var url = '/list';
            router.index = url;
            router.start();
        }
    };

});
