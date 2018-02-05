// require(['../plugins/require/require_config.js', '../js/module/d3_force_edit.js', '../js/module/d3_force_new.js'], function (config, d3_force_edit, d3_force_new) {
//     setTimeout(function () {
//         d3_force_new.d3Init();
//         // d3_force_edit.d3EditMy();
//         // d3_force_edit.d3Edit();
//
//     },300);
// });
setTimeout(function () {
    require(['../plugins/require/require_config.js', '../js/module/d3_force_edit.js', '../js/module/d3_force_new.js'], function (config, d3_force_edit, d3_force_new) {
            d3_force_new.d3Init();
            // d3_force_edit.d3EditMy();
            // d3_force_edit.d3Edit();
    });
},300);