/**
 * @file 列表模块action配置
 * @author junmer(junmer@foxmail.com)
 */

define(function (require) {
    return [
        {path: '/list', Action: require('./List'), index: 10},
        {path: '/list/:id', Action: require('./List'), index: 10}
    ];
});
