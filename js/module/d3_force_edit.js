define(['jQuery', 'd3V4'], function (jQuery, d3) {
    var width = 960;
    var height = 500;

    var img_w = 48,
        img_h = 48;
    var jsonContext, edges_line, edges_text, node_img, node_text;

    var edges_lineSVG;
    var edges_textSVG;
    var node_imgSVG;
    var node_textSVG;

    return {
        d3Edit: function () {
            _self = this;
            var d3Canvas = d3.select("#d3Canvas").append('canvas').attr('width',width).attr('height',height);
            var canvas = $("canvas").get(0);
            var context = canvas.getContext("2d");

            var simulation = d3.forceSimulation()
                .force("link", d3.forceLink().id(function (d) {
                    return d.id;
                }))
                .force("charge", d3.forceManyBody())
                .force("center", d3.forceCenter(width / 2, height / 2));

            d3.json("../json_data/miserables.json", function (error, graph) {
                if (error) throw error;

                simulation
                    .nodes(graph.nodes)
                    .on("tick", ticked);

                simulation.force("link")
                    .links(graph.links);

                console.info(canvas)
                d3.select(canvas)
                    .call(d3.drag()
                        .container(canvas)
                        .subject(dragsubject)
                        .on("start", dragstarted)
                        .on("drag", dragged)
                        .on("end", dragended));

                function ticked() {
                    context.clearRect(0, 0, width, height);

                    context.beginPath();
                    graph.links.forEach(drawLink);
                    context.strokeStyle = "#aaa";
                    context.stroke();

                    context.beginPath();
                    graph.nodes.forEach(drawNode);
                    context.fill();
                    context.strokeStyle = "#fff";
                    context.stroke();
                }

                function dragsubject() {
                    return simulation.find(d3.event.x, d3.event.y);
                }
            });
            function dragstarted() {
                if (!d3.event.active) simulation.alphaTarget(0.3).restart();
                d3.event.subject.fx = d3.event.subject.x;
                d3.event.subject.fy = d3.event.subject.y;
            }

            function dragged() {
                d3.event.subject.fx = d3.event.x;
                d3.event.subject.fy = d3.event.y;
            }

            function dragended() {
                if (!d3.event.active) simulation.alphaTarget(0);
                d3.event.subject.fx = null;
                d3.event.subject.fy = null;
            }
            function drawLink(d) {
                context.moveTo(d.source.x, d.source.y);
                context.lineTo(d.target.x, d.target.y);
            }

            function drawNode(d) {
                context.moveTo(d.x + 3, d.y);
                context.arc(d.x, d.y, 3, 0, 2 * Math.PI);
            }

        },
        d3EditMy: function () {
            _self = this;
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
            var layout = d3.forceSimulation()
                .force("charge", d3.forceManyBody().strength(-500))
                .force("link", d3.forceLink().strength(1).distance(200).iterations(100))
                .force("center", d3.forceCenter(width / 2, height / 2));


            //定义svg画板
            var svg = d3.select("#d3Force").append("svg")
                .attr("width", width)
                .attr("height", height);

            //箭头
            var marker =
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
            d3.json("../json_data/venation.json", function (error, json) {
                if (error) throw error;


                jsonContext = json;
                layout
                    .nodes(json.nodes)
                    .on("tick", tick);

                layout.force("link")
                    .links(json.edges);

                svg.selectAll("line").remove();
                edges_lineSVG = svg.selectAll("line")
                    .data(json.edges);
                svg.selectAll(".linetext").remove();
                edges_textSVG = svg.selectAll(".linetext")
                    .data(json.edges);
                svg.selectAll("image").remove();
                node_imgSVG = svg.selectAll("image")
                    .data(json.nodes);
                svg.selectAll(".nodetext").remove();
                node_textSVG = svg.selectAll(".nodetext")
                    .data(json.nodes);

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
                                image = "../images/graph/type_group.png";
                                break;
                            case "taskid":
                                image = "../images/graph/type_task.png";
                                break;
                            case "fkid":
                                image = "../images/graph/type_feedback.png";
                                break;
                            case "ajid":
                                image = "../images/graph/type_case.png";
                                break;
                        }
                        return image;
                    });
                console.info(node_imgSVG)

                node_imgSVG.exit().remove();
                var ima = document.querySelector("image");
                console.info(ima)
                var domSvg = document.getElementById('d3Force').querySelector("svg");
                d3.select(domSvg)
                    .call(d3.drag()
                        .container(domSvg)
                        .subject(dragsubject)
                        .on("start", dragstarted)
                        .on("drag", dragged)
                        .on("end", dragended)
                );

                var node_dx = 0;//-20,
                var node_dy = 20;
                //节点上的字
                node_text = node_textSVG
                    .enter()
                    .append("text")
                    .attr("class", "nodetext")
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
                node_textSVG.exit().remove();


                function dragsubject() {
                    // console.info(layout)
                    // console.info(layout.find(d3.event.x, d3.event.y))
                    // console.info(layout.nodes())
                    // return layout.nodes();
                    return layout.find(d3.event.x, d3.event.y);
                }
            });

            function dragstarted() {
                if (!d3.event.active) layout.alphaTarget(0.3).restart();
                d3.event.subject.fx = d3.event.subject.x;
                d3.event.subject.fy = d3.event.subject.y;
            }

            function dragged() {
                d3.event.subject.fx = d3.event.x;
                d3.event.subject.fy = d3.event.y;
            }

            function dragended() {
                if (!d3.event.active) layout.alphaTarget(0);
                d3.event.subject.fx = null;
                d3.event.subject.fy = null;
            }
        }
    }
});
