/**
 * @file 列表Model
 * @author junmer(junmer@foxmail.com)
 */

define(function (require) {

    var BaseModel = require('saber-firework/Model');

    var listEntity = require('./listEntity');   // 实体

    var etpl = require('etpl');

    var etplEngine = new etpl.Engine();

    var listTpl = require('text!../view/list.tpl');

    etplEngine.compile(listTpl);

    function Model() {
        BaseModel.call('list');
    }

    BaseModel.subClass(Model);


    /**
     * 获取列表
     *
     * @param {string} id 
     */
    Model.prototype.fetch = function (id) {

        var tpl = { // 模板
            nav: etplEngine.getRenderer('nav'), // 导航
            list: etplEngine.getRenderer('list'), // 列表
            main: etplEngine.getRenderer('main') // 主
        };

        return listEntity.get(id)
            .then(function (data) {

                return {
                    data: data,
                    template: tpl
                };

            });
    };


    return Model;
});
