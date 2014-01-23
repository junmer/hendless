/**
 * @file 信息实体
 * @author junmer(junmer@foxmail.com)
 */

define(function (require) {

    var ajax = require('saber-ajax/ejson');

    var Entity = require('common/Entity');

    /**
     * 查询方法
     * @param  {number} page 页号
     * @return {Promise}      
     */
    function query(page) {

        return ajax.get('/list/' + page);
        
    }

    var listEntry = new Entity('list');

    var exports = {};

    /**
     * 获取信息
     *
     * @public
     * @param {number} id
     * @param {Promise}
     */
    exports.get = function (id) {

        return listEntry.get(id, query);

    };

    return exports;
});
