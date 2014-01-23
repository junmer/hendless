/**
 * @file 物品详情Action
 * @author junmer(junmer@foxmail.com)
 */


define(function (require) {

    var BaseAction = require('saber-firework/Action');
    var Model = require('./model/Thing');
    var View = require('./view/Thing');

    function Action() {
        BaseAction.call(this, 'thing');
        this.view = new View();
        this.model = new Model();
    }

    BaseAction.subClass(Action);

    Action.prototype.enter = function (main, url, query) {
        var action = this;

        return this.model.fetch(query.key, query).then(
            function (res) {
                action.view.render(main, res.template, res.data);
            }
        );
  
    };

    return Action;
});