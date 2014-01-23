/**
 * @file 列表Model
 * @author junmer(junmer@foxmail.com)
 */

define(function (require) {

    var BaseModel = require('saber-firework/Model');

    var etpl = require('etpl');

    var etplEngine = new etpl.Engine();

    var tpl = require('text!../view/thing.tpl');

    etplEngine.compile(tpl);

    var thingEntity = require('./thingEntity');   // 实体

    function Model() {
        BaseModel.call('list');
    }

    BaseModel.subClass(Model);


    /**
     * 获取物品
     *
     * @param {string} key 
     */
    Model.prototype.fetch = function (key) {

        var tpl = { // 模板
            nav: etplEngine.getRenderer('nav'), // 导航
            main: etplEngine.getRenderer('main') // 主
        };

        return thingEntity.get(key)
            .then(function (data) {

                return {
                    data: data,
                    template: tpl
                };

            });
    };


    return Model;
});
