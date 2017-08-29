var width = 1200,
    height = 900;
var img_w = 50,
    img_h = 60;
var jsonContext,edges_line,edges_text,node_img,node_text;
var jsonInitUrl = "huangshijinTest.json";

function addNode(nodeArrays,linkArrays){
    var lenNodes = nodeArrays.length;
    var lenLinks = linkArrays.length;
    if (lenNodes>0){
        for (var i=0; i < lenNodes; i=i+5000) {
            jsonContext.nodes.push.apply( jsonContext.nodes, nodeArrays.slice( i, Math.max(i+5000,lenNodes)) );
        }
    }
    if (lenLinks>0){
        for (var i=0; i < lenLinks; i=i+5000) {
            jsonContext.edges.push.apply( jsonContext.edges, linkArrays.slice( i, Math.max(i+5000,lenNodes)) );
        }
    }
    update(jsonContext);
}

updateGraph(jsonInitUrl);
//根据链接更新
function updateGraph(jsonUrl){
    d3.json(jsonUrl, function (error, json) {
        if (error) {
            return console.log(error);
        }
        update(json);
    });
}

//根据json更新
function update(json) {
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
        // .on("dblclick", function (d, i) {
        //     d.fixed = false;
        // })
        .on("click",function (d, i) {
            if ($("#tooltip"+i).length<=0){
                var tooltipDiv = "<div id='tooltip"+i+"'> 我正在测试浮动提示</div>";
                $("body").append(tooltipDiv);
            }
            $("#tooltip"+i).css({
                "position":"absolute",
                "top":(d.y+10)+"px",
                "left":(d.x+35)+"px"
            }).show();
        })
        .on("mouseout",function (d, i) {
            $("#tooltip"+i).remove();
        })
        .on("mousemove",function (d, i) {
            $("#tooltip"+i).css({
                "top":(d.y+10)+"px",
                "left":(d.x+35)+"px"
            });
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
            jsonContext.nodes.forEach(function (d, i) {
                d.fixed = false;
            });
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