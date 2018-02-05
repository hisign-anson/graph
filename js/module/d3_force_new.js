define(['jQuery', 'd3V4'], function (jQuery, d3) {
    var width = 960, height = 500;
    var svg, marker,forceLink,forceCharge,forceCenter,graphJson;
    var simulation;//力模拟器
    //图片节点属性
    var imgW = 48, imgH = 48, imgSrc = '../images/graph/';
    var link, linkTxt, node, nodeTxt;
    var linksData, nodesData;
    //编辑标签
    var drag_line;
    var selected_node = null, selected_link = null, mousedown_link = null, mousedown_node = null, mouseup_node = null;

    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

    function resetMouseVars() {
        mousedown_node = null;
        mouseup_node = null;
        mousedown_link = null;
    }

    function spliceLinksForNode(node) {
        var toSplice = linksData.filter(
            function (l) {
                return (l.source === node) || (l.target === node);
            });
        toSplice.map(
            function (l) {
                linksData.splice(linksData.indexOf(l), 1);
            });
    }

    function ticked() {
        //更新连接力的位置
        link.attr("x1", function (d) {
            return d.source.x;
        }).attr("y1", function (d) {
            return d.source.y;
        }).attr("x2", function (d) {
            return d.target.x;
        }).attr("y2", function (d) {
            return d.target.y;
        });

        //更新连接力上文字的位置
        linkTxt.attr("x", function (d) {
            return (d.source.x + d.target.x) / 2;
        }).attr("y", function (d) {
            return (d.source.y + d.target.y) / 2;
        });

        // 限定节点边界位置后节点一直弹
        node.attr("cx", function (d) {
            d.x = d.x - imgW / 2 < 0 ? imgW : d.x;
            d.x = d.x + imgW / 2 > width ? width - imgW / 2 : d.x;
            return d.x;
        }).attr("cy", function (d) {
            d.y = d.y - imgH / 2 < 0 ? imgH / 2 : d.y;
            d.y = d.y + imgH > height ? height - imgH : d.y;
            return d.y;
        });
        // 更新节点的位置
        node.attr("x", function (d) {
            return d.x - imgW / 2;
        }).attr("y", function (d) {
            return d.y - imgH / 2
        });
        //更新节点文字的位置
        nodeTxt.attr("x", function (d) {
            return d.x
        }).attr("y", function (d) {
            return d.y + imgH / 2.5
        });
    }

    // function mousedown() {
    //     if (!mousedown_node && !mousedown_link) {
    //         return;
    //     }
    // }
    //
    // function mousemove() {
    //     if (!mousedown_node) return;
    //
    //     // update drag line
    //     drag_line
    //         .attr("x1", mousedown_node.x)
    //         .attr("y1", mousedown_node.y)
    //         .attr("x2", d3.mouse(this)[0])
    //         .attr("y2", d3.mouse(this)[1]);
    //
    // }
    //
    // function mouseup() {
    //     if (mousedown_node) {
    //         // hide drag line
    //         drag_line.attr("class", "drag_line_hidden");
    //
    //         if (!mouseup_node) {
    //             // add node
    //             var point = d3.mouse(this),
    //                 node = {x: point[0], y: point[1]},
    //                 n = nodesData.push(node);
    //
    //             // select new node
    //             selected_node = node;
    //             // selected_link = null;
    //
    //             // add link to mousedown node
    //             linksData.push({
    //                 relation: "新增线" + linksData.length, source: mousedown_node, target: node
    //             });
    //         }
    //
    //         _selfNew.d3Draw();
    //     }
    //     // clear mouse event vars
    //     resetMouseVars();
    // }

    return {
        d3Init: function () {
            _selfNew = this;

            // 定义svg画板
            svg = d3.select("#force")
                .append("svg")
                .attr("width", width)
                .attr("height", height)
            // .call(d3.zoom().on("zoom", function () {
            //     //鼠标操作
            //     svg.attr("transform", d3.event.transform)
            // }))
            // .on("mousemove", mousemove)
            // .on("mousedown", mousedown)
            // .on("mouseup", mouseup);

            /*
             * d3.forceLink()：创建连接力
             * d3.forceLink().id()：连接数组
             * d3.forceLink().strength()：设置连接强度
             * d3.forceLink().distance()：设置连接距离
             * d3.forceLink().iterations()：设置迭代次数
             * */
            forceLink = d3.forceLink().strength(0.6).distance(200);

            /*
             * d3.forceManyBody()：创建多体力
             * d3.forceManyBody().strength()：设置力强度
             * */
            forceCharge = d3.forceManyBody().strength(-400);

            /*
             * d3.forceCenter()：创建一个力中心
             * */
            forceCenter = d3.forceCenter(width / 2, height / 2);

            //绘制箭头
            marker =
                svg.append("marker")
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


            drag_line = svg.append("g")
                .attr("class", "drag-line-g")
                .selectAll(".drag-line-g")
                .enter().append("line")
                .attr("class", "drag_line")
                .attr("x1", 0)
                .attr("y1", 0)
                .attr("x2", 0)
                .attr("y2", 0);

            // d3.select(window).on("keydown", function () {
            //     if (!selected_node && !selected_link) return;
            //     switch (d3.event.keyCode) {
            //         case 8: // backspace
            //         case 46: { // delete
            //             if (selected_node) {
            //                 nodesData.splice(nodesData.indexOf(selected_node), 1);
            //                 spliceLinksForNode(selected_node);
            //             }
            //             else if (selected_link) {
            //                 linksData.splice(linksData.indexOf(selected_link), 1);
            //             }
            //             selected_link = null;
            //             selected_node = null;
            //             _selfNew.d3Draw();
            //             break;
            //         }
            //     }
            // });

            d3.json("../json_data/Test2.json", function (error, json) {
                if (error) throw error;
                graphJson = json;
                nodesData = graphJson.nodes;
                linksData = graphJson.edges;
                _selfNew.d3Draw();
            });

            //新增节点
            $('#addNode').on('click', function () {
                _selfNew.addNode();
            });
        },
        d3Draw: function () {
            _selfNew = this;

            /*
             * d3.forceSimulation()：创建一个力模拟
             * d3.forceSimulation().force(name[, force])：添加或移除力
             * 描述：指定力的名称，并返回该力模拟
             */
            simulation = d3.forceSimulation()
                .force("link", forceLink)
                .force("charge", forceCharge)
                .force("center", forceCenter);

            //清除之前的元素
            // svg.selectAll(".links-g").exit().remove();
            // svg.selectAll(".link-text-g").exit().remove();
            // svg.selectAll(".nodes-img-g").exit().remove();
            // svg.selectAll(".node-text-g").exit().remove();
            // svg.selectAll("line").exit().remove();
            // svg.selectAll("text").exit().remove();
            // svg.selectAll("image").exit().remove();
            svg.selectAll("g").remove();

            /*
             * simulation.nodes()：设置力模拟的节点
             * */
            simulation
                .nodes(nodesData)
                .on("tick", ticked);

            /*
             * d3.forceLink().links()：设置连接力数组
             * */
            simulation.force("link")
                .links(linksData);


            //绘制连接力
            link = svg.append("g")
                .attr("class", "links-g")
                .style("marker-end", "url(#resolved)")
                .selectAll("line")
                .data(linksData)
                .enter().append("line")
                .attr("class", "links-line");

            //连线上的字
            linkTxt = svg.append("g")
                .attr("class", "link-text-g")
                .selectAll(".link-text-g")
                .data(linksData)
                .enter().append("text")
                .attr("class", "link-text")
                .text(function (d) {
                    return d.relation;
                });

            //绘制节点
            node = svg.append("g")
                .attr("class", "nodes-g")
                .selectAll("image")
                .data(nodesData)
                .enter().append("image")
                .attr("class", "nodes-img")
                .attr("width", imgW)
                .attr("height", imgH)
                //节点之间画线
                .on("mousedown", function (d) {
                    mousedown_node = d;
                    if (mousedown_node == selected_node) {
                        selected_node = null;
                    } else {
                        selected_node = mousedown_node;
                    }
                    // selected_link = null;
                    // 重新定位画出的线条
                    drag_line
                        .attr("class", "links-line-add")
                        .attr("x1", mousedown_node.x)
                        .attr("y1", mousedown_node.y)
                        .attr("x2", mousedown_node.x)
                        .attr("y2", mousedown_node.y);
                    _selfNew.d3Draw();
                })
                .on("mousedrag", function (d) {

                })
                .on("mouseup", function (d) {
                    if (mousedown_node) {
                        mouseup_node = d;
                        if (mouseup_node == mousedown_node) {
                            resetMouseVars();
                            return;
                        }

                        // 添加力数据
                        var link = {
                            relation: "新增线" + linksData.length,
                            source: mousedown_node,
                            target: mouseup_node
                        };
                        linksData.push(link);
                        console.info(linksData);
                        // select new link
                        // selected_link = link;
                        selected_node = null;
                        _selfNew.d3Draw();
                    }
                })
                //双点击节点
                .on('dblclick', function (d) {
                    nodesData.splice(nodesData.indexOf(d), 1);
                    spliceLinksForNode(d);
                    _selfNew.d3Draw();
                    // $(d3.event.target).attr("href","")
                })
                // //节点拖拽
                // .call(d3.drag()
                //     .on("start", dragstarted)
                //     .on("drag", dragged)
                //     .on("end", dragended))
                .attr("xlink:href", function (d) {
                    var image;
                    switch (d.type) {
                        case "groupid":
                            image = imgSrc + "type_group.png";
                            break;
                        case "taskid":
                            image = imgSrc + "type_task.png";
                            break;
                        case "fkid":
                            image = imgSrc + "type_feedback.png";
                            break;
                        case "ajid":
                            image = imgSrc + "type_case.png";
                            break;
                    }
                    return image;
                });
            node.classed("node_selected", function (d) {
                return d === selected_node;
            });

            //绘制节点文字
            var node_dx = -20;
            var node_dy = 20;
            var nodesName = [];
            for (var i = 0; i < nodesData.length; i++) {
                var str = {
                    taskName: nodesData[i].name.split("@")[0] || '',
                    taskTime: nodesData[i].name.split("@")[1] || ''
                };
                nodesName.push(str);
            }
            nodeTxt = svg.append("g")
                .attr("class", "node-text-g")
                .selectAll(".node-text-g")
                .data(nodesData)
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
            // nodeTxt.selectAll("tspan")
            //     .data(nodesName)
            //     .enter().append("tspan")
            //     .attr("dx",node_dx)
            //     .attr("dy",node_dy)
            //     .text(function(d){
            //         console.info(d)
            //         return d.taskName;
            //     });
        },
        addNode: function () {
            _selfNew = this;
            var newNode1 = {
                id: "taskid6",
                image: "taskid.jpg",
                name: "新增任务@2018-01-16",
                taskCreateTime: "FQ_TIME",
                taskCreatorUserId: "FQR",
                taskStatus: "0",
                type: "taskid"
            };
            var newNode2 = {
                id: "taskid6",
                image: "taskid.jpg",
                name: "新增任务111@2018-01-16",
                taskCreateTime: "FQ_TIME",
                taskCreatorUserId: "FQR",
                taskStatus: "0",
                type: "taskid"
            };
            var nodeArray = [];
            nodeArray.push(newNode1);
            nodeArray.push(newNode2);
            _selfNew.addD3Node(nodeArray);
        },
        addD3Node: function (nodeArray) {
            _selfNew = this;
            var lenNodes = nodeArray.length;
            if (lenNodes > 0) {
                //数组合并
                for (var i = 0; i < lenNodes; i = i + 5000) {
                    var nodeObj = nodeArray.slice(i, Math.max(i + 5000, lenNodes));
                    nodesData.push.apply(graphJson.nodes, nodeObj);
                }

                // for (var i = 0; i < lenNodes; i = i ++) {
                //     nodesData.push(nodeArray[i]);
                //     graphJson.nodes.concat(nodesData)
                // }
            }
            _selfNew.d3Draw();
        }
    }
});