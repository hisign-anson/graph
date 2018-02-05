<%@page language="java" pageEncoding="UTF-8" contentType="text/html;charset=utf-8" %>
<html>
<head>
    <meta charset="utf-8">
    <title>ECharts</title>

    <script src="plugins/echarts/echarts.js"></script>
    <script src="plugins/jQuery/jquery_1.11.3.js"></script>
    <script src="plugins/echarts/dataTool.js"></script>
</head>
<body>

<div id="main" style="width: 100%;height:100%;"></div>
<script type="text/javascript">
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'));
    /////////////////////////////
    //填写图形脚本
    option = {
        title: {text: '案件线索关系图'},
        tooltip: {
            formatter: function (x) {
                return x.data.des;
            }
        },
        series: [
            {
                type: 'graph',
                layout: 'force',
                symbolSize: 80,
                roam: true,
                edgeSymbol: ['circle', 'arrow'],
                edgeSymbolSize: [4, 10],
                edgeLabel: {
                    normal: {
                        textStyle: {
                            fontSize: 20
                        }
                    }
                },
                force: {
                    repulsion: 2500,
                    edgeLength: [200, 500]
                },
                draggable: true,
                itemStyle: {
                    normal: {
                        color: '#4b565b'
                    }
                },
                lineStyle: {
                    normal: {
                        width: 2,
                        color: '#4b565b'

                    }
                },
                edgeLabel: {
                    normal: {
                        show: true,
                        formatter: function (x) {
                            return x.data.name;
                        }
                    }
                },
                label: {
                    normal: {
                        show: true,
                        textStyle: {}
                    }
                }
            }
        ]
    };

    $.ajax({
        url: 'getGraph?limitLevel=3&maxNode=1000&detail=true&startNodeValue=18520117227&startNodeType=dhhm',
        type: 'GET',
        data: "{}",
        dataType: 'json',
        success: function (data) {
            option.series[0].nodes = data.nodes;
            option.series[0].links = data.links;
            myChart.setOption(option);
        },
        error: function (errorMsg) {
            alert("图表请求数据失败!");
        }
    });

    myChart.setOption(option);
    /////////////////////////////
</script>
</body>
</html>
