var width = 1200,
    height = 700;

var img_w = 48,
    img_h = 48;
var jsonContext, edges_line, edges_text, node_img, node_text;
// var groupid = $("#mapSvgFrame", parent.document).attr("groupid");
// var jsonInitUrl = "/graph/getGraph?limitLevel=20&maxNode=50&detail=false&startNodeValue=" + groupid + "&startNodeType=groupid";

var edges_lineSVG;
var edges_textSVG;
var node_imgSVG;
var node_textSVG;

define(['d3V3', 'js/graphAction'], function ( d3, graphAction) {
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

//根据链接更新
    function updateGraphURL(jsonUrl) {
        d3.json(jsonUrl, function (error, json) {
            if (error) {
                return console.log(error);
            }
            updateGraphJSON(json);

            graphAction.graphAction(layout);
        });
    }

//根据json更新
    function updateGraphJSON(json) {
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
            .call(layout.drag);
        node_imgSVG.exit().remove();

        var node_dx = 0;//-20,
        var node_dy = 20;
        // var html = '<tspan class="name-text" dx="' + node_dx + '" dy="' + node_dy + '" x="' + node_dx + '" y="' + node_dy + '"></tspan>' +
        //     '<tspan class="time-text" x="' + node_dx + '" y="' + node_dy + 20 + '" dx="' + node_dx + '" dy="' + node_dy + 20 + '"></tspan>';
        //节点上的字
        node_text = node_textSVG
            .enter()
            .append("text")
            .attr("class", "nodetext")
            // .html(html)
            .attr("dx", node_dx)
            .attr("dy", node_dy);
        node_textSVG.exit().remove();
    }

//定义svg画板
    var svg = d3.select("body").append("svg")
    // .attr("preserveAspectRatio", "xMidYMid meet")
    // //自适应------- x:左上角横坐标，y:左上角纵坐标，width:宽度，height:高度
    // .attr("viewBox", "0 0 1200 960")
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
            .attr("refX", 30)//箭头坐标
            .attr("refY", 0)
            .attr("markerWidth", 12)//标识的大小
            .attr("markerHeight", 12)
            .attr("orient", "auto")//绘制方向，可设定为：auto（自动确认方向）和 角度值
            .attr("stroke-width", 2)//箭头宽度
            .append("path")
            .attr("d", "M0,-5L10,0L0,5")//箭头的路径
            .attr('fill', '#808080');//箭头颜色


    function addNodes(){
        var nodeStr1 = "{\n" +
            "      \"id\":\"011\",\n" +
            "      \"name\": \"反馈线索ccccc\",\n" +
            "      \"image\": \"images/xkdna.jpg\",\n" +
            "      \"type\": \"3\",\n" +
            "      \"depth\": 0\n" +
            "    }";
        var nodeStr2 =
            "{\n" +
            "      \"id\":\"011\",\n" +
            "      \"name\": \"反馈线索sssss\",\n" +
            "      \"image\": \"images/xkdna.jpg\",\n" +
            "      \"type\": \"3\",\n" +
            "      \"depth\": 0\n" +
            "    }";
        var linkStr1 = "\n" +
            "    {\n" +
            "      \"source\": 3,\n" +
            "      \"target\": 16,\n" +
            "      \"relation\": \"\"\n" +
            "    }";
        var linkStr2 = "\n" +
            "    {\n" +
            "      \"source\": 4,\n" +
            "      \"target\": 15,\n" +
            "      \"relation\": \"\"\n" +
            "    }";
        var node1 = JSON.parse(nodeStr1);
        var node2 = JSON.parse(nodeStr2);
        var link1 = JSON.parse(linkStr1);
        var nodeArray = new Array();
        nodeArray.push(node1);
        nodeArray.push(node2);
        var linkArray = new Array();
        linkArray.push(link1);
        addNode(nodeArray,linkArray);
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

    function removeNode(index) {
        console.log(index);
        if (!node_imgSVG[0][index]) {
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
    function clickEvent() {
        $('#update').on('click',function () {
            updateGraphURL('../json_data/Test2.json');
        });
        $('#add').on('click',function () {
            addNodes()
        });
        $('#remove').on('click',function () {
            var indexValue = $('#indexValue').val();
            removeNode(indexValue);
        });
    }
    return {
        updateGraphURL: updateGraphURL,
        clickEvent:clickEvent,
        layout: layout
    };
});