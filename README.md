# D3关系图（V3版本）
 目前采用力导图来布局，好处在于可以不用过分在乎节点位置，
 也能自动让节点看上去更加舒服、不紧凑

## graph.js
graph.js提供出来的方法
- addNode(nodeArrays,linkArrays)
    1. 包含新增节点和连接线，必须是数组否则无效
- updateGraphURL('relation.json')
    1. 包含动态加载URL得到JSON数据得到新的图
- updateGraphJSON(jsonObject)
    1. 包含动态加载JSON得到新的图
- 增加图标的点击等等事件，目前给出点击菜单配置
    1. 图标（即节点）的右键菜单操作

        通过Event对象的button事件属性返回的整数判断鼠标按键：0（左键） 1（中键） 2（右键）。

        在自定义右键功能之前要先去掉默认的contextmenu事件，否则会和右键事件同时出现。

        菜单的展示使用多功能树形插件，需要引入[ztree插件](http://www.treejs.cn/v3/main.php#_zTreeInfo)，详细API请参考[ztree API](http://www.treejs.cn/v3/api.php)。

       **步骤1. 文件准备，引用ztree**

        从官网下载ztree，在页面引用相关的js和css文件。自定义的样式写在graph.css中，graph.css文件在ztree样式文件之后引入，方便对树形菜单样式重置。

        注意：ztree相关的 js、css、img 文件放置到同一个目录下，并且保证相对路径正确。[zTree v3.x 入门指南](http://www.treejs.cn/v3/faq.php#_206)

        **步骤2. 菜单数据准备**

        根据需要配置zTree 的参数，每个菜单的点击事件在onClick中定义。

            var setting = {
               ......
               callback: {
                   onClick: function (event, treeId, treeNode, clickFlag) {
                       ......
                   }
                }
            }

        数据格式必须是满足JSON数据格式的JS对象。

        每个节点的菜单根据返回的当前节点数据d.id和d.type判断，如果d.id存在则加载当前节点对应的菜单数据，如果d.id不存在则进一步判断d.type；如果d.type存在则根据类型（1|2|3）判断当前节点对应的菜单数据，如果d.type不存在则加载事先准备好的默认的菜单数据。

graph.js的主要逻辑：
- 添加线，线的文字，节点图，节点文字四个元素，这四个元素会根据力导图的物理模型进行TICK的计算
- 有向图线的箭头marker，决定展示出来的是有向图还是无向图的关键因素
- 目前对于力导图的物理模型增加了摩擦力设置friction(0.6)和gravity(0.08)保证TICK效果不会过分弹（增加刚性并不能有效解决）

## force
由于都是采用FORCE力导图，则简单说下力导图的原理。
节点直接有斥力，连接线会给一个拉力，整体物理有摩擦力和引力（引力会从四周往中心），
从而保持整体最终的平衡。（这样节点直接肯定不会重合，线由于弹力，摩擦力和引力的作用交错的情况也会尽量减少）

d3.layout.force()有三个on事件,start,tick,end。分别是开始计算，每一次的跳动计算，计算完成。
d3巧妙的通过四叉数的原理，来让tick的时间复杂度降低。

所以假如要新增元素，需要在tick方法下进行元素的计算，否则新增的元素无法按照力导图的物理模型进行位置的运算。

更多的force的API详见 [https://github.com/d3/d3/blob/master/API.md#forces-d3-force]
