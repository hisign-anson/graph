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

function removeNode(index) {
    if (!node_imgSVG[0][index]){
        return;
    }
    node_imgSVG[0][index].remove();
    var node = node_imgSVG[0];
    node_textSVG[0][index].remove();

    var edgesArray = node[index].attributes["edges"];
    if (!edgesArray) {
        return;
    }
    var edgesStr = edgesArray.value;
    var edges = edgesStr.split(",");
    // console.log(edges);
    for (var i = 0; i < edges.length; i++) {
        var edgeIndex = edges[i];
        if (edgeIndex != "") {
            edges_lineSVG[0][edgeIndex].remove();
            edges_textSVG[0][edgeIndex].remove();
        }
    }
}

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

define(['graphLayout'], function () {
    function graphAction(layout) {
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

    return {
        graphAction: graphAction
    }
});