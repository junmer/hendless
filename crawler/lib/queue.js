/**
 * @file Queue
 * @author junmer(junmer@foxmail.com)
 */

/**
 * 队
 *
 * @inner
 * @constructor
 */
function Queue() {
    this.raw = [];
    this.length = 0;
}

Queue.prototype = {
    /**
     * 添加元素进栈
     *
     * @param {*} elem 添加项
     */
    push: function ( elem ) {
        var args = Array.prototype.slice.call(arguments, 0);
        var me = this;
        args.forEach(function (item) {
            me.raw[ me.length++ ] = item;
        });
    },

    /**
     * 弹出底部元素
     *
     * @return {*}
     */
    pop: function () {
        if ( this.length > 0 ) {

            --this.length;
            return this.raw.shift();
            
        }
    },

    /**
     * 获取顶部元素
     *
     * @return {*}
     */
    top: function () {
        return this.raw[ this.length - 1 ];
    },

    /**
     * 获取底部元素
     *
     * @return {*}
     */
    bottom: function () {
        return this.raw[ 0 ];
    },

    /**
     * 根据查询条件获取元素
     * 
     * @param {Function} condition 查询函数
     * @return {*}
     */
    find: function ( condition ) {
        var index = this.length;
        while ( index-- ) {
            var item = this.raw[ index ];
            if ( condition( item ) ) {
                return item;
            }
        }
    }
};

module.exports = Queue;