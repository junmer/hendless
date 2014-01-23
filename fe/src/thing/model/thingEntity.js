/**
 * @file 信息实体
 * @author junmer(junmer@foxmail.com)
 */

define(function (require) {

    var ajax = require('saber-ajax/ejson');

    var Entity = require('common/Entity');

    /**
     * 查询方法
     * @param  {number} key 物品key
     * @return {Promise}      
     */
    function query(key) {

        return ajax.get('/thing/' + key);
        
    }

    var listEntry = new Entity('thing');

    var exports = {};

    /**
     * 获取信息
     *
     * @public
     * @param {number} key
     * @param {Promise}
     */
    exports.get = function (key) {

        return listEntry.get(key, query);

    };

    return exports;
});
