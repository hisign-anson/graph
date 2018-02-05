"use strict";
require.config({
    baseUrl: '../',
    paths: {
        "jQuery":"plugins/jQuery/jquery_1.12.4",
        "ztree":"plugins/ztree/ztree",
        "d3V3": "plugins/d3/d3.3.5.17",
        "d3V4": "plugins/d3/d3.v4"
    },
    shim:{
        'ztree':['jquery']
    }
});

