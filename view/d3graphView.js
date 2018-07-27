
require(['../plugins/require/require_config.js','../js/graphLayout'], function (config, graphLayout){
    var jsonInitUrl = "../json_data/huangshijinTest.json";
    graphLayout.updateGraphURL(jsonInitUrl);
    graphLayout.clickEvent();

});