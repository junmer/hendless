/**
 * @file data
 */

var fs = require('fs');
var path = require('path');

var dir = path.resolve(
    __dirname,
    '../../crawler/data.json'
);

var data = {
    list: [],
    index: {},
    pageSize: 5,
    total: 0,
    listSize: 0
};

function get(key) {
    return data.list[
        data.index[key]
    ] || [];
}

function list(page) {

    var res = {
        list: [],
        page: isNaN(+page) ? 0 : +page
    };

    if ( res.page > data.listSize ) {
        return res;
    }

    res.list = data.list.slice(
        page * data.pageSize, 
        data.pageSize
    );

    res.hasNextPage = data.listSize > res.page + 1;

    return res;

}

function createIndex() {
    data.list.forEach(function (item, index) {
        data.index[item.key] = index;
    });
}

!function init() {

    if( fs.existsSync(dir) ) {

        try {
            data.list = JSON.parse(
                fs.readFileSync(dir).toString('utf-8')
            );
        }
        catch (e) {
            throw 'data init err';
        }
        
        data.total = data.list.length;

        data.listSize = Math.ceil(data.total / data.pageSize);

        createIndex();
    }
    else {
        throw 'data init err';
    }
    
}();

module.exports.get = get;
module.exports.list = list;