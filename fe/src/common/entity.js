/**
 * @file 信息实体
 * @author junmer(junmer@foxmail.com)
 */

define(function (require) {

    var Model = require('saber-firework/Model');

    var Resolver = require('saber-promise');

    var model;

    /**
     * 数据实体
     * @param {string} name 实体name
     */
    function Entity(name) {

        model = new Model(name);

    }

    /**
     * 保存数据
     *
     * @inner
     */
    function save(id, data, tryCount) {
        tryCount = tryCount || 0;

        try {
            model.set(id, data, 'session');
        }
        catch (e) {
            if (tryCount >= 1) {
                model.set(id, data);
            }
            else {
                model.clear('session');
                save(id, data, ++tryCount);
            }
        }

        return data;
    }

    Entity.prototype.get = function (id, query, params) {

        var resolver = new Resolver();

        var data = model.get(id);

        if (!data) {

            query(id, params || {}).then(function (data) {
                save(id, data);
                resolver.resolve(data);
            });

        }
        else {
            resolver.resolve(data);
        }

        return resolver.promise();
    };

    return Entity;

});
