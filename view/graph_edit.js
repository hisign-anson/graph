function obj2str(e) {
    return "object" == typeof e ? JSON.stringify(e) : e
}
function str2obj(str, b) {
    var obj;
    return obj = "string" == typeof str ? b ? eval("(" + str + ")") : JSON.parse(str) : str
}
function toast(msg, speed) {
    console.info(msg, speed)
}
window.d3drawPic = {
    type: '',//判断是从工作台还是管理平台还是大屏进来，工作台和大屏是1
    isHiderightClick: '',//判断右键隐藏 取消隐藏和隐藏反馈按钮，isHiderightClick=1则隐藏
    scope: '',
    groupMemberObj: {},
    taskFeedbackObj: {},
    width: 800,
    height: 500,
    svg: "",
    svgGroup: "",
    marker: "",
    forceLink: "",
    forceCharge: "",
    forceCenter: "",
    graphJson: "",
    simulation: "",//力模拟器
    //图片节点属性
    imgW: 20,
    imgH: 20,
    imgSrc: '../images/graph/',
    link: "",
    linkTxt: "",
    edgesText: "",
    node: "",
    nodeTxt: "",
    linksData: "",
    nodesData: "",
    //编辑标签
    drag_line: "",
    selected_node: null,
    selected_link: null,
    mousedown_link: null,
    mousedown_node: null,
    mouseup_node: null,

    zTreeObj: "",
    // zTree 的参数配置，深入使用请参考 API 文档（setting 配置详解）
    setting: {
        view: {
            nameIsHTML: true,
            showTitle: false //是否显示节点title信息提示 默认为true
        }
    },

    d3Init: function () {//可以连线，缩放和连线冲突，所以分开两个方法
        var _this = this;
        //清除画布
        d3.select("#forceDraw").html("");
        _this.width = $('#forceDraw').outerWidth();//动态获取容器宽度
        _this.height = $('#forceDraw').outerHeight();//动态获取容器宽度
        if (!_this.width) {
            _this.width = 800;
        }
        if (!_this.height) {
            _this.height = 500;
        }


        // 定义svg画板
        _this.svg = d3.select("#forceDraw")
            .append("svg")
            .attr("width", _this.width)
            .attr("height", _this.height);
        _this.svgGroup = _this.svg.append("g");
        $(window).resize(function () {
            _this.width = $('#forceDraw').outerWidth();//动态获取容器宽度
            _this.height = $('#forceDraw').outerHeight();//动态获取容器宽度
            _this.svg.attr("width", _this.width);
            _this.svg.attr("height", _this.height);
        });
        _this.resetMouseVars();

        var groupid = $("#mapSvgFrame").attr("groupid");
        if (groupid && groupid != null) {
            var jsonInitUrl = 'http://192.168.1.92:8038/api-graph/getGraph?startNodeValue=6bfa298ac8c04db982f23d01cf3fdc7d&startNodeType=group_id';
        } else {
            jsonInitUrl = "../json_data/group.json"
        }
        d3.json(jsonInitUrl, function (error, json) {
            if (error) throw error;
            // localStorage['graph'] = obj2str(json);//存到浏览器
            _this.graphJson = json;
            _this.nodesData = _this.graphJson.nodes;
            _this.linksData = _this.graphJson.edges;
            var key = $('#intoDrag').attr('data-key');//1：可拖动 2：可连线
            _this.d3Draw(key);
            _this.getNodes(groupid);//获取左边节点
        });

    },
    //鼠标mousedown 事件和 drag 拖拽事件冲突不能共用，所以分开两个方法
    d3Draw: function (key) {
        //key  1：可拖动 2：可连线
        var _this = this;
        //判断如果进行查询过滤，那么如果input框中有内容，则不执行下面绘制操作
        var inputSearchVal = $.trim($("#searchCondition").val());//管理台和工作台
        if (inputSearchVal && inputSearchVal != '') {
            return false;
        }
        var zoom = d3.zoom()
            .scaleExtent([0.5, 3])
            .on("zoom", function () {
                _this.svgGroup.attr("transform", d3.event.transform);
            });
        if (key == 1) {
            _this.svg.call(zoom);
        }
        else if (key == 2) {
            _this.svg.on("mousemove", function () {
                if (!_this.mousedown_node) return;

                // update drag line
                _this.drag_line
                    .attr("x1", _this.mousedown_node.x)
                    .attr("y1", _this.mousedown_node.y)
                    .attr("x2", d3.mouse(this)[0])
                    .attr("y2", d3.mouse(this)[1]);
                _this.drag_line.attr("class", "drag_line_hidden").style("marker-end", "");
                _this.svgGroup.selectAll('.links-line-add').attr("class", "drag_line_hidden").style("marker-end", "");

            })
                .on("mousedown", function () {
                    // && !_this.mousedown_link
                    if (!_this.mousedown_node) {
                        return;
                    }
                })
                .on("mouseup", function () {
                    if (_this.mousedown_node) {
                        // 隐藏线
                        // _this.drag_line.attr("class", "drag_line_hidden").style("marker-end", "");
                        // _this.svgGroup.selectAll('.links-line-add').attr("class", "drag_line_hidden").style("marker-end", "");
                        if (!_this.mouseup_node) {
                            // add node
                            var point = d3.mouse(this),
                                node = {x: point[0], y: point[1]},
                                n = _this.nodesData.push(node);

                            // select new node
                            _this.selected_node = node;
                            _this.selected_link = null;

                            // add link to mousedown node
                            _this.linksData.push({source: _this.mousedown_node, target: node});
                        }

                        _this.d3Draw(key);
                    }
                    // clear mouse event vars
                    _this.resetMouseVars();
                });
        }

        /*
         * d3.forceLink()：创建连接力
         * d3.forceLink().id()：连接数组
         * d3.forceLink().strength()：设置连接强度
         * d3.forceLink().distance()：设置连接距离
         * d3.forceLink().iterations()：设置迭代次数
         * */
        _this.forceLink = d3.forceLink().strength(0.3).distance(60);

        /*
         * d3.forceManyBody()：创建多体力
         * d3.forceManyBody().strength()：设置力强度
         * */
        _this.forceCharge = d3.forceManyBody().strength(-300);

        /*
         * d3.forceCenter()：创建一个力中心
         * */
        _this.forceCenter = d3.forceCenter(_this.width / 2, _this.height / 2);

        //绘制箭头
        _this.marker =
            _this.svgGroup.append("marker")
                .attr("id", "resolved")
                .attr("markerUnits", "userSpaceOnUse")
                .attr("viewBox", "0 -5 10 10")//坐标系的区域
                .attr("refY", 0)
                .attr("refX", 18)//箭头坐标
                .attr("markerWidth", 12)//标识的大小
                .attr("markerHeight", 12)
                .attr("orient", "auto")//绘制方向，可设定为：auto（自动确认方向）和 角度值
                .attr("stroke-width", 2)//箭头宽度
                .append("path")
                .attr("d", "M0,-5L10,0L0,5")//箭头的路径
                .attr('fill', '#1783BF');//箭头颜色


        /*
         * d3.forceDrawSimulation()：创建一个力模拟
         * d3.forceDrawSimulation().forceDraw(name[, forceDraw])：添加或移除力
         * 描述：指定力的名称，并返回该力模拟
         */
        _this.simulation = d3.forceSimulation()
            .alphaDecay(0.015) //设置α指数衰减率
            .force("link", _this.forceLink)
            .force("charge", _this.forceCharge)
            .force("center", _this.forceCenter);

        //清除之前的元素
        _this.svgGroup.selectAll("g").remove();


        // _this.svgGroup.append("g")
        //     .attr("class", "links-g")
        //     .style("marker-end", "url(#resolved)")
        //     .selectAll("line")
        //     .data(_this.linksData)
        //     .enter().append("line")
        //     .attr("class", "links-line")

        _this.drag_line = _this.svgGroup.append("line")
            .attr("class", "drag_line")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", 0)
            .attr("y2", 0);
        /*
         * simulation.nodes()：设置力模拟的节点
         * */
        _this.simulation
            .nodes(_this.nodesData)
            .on("tick", _this.ticked.bind(this));

        /*
         * d3.forceLink().links()：设置连接力数组
         * */
        _this.simulation.force("link")
            .links(_this.linksData);


        var isshow = $('#showAllGraph').hasClass('mark');//设置隐藏的则不显示
        if (isshow != true) {
            //线的部分，过滤要隐藏的
            var linksDataNew = [];
            var linksData = _this.linksData;
            //节点的部分，过滤要隐藏的
            //var nodesDataNew = [];
            var nodesData = _this.nodesData;

            for (var i = 0; i < linksData.length; i++) {
                if (linksData[i].hiddenState && linksData[i].hiddenState == "0") {//不隐藏的
                    linksDataNew.push(linksData[i]);
                } else if (linksData[i].hiddenState && linksData[i].hiddenState == "1") {//获取要隐藏的
                    if (linksData[i].target) {
                        for (var n = 0; n < nodesData.length; n++) {
                            if (linksData[i].target.index == nodesData[n].INDEX) {
                                _this.nodesData.splice(n, 1)
                            }
                        }
                    }
                } else {
                    linksDataNew.push(linksData[i]);
                }
            }
            _this.linksData = linksDataNew;
            _this.nodesData = nodesData;

        }

        //绘制连接力
        _this.link = _this.svgGroup.append("g")
            .attr("class", "links-g")
            .style("marker-end", "url(#resolved)")
            .selectAll("line")
            .data(_this.linksData)
            .enter().append("line")
            .attr("class", "links-line")
            .on("click", function (d, i) {//删除连线
                if (d.canDelete && d.canDelete == "1") {
                    $(this).remove();

                    // todo 调用后台接口 /feedback-task/delete
                } else {
                    toast("该连线不能删除！", 600);
                }
            })
            .on("mouseover", function (d, i) {
                _this.edgesText.text(function (edge) {
                    if (edge.source.id === d.source.id & edge.target.id === d.target.id) {
                        return "删除连线";
                    }
                });
                _this.linkTxt.text(function (edg) {
                    if (edg.source.id === d.source.id & edg.target.id === d.target.id) {
                        return "";
                    } else {
                        return edg.name;
                    }
                });
            })
            .on("mouseout", function (d, i) {
                //隐去连接线上的文字
                _this.edgesText.text(function (edge) {
                    if (edge.source.id === d.source.id & edge.target.id === d.target.id) {
                        return "";
                    }
                });
                _this.linkTxt.text(function (edg) {
                    return edg.name;
                });
            });
        _this.edgesText = _this.svgGroup.selectAll(".remove-line-text")
            .data(_this.linksData)
            .enter()
            .append("text")
            .attr("class", "remove-line-text");

        //连线上的字
        _this.linkTxt = _this.svgGroup.append("g")
            .attr("class", "link-text-g")
            .selectAll(".link-text-g")
            .data(_this.linksData)
            .enter().append("text")
            .attr("class", "link-text")
            .text(function (d) {
                return d.name;
            });

        //绘制节点
        _this.node = _this.svgGroup.append("g")
            .attr("class", "nodes-g")
            .selectAll("image")
            .data(_this.nodesData)
            .enter().append("image")
            .attr("class", "nodes-img")
            .attr("width", _this.imgW)
            .attr("height", _this.imgH)
            .attr('id', function (d) {
                return d.id
            })
            .attr("xlink:href", function (d) {
                var image;
                switch (d.type) {
                    case "groupid":
                        image = _this.imgSrc + "type_group.png";
                        break;
                    case "taskid":
                        image = _this.imgSrc + "type_task.png";
                        break;
                    case "fkid":
                        image = _this.imgSrc + "type_feedback.png";
                        break;
                    case "ajid":
                        image = _this.imgSrc + "type_case.png";
                        break;
                }
                return image;
            })
            //去掉默认的contextmenu事件，否则会和右键事件同时出现。
            .on("contextmenu", function () {
                //DOM事件对象——d3.event
                d3.event.preventDefault();
            })
            //双击节点
            .on('dblclick', function (d) {
                _this.nodesData.splice(_this.nodesData.indexOf(d), 1);
                _this.spliceLinksForNode(d);
                _this.d3Draw(key);
            });
        if (key == 1) {
            //节点拖拽
            _this.node.call(d3.drag()
                .on("start", _this.dragstarted)
                .on("drag", _this.dragged)
                .on("end", _this.dragended)
            );
        }
        else if (key == 2) {
            //节点之间画线
            _this.addLine(_this.node,key);
        }

        //绘制节点文字
        var node_dx = -20;
        var node_dy = 15;
        _this.nodeTxt = _this.svgGroup.append("g")
            .attr("class", "node-text-g")
            .selectAll(".node-text-g")
            .data(_this.nodesData)
            .enter().append("text")
            .attr("class", "node-text")
            .attr("dx", node_dx)
            .attr("dy", node_dy)
            .text(function (d) {
                var arr = [];
                arr = d.name.split("@");
                var name = arr[0];
                var time = arr[1];
                name = name ? name : "";
                time = time ? time : "";
                return name;
            });

    },
    dragged: function (d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    },
    dragstarted: function (d) {
        //设置alphaTarget让节点动起来
        if (!d3.event.active) window.d3drawPic.simulation.alphaTarget(0.4).restart();
        d.fx = d.x;
        d.fy = d.y;
    },
    dragended: function (d) {
        if (!d3.event.active) window.d3drawPic.simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    },
    resetMouseVars: function () {
        var _this = this;
        _this.mousedown_node = null;
        _this.mouseup_node = null;
        _this.mousedown_link = null;
    },
    spliceLinksForNode: function (node) {
        var toSplice = this.linksData.filter(
            function (l) {
                return (l.source === node) || (l.target === node);
            });
        toSplice.map(
            function (l) {
                this.linksData.splice(this.linksData.indexOf(l), 1);
            });
    },
    ticked: function () {
        var _this = this;
        //更新连接力的位置
        _this.link.attr("x1", function (d) {
            return d.source.x;
        }).attr("y1", function (d) {
            return d.source.y;
        }).attr("x2", function (d) {
            return d.target.x;
        }).attr("y2", function (d) {
            return d.target.y;
        });

        //更新连接力上文字的位置
        // _this.linkTxt.attr("x", function (d) {
        //     return (d.source.x + d.target.x) / 2 + 12;
        // }).attr("y", function (d) {
        //     return (d.source.y + d.target.y) / 2;
        // });
        //鼠标放上来线 点击删除
        // _this.edgesText.attr("x", function (d) {
        //     return (d.source.x + d.target.x) / 2 + 12;
        // }).attr("y", function (d) {
        //     return (d.source.y + d.target.y) / 2;
        // });

        // 限定节点边界位置后节点一直弹
        _this.node.attr("cx", function (d) {
            d.x = d.x - _this.imgW / 2 < 0 ? _this.imgW : d.x;
            d.x = d.x + _this.imgW / 2 > _this.width ? _this.width - _this.imgW / 2 : d.x;
            return d.x;
        }).attr("cy", function (d) {
            d.y = d.y - _this.imgH / 2 < 0 ? _this.imgH / 2 : d.y;
            d.y = d.y + _this.imgH > _this.height ? _this.height - _this.imgH : d.y;
            return d.y;
        });
        // 更新节点的位置
        _this.node.attr("x", function (d) {
            return d.x - _this.imgW / 2;
        }).attr("y", function (d) {
            return d.y - _this.imgH / 2
        });
        //更新节点文字的位置
        _this.nodeTxt.attr("x", function (d) {
            return d.x
        }).attr("y", function (d) {
            return d.y + _this.imgH / 2.5
        });
    },

    //设置右键菜单的位置
    setPosition: function (d, i) {
        var _this = this;
        var tooltipCurrent = $("#tooltip" + i);
        var parentOffsetTop = $("#forceDraw").offset().top;
        var parentOffsetLeft = $("#forceDraw").offset().left;
        tooltipCurrent.css({
            "position": "absolute",
            "top": (d.y + parentOffsetTop - _this.imgH / 2) + "px",
            "left": (d.x + parentOffsetLeft + _this.imgW + 5) + "px"
        }).show();

        //start 判断当前节点的位置
        var a = (d.x + 35) + tooltipCurrent.width();
        var b = (d.y - (_this.imgH / 2)) + tooltipCurrent.height();
        if (a > $(window).width()) {
            tooltipCurrent.css({
                "left": (d.x - tooltipCurrent.width() - 10) + "px"
            })
        }
        if (b > $(window).height()) {
            tooltipCurrent.css({
                "top": (d.y - tooltipCurrent.height()) + "px"
            });
        } else {
            var winST = $(window).scrollTop();
            if ((d.y - (_this.imgH / 2)) <= winST) {
                tooltipCurrent.css({
                    "top": (winST + 5) + "px"
                });
            }
        }
        //end 判断当前节点的位置
    },
    rightClick: function (d, i) {
        var _this = this;
        if ($("#tooltip" + i).length <= 0) {
            var tooltipDiv = "<div id='tooltip" + i + "' class='tooltip-box'><ul id='menuTree" + i + "' class='ztree deploy'></ul></div>";
            $("body").append(tooltipDiv);
        }

        //根据id和type显示不同的菜单
        //菜单数据
        var type = d.type;
        var menuDefault;
        switch (type) {
            case "groupid":
                menuDefault = [
                    {name: "<span class='groupmember' data-d='" + obj2str(d) + "' val='1'>专案组成员</span>"}
                ];
                break;
            case "taskid":
                _this.isHiderightClick == 1 ?//1表示首页成果展示或者大屏进来
                    menuDefault = [
                        {name: "<span class='taskdetail' data-d='" + obj2str(d) + "' val='1'>任务详情</span>"}
                    ] :
                    menuDefault = [
                        //{name: "<span class='intodel' data-d='"+obj2str(d)+"' val='1'>隐藏反馈</span>"},
                        {name: "<span class='nohideclue' data-d='" + obj2str(d) + "' val='1'>取消隐藏</span>"},
                        {name: "<span class='hideclue' data-d='" + obj2str(d) + "' val='1'>隐藏反馈线索</span>"},
                        {name: "<span class='taskdetail' data-d='" + obj2str(d) + "' val='1'>任务详情</span>"}
                    ];
                break;
            case "fkid":
                _this.isHiderightClick == 1 ?//1表示首页成果展示或者大屏进来
                    menuDefault = [
                        {name: "<span class='cluedetail' data-d='" + obj2str(d) + "' val='1'>详细信息</span>"}
                    ] :
                    menuDefault = [
                        {name: "<span class='nohide' data-d='" + obj2str(d) + "' val='1'>取消隐藏</span>"},
                        {name: "<span class='intodel' data-d='" + obj2str(d) + "' val='1'>隐藏反馈</span>"},
                        {name: "<span class='cluedetail' data-d='" + obj2str(d) + "' val='1'>详细信息</span>"}
                    ];
                break;
            case "ajid":
                menuDefault = [
                    {name: "<span class='casedetail' data-d='" + obj2str(d) + "' val='1'>案件详情</span>"}
                ];
                break;
        }
        var zNodes = menuDefault;
        _this.setting.callback = {
            //菜单节点被点击的事件回调函数
            onClick: function (event, treeId, treeNode, clickFlag) {
                //alert("[ onClick ]:" + treeNode.name);
                var sourceStr = treeNode.name.match(/\{[\S\s]+\}/)[0];
                var sourceF = str2obj(sourceStr);//当前节点信息
                var linksArr = [];
                var $target = $(event.currentTarget).find("#" + treeNode.tId).find("#" + treeNode.tId + "_span>span");
                var data = str2obj($target.attr("data-d"));
                var className = $target.attr("class");
                if (className == "hideclue") {//linksData 通过节点上的outedges连线获取真正连线上的id ，传给后台
                    _this.link._groups[0].forEach(function (item, i) {//删除连线
                        if (sourceF.id == item.__data__.source.id) {
                            item.remove();
                            linksArr.push(item);
                        }
                    });
                    if (linksArr && linksArr.length >= 0) {
                        linksArr.forEach(function (item, i) {//删除target节点
                            _this.node._groups[0].forEach(function (on, i) {
                                if (on.__data__.id == item.__data__.target.id) {
                                    on.remove();
                                }
                            });
                        });
                        linksArr.forEach(function (item, i) {//删除线上文字
                            _this.linkTxt._groups[0].forEach(function (on, i) {
                                if (on.__data__.source.id == item.__data__.source.id) {
                                    on.remove();
                                }
                            });
                        });
                        linksArr.forEach(function (item, i) {//删除target 文字
                            _this.nodeTxt._groups[0].forEach(function (on, i) {
                                if (on.__data__.id == item.__data__.target.id) {
                                    on.remove();
                                }
                            });
                        });
                    }

                    params = {
                        lineId: data.id,
                        type: 2,//任务
                        hiddenState: 1
                    }

                    _this.hideclue(params);//删除调用后台接口
                    tooltipCurrent.remove();
                } else if (className == "nohideclue") {
                    params = {
                        lineId: data.id,
                        type: 2,//任务
                        hiddenState: "0"
                    };

                    _this.hideclue(params);//删除调用后台接口
                    tooltipCurrent.remove();
                } else if (className == "intodel") {
                    //删除节点和上面的文字
                    _this.node._groups[0].forEach(function (on, i) {//删除节点
                        if (on.__data__.id == sourceF.id) {
                            on.remove();
                        }
                        _this.nodeTxt._groups[0].forEach(function (on, i) {//删除节点下的文字
                            if (on.__data__.id == sourceF.id) {
                                on.remove();
                            }
                        });
                    });
                    if (data.inEdges) {
                        var inEdges = data.inEdges;
                        var lineIds = [];
                        var params;
                        var linkData = _this.linksData;
                        for (var i = 0; i < inEdges.length; i++) {
                            var index = inEdges[i].index;
                            for (var j = 0; j < linkData.length; j++) {
                                if (index == linkData[j].index) {
                                    lineIds.push(linkData[j].lineId);
                                }
                            }
                        }
                        params = {
                            lineId: lineIds,
                            type: 3,//反馈
                            hiddenState: 1
                        };

                        _this.hideclue(params);//删除调用后台接口
                        tooltipCurrent.remove();
                    }

                } else if (className == "nohide") {
                    if (data.inEdges) {
                        var inEdges = data.inEdges;
                        var lineIds = [];
                        var params;
                        var linkData = _this.linksData;
                        for (var i = 0; i < inEdges.length; i++) {
                            var index = inEdges[i].index;
                            for (var j = 0; j < linkData.length; j++) {
                                if (index == linkData[j].index) {
                                    lineIds.push(linkData[j].lineId);
                                }
                            }
                        }
                        params = {
                            lineId: lineIds,
                            type: 3,//反馈
                            hiddenState: "0"
                        };

                        _this.hideclue(params);//删除调用后台接口
                        tooltipCurrent.remove();
                    }
                } else if (className == "groupmember") {
                    var groupId = data.id;
                    $open('#groupMembersPage', {
                        width: 800, height: 400, title: '成员列表', onOpen: function () {
                            $('#groupMembers-qb').find('textarea,input,select').xReset();
                        }
                    });
                    _this.groupMemberObj.searchActGroupMembers = ''//makeAct('getUserGroupPage', "user-group", 'crime');
                    _this.groupMemberObj.$qrgroupMembers = $('#query-result-groupMembers');
                    // _this.groupMembersTableRender(groupId);
                    tooltipCurrent.remove();
                } else if (className == "casedetail") {
                    var id = data.id;
                    if (_this.type == 1) {//1是从工作台进来
                        $open('#caseInfoView', {
                            width: 1000, height: 400, title: '查看案件', onOpen: function () {
                                $('#case-info').find('textarea,input,select').xReset();
                            }
                        });
                        //todo 调用后台接口 /case/getCaseById

                    } else {
                        $open(top.getViewPath('case_group_manage/caseInfo_view.html?id={0}'.format(id)), "查看案件");
                    }
                    tooltipCurrent.remove();
                } else if (className == "taskdetail") {
                    var taskId = data.id;
                    if (_this.type == 1) {//1是从工作台进来
                        $open('#taskDetailView', {
                            width: 800, height: 400, title: '任务详情', onOpen: function () {
                                $('#taskDetailView').find('textarea,input,select').xReset();
                                //todo 调用后台接口 ('taskDetail', 'task', 'crime');//任务详情
                            }
                        });
                    } else {
                        $open(top.getViewPath('investigation_manage/task_detail.html?id={0}&type=1'.format(taskId)), '任务详情');
                    }
                    tooltipCurrent.remove();
                } else if (className == "cluedetail") {
                    var id = data.id;
                    _this.taskFeedbackObj.taskFeedbackDetailAct = ''//makeAct('taskFeedbackDetail', 'task-feedback', 'crime');//线索详情
                    _this.taskFeedbackObj.$clueDetailPage = $('#clueDetailPage');
                    // _this.feedbackDetailFn(id);
                    tooltipCurrent.remove();
                }
            }
        };
        _this.zTreeObj = $.fn.zTree.init($("#menuTree" + i), _this.setting, zNodes);

        var tooltipCurrent = $("#tooltip" + i);
        var tooltipSiblings = tooltipCurrent.siblings(".tooltip-box");
        _this.setPosition(d, i)


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
    },
    //节点之间画线
    addLine:function (node,key) {
        var _this = this;
        node
            .on("mousemove", function (d, i) {
                _this.setPosition(d, i);
            })
            .on("mousedown", function (d, i) {
                var that = d3.event;
                //根据button判断鼠标点击类型 0（左键） 1（中键） 2（右键）
                if (that.button == 2) {
                    _this.rightClick(d, i);
                } else if (that.button == 0) {
                    _this.mousedown_node = d;
                    if (_this.mousedown_node == _this.selected_node) {
                        _this.selected_node = null;
                    } else {
                        _this.selected_node = _this.mousedown_node;
                    }
                    _this.selected_link = null;
                    // 重新定位画出的线条
                    var markerNew =
                        _this.svgGroup.append("marker")
                            .attr("id", "markerNew")
                            .attr("markerUnits", "userSpaceOnUse")
                            .attr("viewBox", "0 -5 10 10")//坐标系的区域
                            .attr("refY", 0)
                            .attr("refX", 18)//箭头坐标
                            .attr("markerWidth", 12)//标识的大小
                            .attr("markerHeight", 12)
                            .attr("orient", "auto")//绘制方向，可设定为：auto（自动确认方向）和 角度值
                            .attr("stroke-width", 2)//箭头宽度
                            .append("path")
                            .attr("d", "M0,-5L10,0L0,5")//箭头的路径
                            .attr('fill', '#1783BF');//箭头颜色

                    _this.drag_line
                        .attr("class", "links-line-add")
                        .attr("x1", _this.mousedown_node.x)
                        .attr("y1", _this.mousedown_node.y)
                        .attr("x2", _this.mousedown_node.x)
                        .attr("y2", _this.mousedown_node.y)
                        .style("marker-end", "url(#markerNew)");

                    // _this.d3Draw(key);
                }
            })
            .on("mouseup", function (d, i) {
                var that = d3.event;
                //根据button判断鼠标点击类型 0（左键） 1（中键） 2（右键）
                if (that.button == 2) {
                    return;
                } else if (that.button == 0) {
                    debugger
                    if (_this.mousedown_node) {
                        _this.mouseup_node = d;
                        if (_this.mouseup_node == _this.mousedown_node) {
                            _this.resetMouseVars();
                            return;
                        } else if (_this.mouseup_node.type == "taskid" && _this.mousedown_node.type == "fkid") {
                            toast("反馈不能指向任务！", 600);
                            return;
                        } else if (_this.mouseup_node.type == "groupid" && _this.mousedown_node.type == "taskid") {
                            toast("任务不能指向专案组！", 600);
                            return;
                        } else if (_this.mouseup_node.type == "groupid" && _this.mousedown_node.type == "ajid") {
                            toast("案件不能指向专案组！", 600);
                            return;
                        } else if (_this.mouseup_node.type == "fkid" && _this.mousedown_node.type == "ajid") {
                            toast("案件不能指向反馈！", 600);
                            return;
                        } else if (_this.mouseup_node.type == "taskid" && _this.mousedown_node.type == "ajid") {
                            toast("案件不能指向任务！", 600);
                            return;
                        } else if (_this.mouseup_node.type == "ajid" && _this.mousedown_node.type == "taskid") {
                            toast("任务不能指向案件！", 600);
                            return;
                        } else if (_this.mouseup_node.type == "groupid" && _this.mousedown_node.type == "fkid") {
                            toast("反馈不能指向专案组！", 600);
                            return;
                        } else if (_this.mouseup_node.type == "ajid" && _this.mousedown_node.type == "ajid") {
                            toast("案件不能指向案件！", 600);
                            return;
                        }
                        // 添加力数据
                        var linkMake = {
                            //                                relation: "新增线" + linksData.length,
                            source: _this.mousedown_node,
                            target: _this.mouseup_node
                        };
                        _this.link._groups[0].forEach(function (item, i) {//已经有连线不可再连
                            if (linkMake.source.id == item.__data__.source.id && linkMake.target.id == item.__data__.target.id) {
                                toast("不能重复连线", 600);
                                return;
                            }
                        });
                        _this.linksData.push(linkMake);
                        //todo svg中添加线

                        // todo 调后台接口 /feedback-task/add
                        // _this.d3Draw(key);

                    }
                }
            });
        node.classed("node_selected", function (d) {
            return d === _this.selected_node;
        });
    },
    addNode: function (newNode, key, x, y) {
        var nodeArray = [];
        nodeArray.push(newNode);
        this.addD3Node(nodeArray, key, x, y);
    },

    addD3Node: function (nodeArray, key, x, y) {
        var _this = this;
        // var lenNodes = nodeArray.length;
        // if (lenNodes > 0) {
        //     //数组合并
        //     for (var i = 0; i < lenNodes; i = i + 5000) {
        //         var nodeObj = nodeArray.slice(i, Math.max(i + 5000, lenNodes));
        //         this.nodesData.push.apply(this.graphJson.nodes, nodeObj);
        //     }
        // }
        // _this.d3Draw(key);

        //todo 把新加进来的节点放入svg中，不重画svg，直接插入svg
        var newNode = _this.svgGroup.selectAll(".nodes-g")
            .data(nodeArray)
            .insert("image")
            .attr("class", "nodes-img")
            .attr("width", _this.imgW)
            .attr("height", _this.imgH)
            .attr('id', function (d) {
                return d.id
            })
            .attr("xlink:href", function (d) {
                var image;
                switch (d.type) {
                    case "groupid":
                        image = _this.imgSrc + "type_group.png";
                        break;
                    case "taskid":
                        image = _this.imgSrc + "type_task.png";
                        break;
                    case "fkid":
                        image = _this.imgSrc + "type_feedback.png";
                        break;
                    case "ajid":
                        image = _this.imgSrc + "type_case.png";
                        break;
                }
                return image;
            })
            .attr("x", function (d) {
                return x
            })
            .attr("y", function (d) {
                return y
            });
        var newNodeText= this.svgGroup.selectAll(".node-text-g")
            .data(nodeArray)
            .insert("text")
            .attr("class", "node-text")
            .text(function (d) {
                var arr = [];
                arr = d.name.split("@");
                var name = arr[0];
                var time = arr[1];
                name = name ? name : "";
                time = time ? time : "";
                return name;
            })
            .attr("dx", function (d) {
                return -20
            })
            .attr("dy", function (d) {
                return 15
            })
            .attr("x", function (d) {
                return x
            })
            .attr("y", function (d) {
                return y + 20
            });
        //节点之间画线
        _this.addLine(newNode,key);
    },

    hideclue: function (params) {
        //todo 调用后台接口 /feedback-task/hidden

    },

    getNodes: function (groupid) {
        var _this = this;
        var groupid = groupid ? groupid : $("#mapSvgFrame").attr("groupid");
        var getNotUseTaskAndFeedbackListAct = 'http://192.168.1.92:8038/api-xz/feedback-task/getNotUseTaskAndFeedbackList';
        var params = {groupId: groupid};//"8334bf32461140cf9711544cd3fef8c4"

        var data = {
            "feedback": [
                {
                    "begin": 0,
                    "createGroupId": "6bfa298ac8c04db982f23d01cf3fdc7d",
                    "createGroupName": "0524专案组",
                    "createId": "6B99611542E9AB2DE050007F01003834",
                    "createName": "浦韩瑶",
                    "createOrgCode": "440000190000",
                    "createOrgName": "广东省公安厅刑侦局",
                    "createTime": "2018-07-13 15:58:20",
                    "deleteState": "0",
                    "desc": false,
                    "end": 0,
                    "feedbackContent": "kliol",
                    "feedbackState": "0",
                    "flagState": "1",
                    "groupId": "6bfa298ac8c04db982f23d01cf3fdc7d",
                    "groupName": "0524专案组",
                    "id": "4e8f305a944a4ace81e75f2f8dfeb70b",
                    "updateId": "6B99611542E9AB2DE050007F01003834",
                    "updateTime": "2018-07-18 09:13:19"
                },
                {
                    "begin": 0,
                    "createGroupId": "6bfa298ac8c04db982f23d01cf3fdc7d",
                    "createGroupName": "0524专案组",
                    "createId": "6B99611542E9AB2DE050007F01003834",
                    "createName": "浦韩瑶",
                    "createOrgCode": "440000190000",
                    "createOrgName": "广东省公安厅刑侦局",
                    "createTime": "2018-07-13 16:00:10",
                    "deleteState": "0",
                    "desc": false,
                    "end": 0,
                    "feedbackContent": "未读数",
                    "feedbackState": "0",
                    "flagState": "1",
                    "groupId": "6bfa298ac8c04db982f23d01cf3fdc7d",
                    "groupName": "0524专案组",
                    "id": "c457089a8c844467821790b595054be1",
                    "updateId": "6B99611542E9AB2DE050007F01003834",
                    "updateTime": "2018-07-18 09:13:17"
                }
            ],
            "task": [
                {
                    "begin": 0,
                    "createGroupId": "6bfa298ac8c04db982f23d01cf3fdc7d",
                    "createGroupName": "0524专案组",
                    "createId": "6AB8CF0ED8A3FCA2E050007F01002859",
                    "createName": "余乐",
                    "createOrgCode": "440000190000",
                    "createOrgName": "广东省公安厅刑侦局",
                    "createPhone": "46545135748",
                    "createRole": "1",
                    "createTime": "2018-07-13 14:50:41",
                    "deleteState": "0",
                    "desc": false,
                    "emergencyState": "3",
                    "end": 0,
                    "flagState": "1",
                    "groupId": "6bfa298ac8c04db982f23d01cf3fdc7d",
                    "groupName": "0524专案组",
                    "id": "b9b41ce2b7f6422dae1b2a19173d9fd7",
                    "receiveGroupId": "ef0072242ca94a8cbeca463b3363ff40",
                    "receiveGroupName": "0524专案组-特警小组",
                    "receiveState": "1",
                    "reminderState": "0",
                    "taskContent": "五河互为本基金",
                    "taskNo": "RW440000190000201800021",
                    "taskSerialNo": "009",
                    "taskState": "0",
                    "taskType": "1",
                    "updateId": "6B99611542E9AB2DE050007F01003834",
                    "updateTime": "2018-07-17 10:33:01"
                },
                {
                    "begin": 0,
                    "createGroupId": "6bfa298ac8c04db982f23d01cf3fdc7d",
                    "createGroupName": "0524专案组",
                    "createId": "6AB8CF0ED8A3FCA2E050007F01002859",
                    "createName": "余乐",
                    "createOrgCode": "440000190000",
                    "createOrgName": "广东省公安厅刑侦局",
                    "createPhone": "46545135748",
                    "createRole": "1",
                    "createTime": "2018-07-13 14:51:55",
                    "deleteState": "0",
                    "desc": false,
                    "emergencyState": "1",
                    "end": 0,
                    "flagState": "1",
                    "groupId": "6bfa298ac8c04db982f23d01cf3fdc7d",
                    "groupName": "0524专案组",
                    "id": "9e40a6f0cdf54d0d87fc6d2233de3dfa",
                    "lastFeedbackTime": "2018-07-13 15:42:52",
                    "receiveGroupId": "ef0072242ca94a8cbeca463b3363ff40,b8c548d538794d21983b8af00ad70c3d",
                    "receiveGroupName": "0524专案组-特警小组,0524专案组-立案单位小组",
                    "receiveState": "1",
                    "reminderState": "0",
                    "taskContent": "爱三点半",
                    "taskNo": "RW440000190000201800022",
                    "taskSerialNo": "010",
                    "taskState": "1",
                    "taskType": "1",
                    "updateId": "6B99611542E9AB2DE050007F01003834",
                    "updateTime": "2018-07-17 10:32:50"
                },
                {
                    "begin": 0,
                    "createGroupId": "6bfa298ac8c04db982f23d01cf3fdc7d",
                    "createGroupName": "0524专案组",
                    "createId": "6AB8CF0ED8A3FCA2E050007F01002859",
                    "createName": "余乐",
                    "createOrgCode": "440000190000",
                    "createOrgName": "广东省公安厅刑侦局",
                    "createPhone": "46545135748",
                    "createRole": "1",
                    "createTime": "2018-07-13 14:53:42",
                    "deleteState": "0",
                    "desc": false,
                    "emergencyState": "1",
                    "end": 0,
                    "flagState": "1",
                    "groupId": "6bfa298ac8c04db982f23d01cf3fdc7d",
                    "groupName": "0524专案组",
                    "id": "abf56d546b204777878c7606bb77d99b",
                    "receiveGroupId": "ef0072242ca94a8cbeca463b3363ff40",
                    "receiveGroupName": "0524专案组-特警小组",
                    "receiveState": "1",
                    "reminderState": "0",
                    "taskContent": "测试试试",
                    "taskNo": "RW440000190000201800023",
                    "taskSerialNo": "011",
                    "taskState": "0",
                    "taskType": "1",
                    "updateId": "6AB7C67C5F5F93A8E050007F0100285B",
                    "updateTime": "2018-07-13 16:10:03"
                }
            ]
        };
        var feedbacklist = data.feedback;
        var tasklist = data.task;
        var $getforce = $("#getforce");//左边容器
        if ((feedbacklist && feedbacklist.length > 0) || (tasklist && tasklist.length > 0)) {
            var html = "";
            if (feedbacklist) {
                for (var i = 0, len = feedbacklist.length; i < len; i++) {
                    if (feedbacklist[i].feedbackContent) {//去除空格，将空格替换为-
                        var feedbackContent = feedbacklist[i].feedbackContent;
                        feedbackContent = feedbackContent.replace(/\s/g, '-');
                        feedbacklist[i] = $.extend(feedbacklist[i], {
                            feedbackContent: feedbackContent
                        })
                    }
                    if (feedbacklist[i].createTime) {
                        var createTime = feedbacklist[i].createTime.substr(0, 10);
                        feedbacklist[i] = $.extend(feedbacklist[i], {
                            createTime: createTime ? createTime : ""
                        })
                    }
                    if (feedbacklist[i].updateTime) {
                        var updateTime = feedbacklist[i].updateTime.substr(0, 10);
                        feedbacklist[i] = $.extend(feedbacklist[i], {
                            updateTime: updateTime ? updateTime : ""
                        })
                    }
                    var top = 15 + (i * 35);
                    var left = 0;
                    html += '<img src="' + _this.imgSrc + "type_feedback.png" + '" id="drag' + i + '" info=' + $.trim(obj2str(feedbacklist[i])) + ' title="' + feedbacklist[i].feedbackContent + '" class="prepare-node feedback-node" style="top:' + top + 'px;left: ' + left + ';">'
                }
            }

            if (tasklist) {
                for (var i = 0, len = tasklist.length; i < len; i++) {
                    if (tasklist[i].createTime) {
                        var createTime = tasklist[i].createTime.substr(0, 10);
                        tasklist[i] = $.extend(tasklist[i], {
                            createTime: createTime ? createTime : ""
                        })
                    }
                    if (tasklist[i].updateTime) {
                        var updateTime = tasklist[i].updateTime.substr(0, 10);
                        tasklist[i] = $.extend(tasklist[i], {
                            updateTime: updateTime ? updateTime : ""
                        })
                    }
                    if (tasklist[i].lastFeedbackTime) {
                        var lastFeedbackTime = tasklist[i].lastFeedbackTime.substr(0, 10);
                        tasklist[i] = $.extend(tasklist[i], {
                            lastFeedbackTime: lastFeedbackTime ? lastFeedbackTime : ""
                        })
                    }
                    if (tasklist[i].lastReminderTime) {
                        var lastReminderTime = tasklist[i].lastReminderTime.substr(0, 10);
                        tasklist[i] = $.extend(tasklist[i], {
                            lastReminderTime: lastReminderTime ? lastReminderTime : ""
                        })
                    }
                    var n;
                    if (feedbacklist) {
                        n = feedbacklist.length + i;
                    } else {
                        n = +i;
                    }
                    var top = 15 + (i * 35);
                    var left = 35;
                    html += '<img src="' + _this.imgSrc + "type_task.png" + '" id="drag' + n + '" info=' + $.trim(obj2str(tasklist[i])) + ' title="' + tasklist[i].taskContent + '" class="prepare-node task-node" style="top:' + top + 'px;left:' + left + 'px">'
                }
            }
            $getforce.html(html);
        } else {
            $getforce.html("暂无数据！");
        }
    },
    regEvengetforce: function () {
        var _this = this;
        var startX = 0;
        var startY = 0;
        var firstX, firstY;//获取当前元素的绝对定位left 和top值
        var $getforce = $("#getforce");//左边容器
        var $forceDraw = $("#forceDraw");//右边容器
        var $bodyagentDrag = $("#bodyagentDrag");//拖拽参照的父元素需要获取其top 和 left
        $getforce
            .on("dragstart", ".prepare-node", function (e) {
                var key = $('#intoDrag').attr('data-key');
                if (key == 1) return;
                $(this).addClass('dragging');
                // startX = e.offsetX;
                // startY = e.offsetY;
                // firstX = this.style.left;
                // firstY = this.style.top;
            })
            .on("drag", ".prepare-node", function (e) {
                var key = $('#intoDrag').attr('data-key');
                if (key == 1) return;
                _this.dragPosition(e, key);
                // var x = e.pageX;
                // var y = e.pageY;
                // x -= startX;
                // y -= startY;
                // var bodyagentDragX = $bodyagentDrag.offset().left;
                // var bodyagentDragY = $bodyagentDrag.offset().top;
                // x -= bodyagentDragX;
                // y -= bodyagentDragY;
                // this.style.top = y + "px";
                // this.style.left = x + "px";
                // if (x === 0 && y === 0) {
                //     return;
                // }
            })
            .on("dragend", ".prepare-node", function (e) {
                $(this).removeClass('dragging');
                var key = $('#intoDrag').attr('data-key');
                if (key == 1) return;
                _this.dragPosition(e, key);

                // var x = e.pageX;
                // var y = e.pageY;
                // x -= startX;
                // y -= startY;
                // this.style.top = y + "px";
                // this.style.left = x + "px";
                // var info = str2obj($(this).attr("info"));
                // var $forceDrawLeft = $forceDraw.offset().left;//容器位置最左边
                // var $forceDrawTop = $forceDraw.offset().top;//容器位置最上边
                // var $forceDrawRight = $forceDraw.offset().top + $forceDraw.width();//容器位置最右边
                // var $forceDrawBottom = $forceDraw.offset().top + $forceDraw.height();//容器位置最下边
                //
                // if ((y >= $forceDrawTop && x >= $forceDrawLeft) && (y < $forceDrawBottom && x < $forceDrawRight)) {//脉络图范围内有效
                //     var taskType = info.taskType;
                //     var newNode;
                //     if (taskType) {//任务
                //         newNode = {
                //             id: info.id,
                //             image: "",
                //             name: info.taskContent + '@' + info.createTime,
                //             taskCreateTime: info.createTime,
                //             taskCreatorUserId: info.createId,
                //             taskStatus: info.taskState,
                //             type: "taskid"
                //         };
                //     } else {//反馈
                //         newNode = {
                //             id: info.id,
                //             image: "",
                //             name: info.feedbackContent + '@' + info.createTime,
                //             feedbackCreateTime: info.createTime,
                //             feedbackCreatorUserId: info.createId,
                //             feedbackState: info.feedbackState,
                //             type: "fkid"
                //         };
                //     }
                //     _this.addNode(newNode, key);
                //     $(this).remove();
                //     window.d3drawPic.d3Draw(key);
                // } else {//如果不在线索脉络图的范围内，则不能移动位置
                //     toast("不能移出脉络图范围！", 600);
                //     this.style.top = firstY;
                //     this.style.left = firstX;
                //     return;
                // }

            });
        $('#intoDrag').on('click', function () {//1是拖动2是连线
            var $this = $(this);
            var key = $this.attr('data-key');
            if (key == '1') {
                $this.attr('data-key', 2).text('连线');
            } else if (key == '2') {
                $this.attr('data-key', 1).text('拖动');
            }
            _this.d3Init();
        });
        $('#searchCondition').on("keypress", function (e) {//查询按钮事件
            if (e.keyCode == 13) {
                $('#toSearch').click();
            }
        });
        $("#toSearch").on("click", function () {//查询图标点击事件
            var groupId = $('#mapSvgFrame').attr("groupid") ? $('#mapSvgFrame').attr("groupid") : $("#searchCondition").attr("data-groupid");
            if (groupId) {
                var $this = $(this);
                var val = $.trim($("#searchCondition").val());
                var graphJson = localStorage["graph"];
                graphJson = str2obj(graphJson);
                if (val) {
                    $.each(graphJson.nodes, function (index, value) {
                        var taskname = value.name;
                        var type = value.type;
                        var id = value.id;
                        var isname = null;
                        var reg = new RegExp(val);
                        isname = taskname.match(reg);
                        if (
                            (taskname && isname != undefined)
                        ) {
                            //符合条件的节点数据
                            var a = _this.link._groups[0][index];
                            var b = _this.linkTxt._groups[0][index];
                            var c = _this.nodeTxt._groups[0][index];
                            var d = _this.node._groups[0][index];
                            var image;
                            switch (type) {
                                case "groupid":
                                    image = _this.imgSrc + "type_group_c.png";
                                    break;
                                case "taskid":
                                    image = _this.imgSrc + "type_task_c.png";
                                    break;
                                case "fkid":
                                    image = _this.imgSrc + "type_feedback_c.png";
                                    break;
                                case "ajid":
                                    image = _this.imgSrc + "type_case_c.png";
                                    break;
                            }
                            _this.node._groups[0].forEach(function (item, i) {
                                if (id == item.id) {
                                    item.setAttribute("href", image);
                                    item.setAttribute("class", "");
                                }
                            })

                        } else {

                        }
                    });
                } else {
                    _this.d3Draw($('#intoDrag').attr('data-key'));
                }

            } else {
                toast("请先选择专案组", 600);
            }

        });

    },
    //获取节点移入脉络图区域的位置
    dragPosition: function (e, key) {
        var _this = this;
        var $e = $(e.target);
        var eHeight = $e.outerHeight(true);
        var eWidth = $e.outerWidth(true);
        var forceDrawHeight = $('#forceDraw').outerHeight(true);
        var forceDrawWidth = $('#forceDraw').outerWidth(true);
        var getForceHeight = $('#getforce').outerHeight(true);
        var getForceWidth = $('#getforce').outerWidth(true);

        var forceDrawOffsetTop = $('#forceDraw').offset().top;
        var forceDrawOffsetLeft = $('#forceDraw').offset().left;
        var positionTop = e.clientY - forceDrawOffsetTop - eHeight / 2;
        var positionLeft = e.clientX - forceDrawOffsetLeft - eWidth / 2 //+ getForceWidth;
        var svgRight = forceDrawOffsetTop + forceDrawWidth;//容器位置最右边
        var svgBottom = forceDrawOffsetTop + forceDrawHeight;//容器位置最下边

        //拖完后判断是否出界
        if ($e.is('.dragging')) {
            return;
        } else {
            // if ((positionTop >= forceDrawOffsetTop && positionLeft >= forceDrawOffsetLeft) && (positionTop < svgBottom && positionLeft < svgRight)) {//脉络图范围内有效
            $e.css({'top': positionTop, 'left': positionLeft});
            var info = str2obj($e.attr("info"));
            var taskType = info.taskType;
            var newNode;
            if (taskType) {//任务
                newNode = {
                    id: info.id,
                    image: "",
                    name: info.taskContent + '@' + info.createTime,
                    taskCreateTime: info.createTime,
                    taskCreatorUserId: info.createId,
                    taskStatus: info.taskState,
                    type: "taskid"
                };
            } else {//反馈
                newNode = {
                    id: info.id,
                    image: "",
                    name: info.feedbackContent + '@' + info.createTime,
                    feedbackCreateTime: info.createTime,
                    feedbackCreatorUserId: info.createId,
                    feedbackState: info.feedbackState,
                    type: "fkid"
                };
            }
            $e.remove();
            _this.addNode(newNode, key, positionLeft, positionTop);
            //todo 左边节点位置重新计算
            // } else {
            //     toast("不能移出脉络图范围！", 600);
            //     return;
            // }

        }
    }
};