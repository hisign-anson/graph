package cn.sinobest.policeunion.biz.gxwj.graph.core;

import cn.sinobest.policeunion.share.gxwj.graph.node.GraphNode;
import org.junit.Test;

/**
 * Created by zy-xx on 16/10/18.
 */
public class CycleTest {

    @Test
    public void testGetCycles() throws Exception {
        String relation = new String();
        GraphNode node1 = new GraphNode("1","sfzh");
        GraphNode node2 = new GraphNode("2","sfzh");
        GraphNode node3 = new GraphNode("3","sfzh");
        GraphNode node4 = new GraphNode("4","sfzh");
        GraphNode node5 = new GraphNode("5","sfzh");
        GraphNode node6 = new GraphNode("6","sfzh");
        GraphNode node7 = new GraphNode("7","sfzh");
        GraphNode node8 = new GraphNode("8","sfzh");
        GraphNode node9 = new GraphNode("9","sfzh");
        GraphNode node10 = new GraphNode("10","sfzh");
        GraphNode node11 = new GraphNode("11","sfzh");
        GraphNode node12 = new GraphNode("12","sfzh");
        GraphNode node13 = new GraphNode("13","sfzh");

        Graph graph = new Graph();
        graph.addEdge(node1,node2,relation);
        graph.addEdge(node1,node3,relation);
        graph.addEdge(node1,node4,relation);
        graph.addEdge(node5,node6,relation);
        graph.addEdge(node3,node6,relation);
        graph.addEdge(node5,node7,relation);
        graph.addEdge(node5,node3,relation);
        graph.addEdge(node6,node7,relation);
        graph.addEdge(node8,node7,relation);
        graph.addEdge(node8,node9,relation);
        graph.addEdge(node9,node10,relation);
        graph.addEdge(node10,node11,relation);
        graph.addEdge(node10,node12,relation);
        graph.addEdge(node10,node13,relation);

        Cycle cycle = new Cycle(graph);
        System.out.println(cycle.hasCycles());
        System.out.println(cycle.getCycles());

    }
}