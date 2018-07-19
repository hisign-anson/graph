var width = 1200,
    height = 700;

var img_w = 48,
    img_h = 48;
var jsonContext, edges_line, edges_text, node_img, node_text;

var edges_lineSVG;
var edges_textSVG;
var node_imgSVG;
var node_textSVG;


var zTreeObj;
// zTree 的参数配置，深入使用请参考 API 文档（setting 配置详解）
var setting = {
    callback: {
        //单击菜单节点之前的事件回调函数
        beforeClick: function (treeId, treeNode, clickFlag) {
            console.info("[ beforeClick ]:" + treeNode.name);
            return (treeNode.click != false);
        },
        //菜单节点被点击的事件回调函数
        onClick: function (event, treeId, treeNode, clickFlag) {
            alert("[ onClick ]:" + treeNode.name);
            return (treeNode.click != false);
        }
    }
};
//菜单数据
var menuDefault = [
    {
        name: "默认菜单1",
        open: true,
        children: [
            {name: "默认菜单1的子节点1"},
            {name: "默认菜单1的子节点2"}
        ]
    },
    {
        name: "默认菜单2",
        open: true,
        children: [
            {name: "默认菜单2的子节点1"},
            {name: "默认菜单2的子节点2"}
        ]
    },
    {
        name: "没有子节点的默认菜单3"
    }
];
var menuById = [
    {
        "menuName": "zNodes0",
        "type": "1",
        "menuData": [
            {
                name: "001菜单1",
                open: true,
                children: [
                    {name: "001菜单1的子节点1"},
                    {name: "001菜单1的子节点2"}
                ]
            },
            {
                name: "001菜单2",
                open: true,
                children: [
                    {name: "001菜单2的子节点1"},
                    {name: "001菜单2的子节点2"}
                ]
            },
            {
                name: "001没有子节点的菜单2"
            }
        ]
    },
    {
        "menuName": "zNodes1",
        "type": "1",
        "menuData": [
            {
                name: "002菜单1",
                open: true,
                children: [
                    {name: "002菜单1的子节点1"},
                    {name: "002菜单1的子节点2"}
                ]
            }
        ]
    },
    {
        "menuName": "zNodes2",
        "type": "1",
        "menuData": [
            {
                name: "003没有子节点的菜单1"
            }
        ]
    },
    {
        "menuName": "zNodes3",
        "type": "1",
        "menuData": [
            {
                name: "004菜单1",
                open: true,
                children: [
                    {name: "004菜单1的子节点1"},
                    {name: "004菜单1的子节点2"}
                ]
            },
            {
                name: "004菜单2",
                open: true,
                children: [
                    {name: "004菜单2的子节点1"}
                ]
            },
            {
                name: "004没有子节点的菜单2"
            }
        ]
    },
    {
        "menuName": "zNodes4",
        "type": "1",
        "menuData": [
            {
                name: "005菜单1",
                open: true,
                children: [
                    {name: "005菜单1的子节点1"}
                ]
            },
            {
                name: "005菜单2",
                open: true,
                children: [
                    {name: "005菜单2的子节点1"},
                    {name: "005菜单2的子节点2"}
                ]
            },
            {
                name: "005没有子节点的菜单2"
            }
        ]
    },
    {
        "menuName": "zNodes5",
        "type": "1",
        "menuData": [
            {
                name: "006菜单1",
                open: true,
                children: [
                    {
                        name: "006菜单1的子节点1",
                        open: true,
                        children: [
                            {name: "006菜单1的子节点1的子节点1"},
                            {name: "006菜单1的子节点1的子节点2"}
                        ]
                    },
                    {name: "006菜单1的子节点2"}
                ]
            }
        ]
    },
    {
        "menuName": "zNodes6",
        "type": "1",
        "menuData": [
            {
                name: "007菜单1",
                open: true,
                children: [
                    {name: "007菜单1的子节点1"},
                    {name: "007菜单1的子节点2"}
                ]
            }
        ]
    },
    {
        "menuName": "zNodes7",
        "type": "1",
        "menuData": [
            {
                name: "008菜单1",
                open: true,
                children: [
                    {name: "008菜单1的子节点1"}
                ]
            }
        ]
    },
    {
        "menuName": "zNodes8",
        "type": "1",
        "menuData": [
            {
                name: "009菜单1",
                open: true,
                children: [
                    {name: "009菜单1的子节点1"},
                    {name: "009菜单1的子节点2"}
                ]
            },
            {
                name: "009菜单2",
                open: true,
                children: [
                    {name: "009菜单2的子节点1"},
                    {name: "009菜单2的子节点2"}
                ]
            }
        ]
    },
    {
        "menuName": "zNodes9",
        "type": "1",
        "menuData": [
            {
                name: "010菜单1",
                open: true,
                children: [
                    {name: "010菜单1的子节点1"},
                    {name: "010菜单1的子节点2"}
                ]
            },
            {
                name: "010菜单2",
                open: true,
                children: [
                    {name: "010菜单2的子节点1"}
                ]
            }
        ]
    },
    {
        "menuName": "zNodes10",
        "type": "1",
        "menuData": [
            {
                name: "011菜单1",
                open: true,
                children: [
                    {name: "011菜单1的子节点1"},
                    {name: "011菜单1的子节点2"}
                ]
            },
            {
                name: "011菜单2",
                open: true,
                children: [
                    {name: "011菜单2的子节点1"},
                    {name: "011菜单2的子节点2"}
                ]
            },
            {
                name: "011没有子节点的菜单2"
            }
        ]
    },
    {
        "menuName": "zNodes11",
        "type": "1",
        "menuData": [
            {
                name: "012没有子节点的菜单1"
            }
        ]
    },
    {
        "menuName": "zNodes12",
        "type": "1",
        "menuData": [
            {
                name: "013没有子节点的菜单1"
            }
        ]
    },
    {
        "menuName": "zNodes13",
        "type": "1",
        "menuData": [
            {
                name: "014菜单1",
                open: true,
                children: [
                    {name: "014菜单1的子节点1"},
                    {name: "014菜单1的子节点2"}
                ]
            }
        ]
    },
    {
        "menuName": "zNodes14",
        "type": "1",
        "menuData": [
            {
                name: "015菜单1",
                open: true,
                children: [
                    {name: "015菜单1的子节点1"}
                ]
            },
            {
                name: "015菜单2",
                open: true,
                children: [
                    {name: "015菜单2的子节点1"},
                    {name: "015菜单2的子节点2"}
                ]
            }
        ]
    }
];
var menuByType = [
    {
        "menuName": "zNodes1",
        "type": "1",
        "menuData": [
            {
                name: "type1菜单1",
                open: true,
                children: [
                    {name: "type1菜单1的子节点1"},
                    {name: "type1菜单1的子节点2"}
                ]
            },
            {
                name: "type1菜单2",
                open: true,
                children: [
                    {name: "type1菜单2的子节点1"},
                    {name: "type1菜单2的子节点2"}
                ]
            },
            {
                name: "type1没有子节点的菜单2"
            }
        ]
    },
    {
        "menuName": "zNodes2",
        "type": "2",
        "menuData": [
            {
                name: "type2菜单1",
                open: true,
                children: [
                    {name: "type2菜单1的子节点1"},
                    {name: "type2菜单1的子节点2"}
                ]
            }
        ]
    },
    {
        "menuName": "zNodes3",
        "type": "3",
        "menuData": [
            {
                name: "type3没有子节点的菜单1"
            }
        ]
    }
];
define(['d3V3'], function (_) {
    return {
        updateGraphURL: function (jsonUrl) {
            _self = this;
            //定义svg画板
            var svg = d3.select("body").append("svg")
                .attr("width", width)
                .attr("height", height);

            //箭头
            var marker = svg.append("marker")
                .attr("id", "resolved")
                .attr("markerUnits", "userSpaceOnUse")
                .attr("viewBox", "0 -5 10 10")//坐标系的区域
                .attr("refX", 30)//箭头坐标
                .attr("refY", 0)
                .attr("markerWidth", 12)//标识的大小
                .attr("markerHeight", 12)
                .attr("orient", "auto")//绘制方向，可设定为：auto（自动确认方向）和 角度值
                .attr("stroke-width", 2)//箭头宽度
                .append("path")
                .attr("d", "M0,-5L10,0L0,5")//箭头的路径
                .attr('fill', '#808080');//箭头颜色

            var tick = function () {
                //限制结点的边界
                jsonContext.nodes.forEach(function (d, i) {
                    d.x = d.x - img_w / 2 < 0 ? img_w : d.x;
                    d.x = d.x - img_w / 2 < 0 ? img_w : d.x;
                    d.x = d.x + img_w / 2 > width ? width - img_w / 2 : d.x;
                    d.y = d.y - img_h / 2 < 0 ? img_h / 2 : d.y;
                    d.y = d.y + img_h > height ? height - img_h : d.y;
                });
                //刷新连接线的位置
                edges_line.attr("x1", function (d) {
                    return d.source.x;
                }).attr("y1", function (d) {
                    return d.source.y;
                }).attr("x2", function (d) {
                    return d.target.x;
                }).attr("y2", function (d) {
                    return d.target.y;
                });
                //刷新连接线上的文字位置
                edges_text.attr("x", function (d) {
                    return (d.source.x + d.target.x) / 2;
                }).attr("y", function (d) {
                    return (d.source.y + d.target.y) / 2;
                });
                //刷新结点图片位置
                node_img.attr("x", function (d) {
                    return d.x - img_w / 2;
                }).attr("y", function (d) {
                    return d.y - img_h / 2
                });
                //刷新结点文字位置
                node_text.attr("x", function (d) {
                    return d.x
                }).attr("y", function (d) {
                    return d.y + img_h / 2.5
                });
            };

            //定义力学图的布局
            var layout = d3.layout.force()
                .on("tick", tick)
                .size([width, height])
                .linkDistance(200)
                .linkStrength(1)
                .friction(0.6)
                .charge(-2000)
                .gravity(0.08);

            d3.json(jsonUrl, function (error, json) {
                if (error) {
                    return console.log(error);
                }
                _self.updateGraphJSON(layout,svg,json);

                _self.graphAction(layout);
            });
        },
        updateGraphJSON: function (layout,svg,json) {
            _self = this;
            jsonContext = json;
            layout.nodes(json.nodes).links(json.edges).start();

            svg.selectAll("line").remove();
            edges_lineSVG = svg.selectAll("line").data(json.edges);
            svg.selectAll(".linetext").remove();
            edges_textSVG = svg.selectAll(".linetext").data(json.edges);
            svg.selectAll("image").remove();
            node_imgSVG = svg.selectAll("image").data(json.nodes);
            svg.selectAll(".nodetext").remove();
            node_textSVG = svg.selectAll(".nodetext").data(json.nodes);

            //绘制连接线
            edges_line = edges_lineSVG
                .enter()
                .append("line")
                .style("stroke", "#808080")//颜色
                .style("stroke_width", 1)
                .style("marker-end", "url(#resolved)");
            edges_lineSVG.exit().remove();

            //连线上的字
            edges_text = edges_textSVG
                .enter()
                .append("text")
                .attr("class", "linetext")
                .text(function (d) {
                    return d.relation;
                });
            edges_textSVG.exit().remove();

            //绘制结点
            node_img = node_imgSVG
                .enter()
                .append("image")
                .attr("width", img_w)
                .attr("height", img_h)
                // .call(layout.drag);
            node_imgSVG.exit().remove();

            var node_dx = 0;//-20,
            var node_dy = 20;
            //节点上的字
            node_text = node_textSVG
                .enter()
                .append("text")
                .attr("class", "nodetext")
                .attr("dx", node_dx)
                .attr("dy", node_dy);
            node_textSVG.exit().remove();
        },
        graphAction: function (layout) {
            _self = this;
            //拖拽开始后设定被拖拽对象为固定
            var drag = layout.drag()
                .on("dragstart", function (d) {
                    //释放其他节点
                    // jsonContext.nodes.forEach(function (d, i) {
                    //     d.fixed = false;
                    // });
                    //本节点固定
                    d.fixed = true;
                });

            node_imgSVG
                .attr("edges", function (d) {
                    var nodeInEdges = d.inEdges;
                    var nodeOutEdges = d.outEdges;
                    var nodeEdges;
                    if (!nodeInEdges && nodeOutEdges) {
                        nodeEdges = nodeOutEdges;
                    } else if (!nodeOutEdges && nodeInEdges) {
                        nodeEdges = nodeInEdges;
                    } else if (nodeInEdges && nodeOutEdges) {
                        nodeEdges = nodeInEdges.concat(nodeOutEdges);
                    } else {
                        return;
                    }
                    var result = "";
                    for (var i = 0; i < nodeEdges.length; i++) {
                        result += nodeEdges[i].index + ",";
                    }
                    return result;
                })
                .attr("xlink:href", function (d) {
                    var image;
                    switch (d.type) {
                        case "groupid":
                            image = "images/graph/type_group.png";
                            break;
                        case "taskid":
                            image = "images/graph/type_task.png";
                            break;
                        case "fkid":
                            image = "images/graph/type_feedback.png";
                            break;
                        case "ajid":
                            image = "images/graph/type_case.png";
                            break;
                    }
                    return image;
                })
                //去掉默认的contextmenu事件，否则会和右键事件同时出现。
                .on("contextmenu", function () {
                    //DOM事件对象——d3.event
                    d3.event.preventDefault();
                }).on("mousedown", function (d) {
                // debugger

                // disable zoom
//                vis.call(d3.behavior.zoom().on("zoom"), null);

                // mousedown_node = d;
                // if (mousedown_node == selected_node){
                //     selected_node = null;
                // } else{
                //     selected_node = mousedown_node;
                // }
                // selected_link = null;

                // reposition drag line
                edges_lineSVG
                    .attr("class", "link")
                    .attr("x1", d.x)
                    .attr("y1", d.y)
                    .attr("x2", d.x)
                    .attr("y2", d.y);

                // redraw();
            }).on("mouseup", function (d) {
                if (mousedown_node) {
//                     mouseup_node = d;
//                     if (mouseup_node == mousedown_node) {
//                         resetMouseVars();
//                         return;
//                     }
//
//                     // add link
//                     var link = {source: mousedown_node, target: mouseup_node};
//                     links.push(link);
//
//                     // select new link
//                     selected_link = link;
//                     selected_node = null;
//
//                     // enable zoom
// //                    vis.call(d3.behavior.zoom().on("zoom"), rescale);
//                     redraw();
                }
            });

            node_textSVG.text(function (d) {
                // console.info(d.name);
                var arr = [];
                arr = d.name.split("@");
                var name = arr[0];
                var time = arr[1];
                name = name ? name : "";
                time = time ? time : "";

                // return d.name.substring(0,9) + "...";
                return name;
            });
        }
    };
});