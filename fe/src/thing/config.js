/**
 * @file 物品模块action配置
 * @author junmer(junmer@foxmail.com)
 */

define(function (require) {
    return [
        {path: '/thing', Action: require('./Thing'), index: 10},
        {path: '/thing/:key', Action: require('./Thing'), index: 10}
    ];
});
