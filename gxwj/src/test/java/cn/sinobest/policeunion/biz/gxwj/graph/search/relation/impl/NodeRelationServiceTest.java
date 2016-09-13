package cn.sinobest.policeunion.biz.gxwj.graph.search.relation.impl;

import cn.sinobest.policeunion.biz.gxwj.graph.common.resource.GraphRelation;
import cn.sinobest.policeunion.share.gxwj.graph.node.GraphNode;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import javax.annotation.Resource;
import java.util.Map;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"classpath:applicationContext.xml"})
public class NodeRelationServiceTest {

    @Resource(name = "passoutDhhm2Sfzh")
    GraphRelation relation;

    @Resource(name = "gxwj.nodeRelationService")
    NodeRelationService relationService;

    @Test
    public void getFromNodeMapTest(){
        StringBuilder condition = new StringBuilder();
        Map map = relationService.getFromNodeMap(condition, relation, new GraphNode("1", "sfzh"), new GraphNode("2", "sfzh"), new GraphNode("3", "sfzh"), new GraphNode("4", "sfzh"), new GraphNode("5", "sfzh"), new GraphNode("6", "sfzh"));
        System.out.println(condition.toString());
        System.out.println("map = " + map);
    }

}