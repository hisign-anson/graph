var width = 1200,
    height = 900;
var img_w = 50,
    img_h = 60;
var jsonContext, edges_line, edges_text, node_img, node_text;
var jsonInitUrl = "huangshijinTest.json";
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

function addNode(nodeArrays, linkArrays) {
    var lenNodes = nodeArrays.length;
    var lenLinks = linkArrays.length;
    if (lenNodes > 0) {
        for (var i = 0; i < lenNodes; i = i + 5000) {
            jsonContext.nodes.push.apply(jsonContext.nodes, nodeArrays.slice(i, Math.max(i + 5000, lenNodes)));
        }
    }
    if (lenLinks > 0) {
        for (var i = 0; i < lenLinks; i = i + 5000) {
            jsonContext.edges.push.apply(jsonContext.edges, linkArrays.slice(i, Math.max(i + 5000, lenNodes)));
        }
    }
    updateGraphJSON(jsonContext);
}

updateGraphURL(jsonInitUrl);
//根据链接更新
function updateGraphURL(jsonUrl) {
    d3.json(jsonUrl, function (error, json) {
        if (error) {
            return console.log(error);
        }
        updateGraphJSON(json);
    });
}

//根据json更新
function updateGraphJSON(json) {
    jsonContext = json;
    layout
        .nodes(json.nodes)
        .links(json.edges)
        .start();

    svg.selectAll("line").remove();
    var edges_lineSVG = svg.selectAll("line")
        .data(json.edges);
    svg.selectAll(".linetext").remove();
    var edges_textSVG = svg.selectAll(".linetext")
        .data(json.edges);
    svg.selectAll("image").remove();
    var node_imgSVG = svg.selectAll("image")
        .data(json.nodes);
    svg.selectAll(".nodetext").remove();
    var node_textSVG = svg.selectAll(".nodetext")
        .data(json.nodes);
    //绘制连接线
    edges_line = edges_lineSVG
        .enter()
        .append("line")
        .style("stroke", "#ccc")
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
        .attr("xlink:href", function (d) {
            return d.image;
        })
        //去掉默认的contextmenu事件，否则会和右键事件同时出现。
        .on("contextmenu", function () {
            //DOM事件对象——d3.event
            d3.event.preventDefault();
        })
        //右键节点显示菜单
        .on("mousedown", function (d, i) {
            var that = d3.event;
            //根据button判断鼠标点击类型 0（左键） 1（中键） 2（右键）
            if (that.button == 2) {
                if ($("#tooltip" + i).length <= 0) {
                    var tooltipDiv = "<div id='tooltip" + i + "' class='tooltip-box'><ul id='menuTree" + i + "' class='ztree deploy'></ul></div>";
                    $("body").append(tooltipDiv);
                }
                console.info(d);
                console.info(i);
                //根据id和type显示不同的菜单
                var zNodes;
                if (d.id) {
                    // 加载不同的树形菜单数据
                    // var zNodes = "zNodes" + i;
                    // zNodes = eval('(' + zNodes + ')');
                    zNodes = menuById[i].menuData;
                } else {
                    if (d.type) {
                        switch (d.type) {
                            case "1":
                                zNodes = menuByType[1].menuData;
                                break;
                            case "2":
                                zNodes = menuByType[2].menuData;
                                break;
                            case "3":
                                zNodes = menuByType[3].menuData;
                                break;
                            default:
                                zNodes = menuDefault;
                        }
                    } else {
                        //加载同一个树形菜单数据
                        zNodes = menuDefault;
                    }
                }
                zTreeObj = $.fn.zTree.init($("#menuTree" + i), setting, zNodes);

                var tooltipCurrent = $("#tooltip" + i);
                var tooltipSiblings = tooltipCurrent.siblings(".tooltip-box");
                tooltipCurrent.css({
                    "position": "absolute",
                    "top": (d.y - (img_h / 2)) + "px",
                    "left": (d.x + 35) + "px"
                }).show();
                //start 判断当前节点的位置
                var a = (d.x + 35) + tooltipCurrent.width();
                var b = (d.y - (img_h / 2)) + tooltipCurrent.height();
                if (a > $(window).width()) {
                    tooltipCurrent.css({
                        "left": (d.x - tooltipCurrent.width() - 30) + "px"
                    })
                }
                if (b > $(window).height()) {
                    tooltipCurrent.css({
                        "top": (d.y - tooltipCurrent.height()) + "px"
                    });
                } else {
                    var winST = $(window).scrollTop();
                    if ((d.y - (img_h / 2)) <= winST) {
                        tooltipCurrent.css({
                            "top": (winST + 5) + "px"
                        });
                        console.info("top");
                    }
                }
                //end 判断当前节点的位置
                //如果还有兄弟元素tooltip显示，则remove兄弟元素
                if (tooltipSiblings.length > 0) {
                    tooltipSiblings.remove();
                }
                $(document).click(function (e) {
                    var target = e.target;
                    var isShowTooltip = $(target).parents(".tooltip-box").is(":visible");
                    //当点击的区域是菜单之外时
                    if (!isShowTooltip) {
                        tooltipCurrent.remove();
                    }
                });
            }
        })
        .on("dblclick", function (d, i) {
            d.fixed = false;
        })
        .on("mousemove", function (d, i) {
            var tooltipCurrent = $("#tooltip" + i);
            tooltipCurrent.css({
                "top": (d.y - (img_h / 2)) + "px",
                "left": (d.x + 35) + "px"
            });
            //start 判断当前节点的位置
            var a = (d.x + 35) + tooltipCurrent.width();
            var b = (d.y - (img_h / 2)) + tooltipCurrent.height();
            if (a > $(window).width()) {
                tooltipCurrent.css({
                    "left": (d.x - tooltipCurrent.width() - 30) + "px"
                })
            }
            if (b > $(window).height()) {
                tooltipCurrent.css({
                    "top": (d.y - tooltipCurrent.height()) + "px"
                });
            } else {
                var winST = $(window).scrollTop();
                if ((d.y - (img_h / 2)) <= winST) {
                    tooltipCurrent.css({
                        "top": (winST + 5) + "px"
                    });
                    console.info("top");
                }
            }
            //end 判断当前节点的位置
        })
        .call(layout.drag);
    node_imgSVG.exit().remove();

    var node_dx = -20,
        node_dy = 20;
    //节点上的字
    node_text = node_textSVG
        .enter()
        .append("text")
        .attr("class", "nodetext")
        .attr("dx", node_dx)
        .attr("dy", node_dy)
        .text(function (d) {
            return d.name
        });
    node_textSVG.exit().remove();

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
}

