package cn.sinobest.policeunion.biz.gxwj.controller;

import cn.sinobest.policeunion.biz.gxwj.common.util.EasyJSONUtil;
import cn.sinobest.policeunion.biz.gxwj.graph.common.init.SpringContextInit;
import cn.sinobest.policeunion.biz.gxwj.graph.core.Graph;
import cn.sinobest.policeunion.biz.gxwj.graph.core.pj.GraphNode;
import cn.sinobest.policeunion.biz.gxwj.graph.core.pj.ValueNode;
import cn.sinobest.policeunion.biz.gxwj.graph.search.adapter.IGraphService;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.google.common.collect.Sets;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collection;
import java.util.Set;

/**
 * Created by zy-xx on 17/3/2.
 */
@RestController
public class GXWJController {

    protected static JSONArray getNodesJson(Set<GraphNode> nodes) {

        JSONArray nodesJson = EasyJSONUtil.getJSONArray(nodes, new EasyJSONUtil.NameProcessFilter() {
            @Override
            public String process(String name, Object value) {
                if ("value".equals(name)) {
                    return "name";
                } else if ("describe".equals(name)) {
                    return "des";
                }
                return name;
            }
        }, new EasyJSONUtil.ApplyFilter() {
            @Override
            public boolean apply(Object object, String name) {
                if ("value".equals(name) || "describe".equals(name)) {
                    return true;
                }
                return false;
            }
        },new EasyJSONUtil.DefaultWriteBeforeFilterImpl());

//        String nodesJson = JSON.toJSONString(nodes, new SerializeFilter[]{new PropertyPreFilter() {
//            @Override
//            public boolean apply(JSONSerializer serializer, Object object, String name) {
//                if ("value".equals(name) || "describe".equals(name)) {
//                    return true;
//                }
//                return false;
//            }
//        }, new NameFilter() {
//            @Override
//            public String process(Object object, String name, Object value) {
//                if ("value".equals(name)) {
//                    return "name";
//                } else if ("describe".equals(name)) {
//                    return "des";
//                }
//                return name;
//            }
//        }});

        return nodesJson;
    }

    protected static JSONArray getLinksJson(Collection<GraphNode> toNodes, final GraphNode node) {

        JSONArray linksJson = EasyJSONUtil.getJSONArray(toNodes, new EasyJSONUtil.NameProcessFilter() {
            @Override
            public String process(String name, Object value) {
                if ("value".equals(name)) {
                    return "target";
                }
                if ("pkRelation".equals(name)) {
                    return "name";
                }
                return name;
            }
        }, new EasyJSONUtil.ApplyFilter() {
            @Override
            public boolean apply(Object object, String name) {
                if ("value".equals(name) || "pkRelation".equals(name)) {
                    return true;
                }
                return false;
            }
        }, new EasyJSONUtil.WriteBeforeFilter() {
            @Override
            public void writeBefore(JSONObject object) {
                object.put("source",node.getValue());
            }
        });

//        String linksJson = JSON.toJSONString(toNodes, new SerializeFilter[]{new PropertyPreFilter() {
//            @Override
//            public boolean apply(JSONSerializer serializer, Object object, String name) {
//                if ("value".equals(name)) {
//                    return true;
//                }
//                return false;
//            }
//        }, new NameFilter() {
//            @Override
//            public String process(Object object, String name, Object value) {
//                if ("value".equals(name)) {
//                    return "target";
//                }
//                return name;
//            }
//        }, new BeforeFilter() {
//            @Override
//            public void writeBefore(Object object) {
//                writeKeyValue("source", node.getValue());
//                return;
//            }
//        }});
        return linksJson;

    }

    @RequestMapping(value = "/getGraph", method = RequestMethod.GET)
    public String getGraph(Integer limitLevel, long maxNode, Boolean detail, String startNodeValue, String startNodeType) {
        IGraphService service = (IGraphService) SpringContextInit.getBeanByAware("gxwj.graphService");
        Graph graph = service.breadthFirstSearch(limitLevel, maxNode, detail, startNodeType, Sets.newHashSet(new ValueNode(startNodeValue)));
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("nodes",new JSONArray());
        jsonObject.put("links",new JSONArray());
        Set<GraphNode> nodes = graph.getNodes();

        if (nodes.size() <= 0) {
            return JSON.toJSONString(jsonObject);
        }

        JSONArray nodesJson = getNodesJson(nodes);

//        StringBuilder linksStringBuilder = new StringBuilder();
//        //多一个空格是怕没有nodes的情况，虽然前面将这种情况排除了，但是以防万一
//        linksStringBuilder.append("[ ");
        JSONArray linksJsonArray = new JSONArray(Integer.parseInt(String.valueOf(graph.getSumEdge())));
        for (GraphNode node : nodes) {
            Collection<GraphNode> toNodes = graph.adj(node);

            JSONArray singleNodeLinksJson = getLinksJson(toNodes, node);
            linksJsonArray.addAll(singleNodeLinksJson);
//            linksStringBuilder.append(singleNodeLinksJson.substring(1, singleNodeLinksJson.length() - 1));
//            linksStringBuilder.append(",");
        }
//        linksStringBuilder.replace(linksStringBuilder.length() - 1, linksStringBuilder.length(), "]");
        jsonObject.put("nodes",nodesJson);
        jsonObject.put("links",linksJsonArray);
        return JSON.toJSONString(jsonObject);
    }
}
