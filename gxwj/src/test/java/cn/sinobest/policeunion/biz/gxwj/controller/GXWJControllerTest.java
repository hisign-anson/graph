package cn.sinobest.policeunion.biz.gxwj.controller;

import cn.sinobest.policeunion.biz.gxwj.graph.core.pj.GraphNode;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.google.common.collect.Sets;
import org.junit.Test;

import java.util.Set;

/**
 * Created by zy-xx on 17/7/24.
 */
public class GXWJControllerTest {

    @Test
    public void testFastJsonFilter() {
        JSONObject jsonObject = new JSONObject();

        Set<GraphNode> nodes = Sets.newHashSet(new GraphNode("430102198704020515", "430102198704020515", "sfzh"), new GraphNode("430102198704020516", "430102198704020516", "sfzh"));

        JSONArray nodesJson = GXWJController.getNodesJson(nodes);

        System.out.println("nodesJson = " + nodesJson);

        JSONArray linksJsonArray = new JSONArray();

        JSONArray singleNodeLinksJson = GXWJController.getLinksJson(nodes, new GraphNode("18520117227", "18520117227", "dhhm"));
        linksJsonArray.addAll(singleNodeLinksJson);

        JSONArray singleNodeLinksJson1 = GXWJController.getLinksJson(nodes, new GraphNode("18520117226", "18520117226", "dhhm"));
        linksJsonArray.addAll(singleNodeLinksJson1);
//        for (GraphNode node : nodes) {
//            Collection<GraphNode> toNodes = graph.adj(node);
//
//            String singleNodeLinksJson = getLinksJson(toNodes, node);
//        }
        jsonObject.put("nodes", nodesJson);
        jsonObject.put("links", linksJsonArray);

        System.out.println("linksJson = " + JSON.toJSONString(jsonObject));


        JSONObject jsonObjectx = new JSONObject();
        jsonObjectx.put("nodes","");
        jsonObjectx.put("links","");
        System.out.println("jsonObjectx = " + jsonObjectx);
    }

}