var tick = function () {
    //限制结点的边界
    jsonContext.nodes.forEach(function (d, i) {
        d.x = d.x - img_w / 2 < 0 ? img_w : d.x;
        d.x = d.x + img_w / 2 > width ? width - img_w / 2 : d.x;
        d.y = d.y - img_h / 2 < 0 ? img_h / 2 : d.y;
        d.y = d.y + img_h > height ? height - img_h : d.y;
    });
    //刷新连接线的位置
    edges_line.attr("x1", function (d) {
        return d.source.x;
    })
        .attr("y1", function (d) {
            return d.source.y;
        })
        .attr("x2", function (d) {
            return d.target.x;
        })
        .attr("y2", function (d) {
            return d.target.y;
        });
    //刷新连接线上的文字位置
    edges_text.attr("x", function (d) {
        return (d.source.x + d.target.x) / 2;
    })
        .attr("y", function (d) {
            return (d.source.y + d.target.y) / 2;
        });
    //刷新结点图片位置
    node_img.attr("x", function (d) {
        return d.x - img_w / 2;
    })
        .attr("y", function (d) {
            return d.y - img_h / 2
        });
    //刷新结点文字位置
    node_text.attr("x", function (d) {
        return d.x
    })
        .attr("y", function (d) {
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

//定义svg画板
var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

//箭头
var marker =
    svg.append("marker")
    //.attr("id", function(d) { return d; })
        .attr("id", "resolved")
        //.attr("markerUnits","strokeWidth")//设置为strokeWidth箭头会随着线的粗细发生变化
        .attr("markerUnits", "userSpaceOnUse")
        .attr("viewBox", "0 -5 10 10")//坐标系的区域
        .attr("refX", 32)//箭头坐标
        .attr("refY", -1)
        .attr("markerWidth", 12)//标识的大小
        .attr("markerHeight", 12)
        .attr("orient", "auto")//绘制方向，可设定为：auto（自动确认方向）和 角度值
        .attr("stroke-width", 2)//箭头宽度
        .append("path")
        .attr("d", "M0,-5L10,0L0,5")//箭头的路径
        .attr('fill', '#000000');//箭头颜色