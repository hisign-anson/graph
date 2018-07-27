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
    forceCollide:"",
    graphJson: "",
    simulation: "",//力模拟器
    //图片节点属性
    imgW: 20,
    imgH: 20,
    imgSrc: '../images/graph/',
    link: "",
    linkTxt: "",
    node: "",
    nodeTxt: "",
    linksData: "",
    nodesData: "",
    //编辑标签
    drag_line: "",
    selected_node: null,
    selected_link: null,
    mousedown_node: null,
    mouseup_node: null,
    selected: {},
    highlighted: null,
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
            var jsonInitUrl = makeAct("getGraph", "/", "graph") + "?startNodeValue=" + groupid + "&startNodeType=" + "group_id";
            jsonInitUrl = jsonInitUrl.replace(new RegExp("///+", "gi"), "/");
        } else {
            jsonInitUrl = "../json_data/group.json"
            // jsonInitUrl = "../json_data/multi_force.json";//分散的几个图
        }
        d3.json(jsonInitUrl, function (error, json) {
            if (error) throw error;
            _this.graphJson = json;
            _this.nodesData = _this.graphJson.nodes;
            _this.linksData = _this.graphJson.edges;
            var key = $('#intoDrag').attr('data-key');//1：可拖动 2：可连线
            _this.d3Draw(key);
            _this.getNodes(groupid);//获取左边节点
        });

    },
    d3Draw: function (key) {
        //鼠标mousedown 事件和 drag 拖拽事件冲突不能共用，所以分开,用key区别【 1：可拖动 2：可连线】
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
            _this.svg
                .on("mousemove", function () {
                    if (!_this.mousedown_node) return;
                    // 更新连接线
                    _this.drag_line
                        .attr("x1", _this.mousedown_node.nodeFlag == 'new' ? _this.mousedown_node.x + _this.imgW / 2 : _this.mousedown_node.x)
                        .attr("y1", _this.mousedown_node.nodeFlag == 'new' ? _this.mousedown_node.y + _this.imgH / 2 : _this.mousedown_node.y)
                        .attr("x2", d3.mouse(this)[0])
                        .attr("y2", d3.mouse(this)[1]);
                })
                .on("mousedown", function () {
                    if (!_this.mousedown_node) {
                        return;
                    }
                })
                .on("mouseup", function () {
                    if (_this.mousedown_node) {
                        // 隐藏线
                        _this.svgGroup.selectAll('.links-line-add').attr("class", "drag_line_hidden").style("marker-end", "");
                        _this.drag_line.attr("class", "drag_line_hidden").style("marker-end", "");
                        if (_this.mouseup_node) {
                            var point = d3.mouse(this);
                            var node = {x: point[0], y: point[1]};

                            // select new node
                            _this.selected_node = node;
                            _this.selected_link = null;

                            // //此处可不必再次将节点数据和线数据push ，会造成数据重复
                            // // add node
                            // _this.nodesData.push(node);
                            // // add link to mousedown node
                            // _this.linksData.push({source: _this.mousedown_node, target: node});
                            ////此处不重画，从节点元素上抬起鼠标时重画
                            // _this.d3Draw(key);
                        }
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
        _this.forceLink = d3.forceLink().strength(0.3).distance(100);

        /*
         * d3.forceManyBody()：创建多体力
         * d3.forceManyBody().strength()：设置力强度
         * */
        _this.forceCharge = d3.forceManyBody().strength(-60);
        _this.forceCollide = d3.forceCollide().radius(20).strength(1);

        /*
         * d3.forceCenter()：创建一个力中心
         * */
        _this.forceCenter = d3.forceCenter(_this.width / 2, _this.height / 2);

        //绘制箭头
        _this.marker = _this.svgGroup.append("defs").append("marker")
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
            .force("collide", _this.forceCollide)
            .force("center", _this.forceCenter);

        //清除之前的元素
        _this.svgGroup.selectAll("g").remove();

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
                    _this.linksData.splice(i, 1);
                    $(this).remove();

                    //删除连线时还要删除连线上的可见文字
                    _this.linkTxt.text(function (edg) {
                        if (edg.source.id === d.source.id && edg.target.id === d.target.id) {
                            $(this).remove();// 也可以是return "";
                        } else {
                            return edg.name;
                        }
                    });

                    toast("删除成功！", 600);
                    // todo 调用后台接口 /feedback-task/delete
                } else {
                    toast("该连线不能删除！", 600);
                }
            })
            .on("mouseover", function (d, i) {
                //切换连接线上的文字
                _this.linkTxt.text(function (edg) {
                    if (edg.source.id === d.source.id && edg.target.id === d.target.id) {
                        if (d.canDelete && d.canDelete == "1") {
                            $(this).attr("class", "remove-line-text");
                            return "删除连线";
                        } else {
                            //不是隐藏状态时
                            if (!$(this).hasClass('opacity0')) {
                                $(this).removeAttr("class", "remove-line-text").attr("class", "link-text user-select-none");
                            }
                            return edg.name;
                        }
                    } else {
                        //不是隐藏状态时
                        if (!$(this).hasClass('opacity0')) {
                            $(this).removeAttr("class", "remove-line-text").attr("class", "link-text user-select-none");
                        }
                        return edg.name;
                    }
                });
            })
            .on("mouseout", function (d, i) {
                //还原连接线上的文字
                _this.linkTxt.text(function (edg) {
                    //不是隐藏状态时
                    if (!$(this).hasClass('opacity0')) {
                        $(this).removeAttr("class", "remove-line-text").attr("class", "link-text user-select-none");
                    }
                    return edg.name;
                });
            });

        //连线上的字
        _this.linkTxt = _this.svgGroup.append("g")
            .attr("class", "link-text-g")
            .selectAll(".link-text-g")
            .data(_this.linksData)
            .enter().append("text")
            .attr("class", "link-text")
            .classed("user-select-none", true)
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
                return _this.getImg(d.type);
            })
        ////鼠标滑过节点高亮相关节点和连线
        // .on('mouseover', function (d) {
        //     if (!_this.selected.obj) {
        //         if (_this.mouseoutTimeout) {
        //             clearTimeout(_this.mouseoutTimeout);
        //             _this.mouseoutTimeout = null;
        //         }
        //         _this.highlightObject(d);
        //     }
        // })
        // .on('mouseout', function () {
        //     if (!_this.selected.obj) {
        //         if (_this.mouseoutTimeout) {
        //             clearTimeout(_this.mouseoutTimeout);
        //             _this.mouseoutTimeout = null;
        //         }
        //         _this.mouseoutTimeout = setTimeout(function () {
        //             _this.highlightObject(null);
        //         }, 100);
        //     }
        // });

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
            _this.addLine(_this.node, key);
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
            .classed("user-select-none", true)
            .attr("dx", node_dx)
            .attr("dy", node_dy)
            .text(function (d) {
                if (d.name) {
                    var arr = [];
                    arr = d.name && d.name.split("@");
                    var name = arr[0];
                    var time = arr[1];
                    name = name ? name : "";
                    time = time ? time : "";
                    return name;
                } else {
                    return name;

                }
            });
    },
    //高亮
    highlightObject: function (obj) {
        var _this = this;
        if (obj) {
            if (obj !== _this.highlighted) {
                //todo 高亮节点未完成
                _this.node.classed('inactive', function (d, i) {
                    return (obj !== d
                    && (_this.getIndexArr(d.inEdges).indexOf(obj.index.toString()) == -1)
                    && (_this.getIndexArr(d.outEdges).indexOf(obj.index.toString()) == -1));
                });
                //todo 高亮节点文字未完成
                _this.nodeTxt.classed('inactive', function (d) {
                    return (obj !== d
                    && (_this.getIndexArr(d.inEdges).indexOf(obj.index.toString()) == -1)
                    && (_this.getIndexArr(d.outEdges).indexOf(obj.index.toString()) == -1));
                });
                _this.link.classed('inactive', function (d) {
                    return (obj !== d.source && obj !== d.target);
                });
                _this.linkTxt.classed('inactive', function (d) {
                    return (obj !== d.source && obj !== d.target);
                });
            }
            _this.highlighted = obj;
        } else {
            if (_this.highlighted) {
                _this.node.classed('inactive', false);
                _this.nodeTxt.classed('inactive', false);
                _this.link.classed('inactive', false);
                _this.linkTxt.classed('inactive', false);
            }
            _this.highlighted = null;
        }
    },
    getIndexArr: function (obj) {
        var _this = this;
        var resultArr = [];
        if (obj) {
            for (var i = 0; i < obj.length; i++) {
                resultArr.push(obj[i].index.toString())
            }
        }
        return resultArr;
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
    },
    spliceLinksForNode: function (node) {
        //删除节点相关全部线
        var _this = this;
        var toSplice = _this.linksData.filter(function (l) {
            return (l.source === node) || (l.target === node);
        });
        toSplice.map(function (l) {
            _this.linksData.splice(_this.linksData.indexOf(l), 1);
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

        // 更新连接力上文字的位置
        _this.linkTxt.attr("x", function (d) {
            return (d.source.x + d.target.x) / 2;
        }).attr("y", function (d) {
            return (d.source.y + d.target.y) / 2;
        });

        // 限定节点边界
        _this.node
            .attr("cx", function (d) {
                return d.x = Math.max(_this.imgW, Math.min(_this.width - _this.imgW, d.x));
            })
            .attr("cy", function (d) {
                return d.y = Math.max(_this.imgH, Math.min(_this.height - _this.imgH, d.y));
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
                var sourceStr = treeNode.name.match(/\{[\S\s]+\}/)[0];
                var sourceF = str2obj(sourceStr);//当前节点信息
                var linksArr = [];
                var $target = $(event.currentTarget).find("#" + treeNode.tId).find("#" + treeNode.tId + "_span>span");
                var data = str2obj($target.attr("data-d"));
                var className = $target.attr("class");
                //linksData 通过节点上的outedges连线获取真正连线上的id ，传给后台
                if (className == "hideclue") {
                    //删除连线
                    _this.link.each(function (d, i) {
                        if (sourceF.id == d.source.id && d.target.type == "fkid") {
                            $(this).addClass('opacity0');
                            _this.linksData.splice(i, 1);
                            linksArr.push(d);
                        }
                    });
                    //删除连线文字
                    _this.linkTxt.each(function (d, i) {
                        if (sourceF.id == d.source.id && d.target.type == "fkid") {
                            // $(this).remove();
                            $(this).addClass('opacity0');
                        }
                    });
                    if (linksArr && linksArr.length >= 0) {
                        linksArr.forEach(function (item, i) {
                            //删除target节点
                            _this.node.each(function (d, j) {
                                if (d.id == item.target.id && d.type == "fkid") {
                                    $(this).addClass('opacity0');
                                    _this.nodesData.splice(j, 1);
                                    //删除节点时，判断节点上是否有连线，有也一并删除
                                    _this.link.each(function (dLink, iLink) {
                                        if (dLink.source.id == d.id || dLink.target.id == d.id) {
                                            $(this).addClass('opacity0');
                                            // _this.linksData.splice(dLink, 1);//此处不需要删除线数据
                                        }
                                    });
                                    _this.linkTxt.each(function (dLink, iLink) {
                                        if (dLink.source.id == d.id || dLink.target.id == d.id) {
                                            $(this).addClass('opacity0');
                                        }
                                    });
                                }
                            });
                            //删除target文字
                            _this.nodeTxt.each(function (d, j) {
                                if (d.id == item.target.id && d.type == "fkid") {
                                    $(this).addClass('opacity0');
                                }
                            });
                        });
                    }
                    params = {
                        lineId: data.id,
                        type: 2,//任务
                        hiddenState: 1
                    };
                    _this.hideClue(params, className);//删除调用后台接口
                    tooltipCurrent.remove();
                }
                else if (className == "nohideclue") {
                    //显示连线
                    _this.link.each(function (d, i) {
                        if (sourceF.id == d.source.id && d.target.type == "fkid") {
                            if ($(this).hasClass('opacity0')) {
                                $(this).removeClass('opacity0');
                                _this.linksData.push(d);
                            }
                        }
                    });
                    //显示连线文字
                    _this.linkTxt.each(function (d, i) {
                        if (sourceF.id == d.source.id && d.target.type == "fkid") {
                            if ($(this).hasClass('opacity0')) {
                                $(this).removeClass('opacity0');
                            }
                        }
                    });
                    _this.linksData.forEach(function (item, i) {
                        //显示target节点
                        _this.node.each(function (d, j) {
                            if (item.source.id == d.id || item.target.id == d.id) {
                                if ($(this).hasClass('opacity0')) {
                                    $(this).removeClass('opacity0');
                                    _this.nodesData.push(d);
                                    //显示节点时，判断节点上是否有连线，有也一并显示
                                    _this.link.each(function (dLink, iLink) {
                                        if (dLink.source.id == d.id || dLink.target.id == d.id) {
                                            if ($(this).hasClass('opacity0')) {
                                                $(this).removeClass('opacity0');
                                                _this.linksData.push(dLink);
                                            }
                                        }
                                    });
                                    _this.linkTxt.each(function (dLink, iLink) {
                                        if (dLink.source.id == d.id || dLink.target.id == d.id) {
                                            if ($(this).hasClass('opacity0')) {
                                                $(this).removeClass('opacity0');
                                            }
                                        }
                                    });
                                }
                            }
                        });
                        //显示target文字
                        _this.nodeTxt.each(function (d, j) {
                            if (item.source.id == d.id || item.target.id == d.id) {
                                if ($(this).hasClass('opacity0')) {
                                    $(this).removeClass('opacity0');
                                }
                            }
                        });
                    });

                    params = {
                        lineId: data.id,
                        type: 2,//任务
                        hiddenState: "0"
                    };
                    _this.hideClue(params, className);//删除调用后台接口
                    tooltipCurrent.remove();
                }
                else if (className == "intodel") {
                    //删除target节点
                    var lineIds = [];
                    _this.node.each(function (d, j) {
                        if (d.id == sourceF.id) {
                            $(this).addClass('opacity0');
                            _this.nodesData.splice(j, 1);
                            //删除节点时，判断节点上是否有连线，有也一并删除
                            _this.link.each(function (dLink, iLink) {
                                if (dLink.source.id == d.id || dLink.target.id == d.id) {
                                    $(this).addClass('opacity0');
                                    _this.linksData.splice(iLink, 1);
                                    debugger
                                    lineIds.push(dLink.lineId);
                                }
                            });
                            _this.linkTxt.each(function (dLink, iLink) {
                                if (dLink.source.id == d.id || dLink.target.id == d.id) {
                                    $(this).addClass('opacity0');
                                }
                            });
                        }
                    });
                    //删除target文字
                    _this.nodeTxt.each(function (d, j) {
                        if (d.id == sourceF.id) {
                            $(this).addClass('opacity0');
                        }
                    });

                    // if (data.inEdges) {
                    //     var inEdges = data.inEdges;
                    //     var params;
                    //     var linkData = _this.linksData;
                    //     for (var i = 0; i < inEdges.length; i++) {
                    //         var index = inEdges[i].index;
                    //         for (var j = 0; j < linkData.length; j++) {
                    //             if (index == linkData[j].index) {
                    //                 lineIds.push(linkData[j].lineId);
                    //             }
                    //         }
                    //     }
                    //     debugger
                    //     params = {
                    //         lineId: lineIds,
                    //         type: 3,//反馈
                    //         hiddenState: 1
                    //     };
                    //     _this.hideClue(params, className);//删除调用后台接口
                    // }
                    tooltipCurrent.remove();
                }
                else if (className == "nohide") {
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

                        _this.hideClue(params, className);//删除调用后台接口
                        tooltipCurrent.remove();
                    }
                }
                else if (className == "groupmember") {
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
                }
                else if (className == "casedetail") {
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
                }
                else if (className == "taskdetail") {
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
                }
                else if (className == "cluedetail") {
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
    addLine: function (node, key) {
        var _this = this;
        node
        //去掉默认的contextmenu事件，否则会和右键事件同时出现。
            .on("contextmenu", function () {
                //DOM事件对象——d3.event
                d3.event.preventDefault();
            })
            // //双击节点删除与节点相连的所有连线
            // .on('dblclick', function (d) {
            //     _this.spliceLinksForNode(d);
            //     _this.d3Draw(key);
            // })
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

                    _this.drag_line
                    // 重新定位画出的箭头
                        .style("marker-end", "url(#resolved)")
                        .attr("class", "links-line-add")
                        .attr("x1", _this.mousedown_node.x)
                        .attr("y1", _this.mousedown_node.y)
                        .attr("x2", _this.mousedown_node.x)
                        .attr("y2", _this.mousedown_node.y)

                    // _this.d3Draw(key); //此处重画会导致箭头位置不准确
                }
            })
            .on("mouseup", function (d, i) {
                var that = d3.event;
                //根据button判断鼠标点击类型 0（左键） 1（中键） 2（右键）
                if (that.button == 2) {
                    return;
                } else if (that.button == 0) {
                    if (_this.mousedown_node) {
                        _this.mouseup_node = d;
                        var flag = _this.judgeCanLine(_this.mouseup_node, _this.mousedown_node);
                        if (flag) {
                            // 添加力数据
                            var linkMake = {
                                name: "",//"新增线" + _this.linksData.length,//默认新的连线文字
                                canDelete: 1,//默认新的连线可以删除
                                source: _this.mousedown_node,
                                target: _this.mouseup_node
                            };
                            var repeat = false;
                            $.each(_this.linksData, function (i, item) {
                                if (_this.mousedown_node.id == item.source.id && _this.mouseup_node.id == item.target.id) {
                                    toast("不能重复连线", 600);
                                    repeat = false;
                                    return false;
                                } else {
                                    repeat = true;
                                }
                            });
                            if (repeat) {
                                _this.linksData.push(linkMake);
                                if (_this.mousedown_node.nodeFlag) {
                                    _this.mousedown_node.nodeFlag = 'new_insert';
                                    _this.nodesData.push(_this.mousedown_node);
                                }
                                if (_this.mouseup_node.nodeFlag) {
                                    _this.mouseup_node.nodeFlag = 'new_insert';
                                    _this.nodesData.push(_this.mouseup_node);
                                }
                                _this.d3Draw(key);
                                // todo 调后台接口 /feedback-task/add

                            }
                        } else {
                            // 删除画出的箭头
                            _this.drag_line.style("marker-end", "");
                        }
                    }
                }
            })
            .on("mousemove", function (d, i) {
                _this.setPosition(d, i);
            });
        node.classed("node_selected", function (d) {
            return d === _this.selected_node;
        });
    },
    //判断是否可以连线
    judgeCanLine: function (mouseup_node, mousedown_node) {
        var _this = this;
        if (mouseup_node) {
            if (mouseup_node == mousedown_node) {
                _this.resetMouseVars();
                return false;
            } else if (mouseup_node.type == "taskid" && mousedown_node.type == "fkid") {
                toast("反馈不能指向任务！", 600);
                return false;
            } else if (mouseup_node.type == "groupid" && mousedown_node.type == "taskid") {
                toast("任务不能指向专案组！", 600);
                return false;
            } else if (mouseup_node.type == "groupid" && mousedown_node.type == "ajid") {
                toast("案件不能指向专案组！", 600);
                return false;
            } else if (mouseup_node.type == "fkid" && mousedown_node.type == "ajid") {
                toast("案件不能指向反馈！", 600);
                return false;
            } else if (mouseup_node.type == "taskid" && mousedown_node.type == "ajid") {
                toast("案件不能指向任务！", 600);
                return false;
            } else if (mouseup_node.type == "ajid" && mousedown_node.type == "taskid") {
                toast("任务不能指向案件！", 600);
                return false;
            } else if (mouseup_node.type == "groupid" && mousedown_node.type == "fkid") {
                toast("反馈不能指向专案组！", 600);
                return false;
            } else if (mouseup_node.type == "ajid" && mousedown_node.type == "ajid") {
                toast("案件不能指向案件！", 600);
                return false;
            } else if (mouseup_node.type == "ajid" && mousedown_node.type == "fkid") {
                toast("反馈不能指向案件！", 600);
                return false;
            } else {
                return true;
            }
        } else {
            return false;
        }
    },
    addNode: function (newNode, key, x, y) {
        var _this = this;
        var nodeArray = [];
        nodeArray.push(newNode);
        _this.addD3Node(nodeArray, key, x, y);
    },

    addD3Node: function (nodeArray, key, x, y) {
        var _this = this;
        // var lenNodes = nodeArray.length;
        // if (lenNodes > 0) {
        //     //数组合并
        //     for (var i = 0; i < lenNodes; i = i + 5000) {
        //         var nodeObj = nodeArray.slice(i, Math.max(i + 5000, lenNodes));
        //         _this.nodesData.push.apply(_this.graphJson.nodes, nodeObj);
        //     }
        // }
        // _this.d3Draw(key);

        // 把新加进来的节点放入svg中，不重画svg，直接插入svg
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
                return _this.getImg(d.type);
            })
            .attr("x", function (d) {
                //只能在移到空白处
                $.each(_this.nodesData, function (i, item) {
                    if (item.x > x && item.x < x + _this.imgW) {
                        x = x - _this.imgW + 15;
                    } else {
                        x = x;
                    }

                });
                return x
            })
            .attr("y", function (d) {
                //只能在移到空白处
                $.each(_this.nodesData, function (i, item) {
                    if (item.y > y && item.y < y + _this.imgH) {
                        y = y - _this.imgH + 15;
                    } else {
                        y = y;
                    }
                });
                return y
            });
        var newNodeText = this.svgGroup.selectAll(".node-text-g")
            .data(nodeArray)
            .insert("text")
            .attr("class", "node-text")
            .text(function (d) {
                var arr = [];
                arr = d.name && d.name.split("@");
                var name = arr[0];
                var time = arr[1];
                name = name ? name : "";
                time = time ? time : "";
                return name;
            })
            .attr("dx", function (d) {
                return 0
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

        //把拖过来的节点都放在图中
        debugger
        // _this.nodesData.push(nodeArray);
        // //节点之间画线
        _this.addLine(newNode, key);
    },

    hideClue: function (params) {
        var _this = this;
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
        var eHeight = 35, eWidth = 35;
        var getForceOffsetTop = $getforce.position().top;
        var getForceOffsetLeft = $getforce.position().left;
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
                    var top = getForceOffsetTop + (i * eHeight) + 5;
                    var left = getForceOffsetLeft + eWidth / 2;
                    html += '<img src="' + _this.imgSrc + "type_feedback.png" + '" id="drag' + i + '" info=' + $.trim(obj2str(feedbacklist[i])) + ' title="' + feedbacklist[i].feedbackContent + '" class="prepare-node feedback-node" style="top:' + top + 'px;left:' + left + 'px">'
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
                    var top = getForceOffsetTop + (i * eHeight) + 5;
                    var left = getForceOffsetLeft + eWidth * 2;
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
        var $getforce = $("#getforce");//左边容器
        $getforce
            .on("dragstart", ".prepare-node", function (e) {
                var key = $('#intoDrag').attr('data-key');
                if (key == 1) return;
                $(this).addClass('dragging');
            })
            .on("drag", ".prepare-node", function (e) {
                var key = $('#intoDrag').attr('data-key');
                if (key == 1) return;
                _this.dragPosition(e, key);
            })
            .on("dragend", ".prepare-node", function (e) {
                $(this).removeClass('dragging');
                var key = $('#intoDrag').attr('data-key');
                if (key == 1) return;
                _this.dragPosition(e, key);
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
            var $this = $(this);
            var groupId = $('#mapSvgFrame').attr("groupid") ? $('#mapSvgFrame').attr("groupid") : $("#searchCondition").attr("data-groupid");
            if (1 == 1) {
                var val = $.trim($("#searchCondition").val());
                if (val) {
                    //符合条件的节点数据
                    _this.node.classed('inactive', function (d, i) {
                        return (d.name.indexOf(val) == -1)
                    });
                    _this.nodeTxt.classed('inactive', function (d, i) {
                        return (d.name.indexOf(val) == -1)
                    });
                    _this.link.classed('inactive', true);
                    _this.linkTxt.classed('inactive', true);
                } else {
                    toast("请先输入关键字", 600);
                    _this.node.classed('inactive', false);
                    _this.nodeTxt.classed('inactive', false);
                    _this.link.classed('inactive', false);
                    _this.linkTxt.classed('inactive', false);
                }

            } else {
                toast("请先选择专案组", 600);
            }
        });
        //模拟socket事件触发
        $("#socketAdd").on("click", function () {
            var key = $('#intoDrag').attr('data-key');
            var socketData = {
                "nodes": [
                    {
                        "image": "ajid.jpg",
                        "name": "马思钰被电信诈骗案",
                        "id": "PCS4419201709270000000178408697",
                        "type": "ajid"
                    }
                ],
                "edges": [
                    {
                        "name": "关联案件",
                        "canDelete": "0",
                        "hiddenState": "0",
                        "lineId": "6bfa298ac8c04db982f23d01cf3fdc7d#PCS4419201709270000000178408697"// "lineId": "target#source"
                    }
                ]
            };
            var eventType = "mltAdd";
            _this.socketEvent(key,socketData, eventType);
        });
        $("#socketDel").on("click", function () {
            var key = $('#intoDrag').attr('data-key');
            var socketData = {
                "nodes": [
                    {
                        "image": "ajid.jpg",
                        "name": "骆辉旺等人扰乱公共秩序案",
                        "id": "8aaa01e35ea71e72015ec15bd8167132",
                        "type": "ajid"
                    }
                ],
                "edges": [
                    {
                        "name": "关联案件",
                        "canDelete": "0",
                        "hiddenState": "0",
                        "lineId": "6bfa298ac8c04db982f23d01cf3fdc7d#8aaa01e35ea71e72015ec15bd8167132"// "lineId": "target#source"
                    }
                ]
            };
            var eventType = "mltDelete";
            _this.socketEvent(key,socketData, eventType);
        })
    },
    getImg: function (type) {
        var _this = this;
        var image;
        switch (type) {
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
    },
    //去重
    unique: function (arr) {
        var _this = this;
        var res = [], obj = {};
        for (var i = 0; i < arr.length; i++) {
            if (!obj[arr[i]]) {
                obj[arr[i]] = 1;
                res.push(arr[i]);
            }
        }
        return res;
    },
    //获取节点移入脉络图区域的位置
    dragPosition: function (e, key) {
        var _this = this;
        var $e = $(e.target);
        var eHeight = $e.outerHeight(true);
        var eWidth = $e.outerWidth(true);
        var getForceHeight = $('#getforce').outerHeight(true);
        var getForceWidth = $('#getforce').outerWidth(true);
        var forceDrawHeight = $('#forceDraw svg').outerHeight(true);
        var forceDrawWidth = $('#forceDraw svg').outerWidth(true);

        var forceDrawOffsetTop = $('#forceDraw svg').offset().top;
        var forceDrawOffsetLeft = $('#forceDraw svg').offset().left;
        var positionTop = e.clientY - forceDrawOffsetTop - eHeight / 2;
        var positionLeft = e.clientX - forceDrawOffsetLeft - eWidth / 2;
        var svgRight = forceDrawOffsetLeft + forceDrawWidth;//容器位置最右边
        var svgBottom = forceDrawOffsetTop + forceDrawHeight;//容器位置最下边

        //拖完后判断是否出界
        if ($e.is('.dragging')) {
            return;
        } else {
            var boundTop = forceDrawOffsetTop + eHeight / 2;
            var boundLeft = forceDrawOffsetLeft + eWidth / 2;
            var boundRight = svgRight - eWidth / 2;
            var boundBottom = svgBottom - eHeight / 2;
            if (e.clientY > boundTop && e.clientX > boundLeft && e.clientY < boundBottom && e.clientX < boundRight) {//移动元素全部在脉络图范围内才有效
                // $e.css({'top': positionTop, 'left': positionLeft});
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
                        type: "taskid",
                        x: positionLeft,
                        y: positionTop,
                        nodeFlag: 'new'
                    };
                } else {//反馈
                    newNode = {
                        id: info.id,
                        image: "",
                        name: info.feedbackContent + '@' + info.createTime,
                        feedbackCreateTime: info.createTime,
                        feedbackCreatorUserId: info.createId,
                        feedbackState: info.feedbackState,
                        type: "fkid",
                        x: positionLeft,
                        y: positionTop,
                        nodeFlag: 'new'
                    };
                }
                $e.remove();
                _this.addNode(newNode, key, positionLeft, positionTop);
                //左边节点位置重新计算
                _this.setLeftForcePosition(e);
            } else {
                toast("只能移入脉络图范围！", 600);
                return;
            }

        }
    },
    //左边节点位置重新计算
    setLeftForcePosition: function (ele) {
        var _this = this;
        var scrollTop = $("#getforce").scrollTop();
        var setTop = function (i, e) {
            var top;
            if ($(e).position().top + scrollTop > i * ($(e).height() + 5) + 5) {
                top = $(e).position().top - $(e).height() - 5 + scrollTop
            } else {
                top = $(e).position().top + scrollTop
            }
            return top;
        };
        if ($(ele.target).hasClass("task-node")) {
            $('.task-node').each(function (i, item) {
                $(item).css('top', setTop(i, item));
            });
        } else if ($(ele.target).hasClass("feedback-node")) {
            $('.feedback-node').each(function (i, item) {
                $(item).css('top', setTop(i, item));
            });
        }
    },
    socketEvent: function (key,socketData, eventType) {
        var _this = this;
        if (eventType == "mltAdd") {
            //添加数据
            _this.nodesData.push(socketData.nodes[0]);
            _this.linksData.push(socketData.edges[0]);
            socketData.edges.forEach(function (item, i) {
                //线数据：INDEX source target
                item.INDEX = _this.linksData.length - 1;
                item.source = _this.nodesData.filter(function (l) {
                    return l.id === item.lineId.split("#")[0];
                })[0];
                item.target = _this.nodesData.filter(function (l) {
                    return l.id === item.lineId.split("#")[1];
                })[0];

                //节点数据：INDEX inEdges:[{index:0}] outEdges:[{index:1}]
                socketData.nodes[i].INDEX = _this.nodesData.length - 1;
                socketData.nodes[i].x = 50;
                socketData.nodes[i].y = 50;

                var inEdgesArr = [], outEdgesArr = [];
                _this.linksData.filter(function (l) {
                    return l.source.id === item.lineId.split("#")[0];
                }).map(function (l) {
                    inEdgesArr.push({
                        index: l.source.index
                    });
                });
                _this.linksData.filter(function (l) {
                    return l.target.id === item.lineId.split("#")[0];
                }).map(function (l) {
                    outEdgesArr.push({
                        index: l.target.index
                    });
                });
                socketData.nodes[i].inEdges = _this.unique(inEdgesArr);
                socketData.nodes[i].outEdges = _this.unique(outEdgesArr);
            });
            console.info(_this.nodesData);
            console.info(_this.linksData)
            _this.d3Draw(key);
        } else if (eventType == "mltDelete") {
            var lineId = socketData.edges[0].lineId.split("#");
            _this.node.classed('opacity0', function (d, i) {
                return (d.id == socketData.nodes[0].id)
            });
            _this.nodeTxt.classed('opacity0', function (d, i) {
                return (d.id == socketData.nodes[0].id)
            });
            _this.link.classed('opacity0', function (d, i) {
                return (d.source.id == lineId[0] && d.target.id == lineId[1]);
            });
            _this.linkTxt.classed('opacity0', function (d, i) {
                return (d.source.id == lineId[0] && d.target.id == lineId[1]);
            });

            //删除数据
            _this.nodesData.forEach(function (item, i) {
                if (item.id == socketData.nodes[0].id) {
                    _this.nodesData.splice(i, 1)
                }
            });
            _this.linksData.forEach(function (item, i) {
                if (item.source.id == lineId[0] && item.target.id == lineId[1]) {
                    _this.linksData.splice(i, 1)
                }
            });
        }
    }
};

