package cn.sinobest.policeunion.biz.gxwj.graph.core;

import cn.sinobest.policeunion.share.gxwj.graph.node.GraphNode;
import com.google.common.collect.Maps;

import java.util.*;

/**
 * Created by zhouyi1 on 2016/10/18 0018.
 */
public class Cycle {
    private HashMap<GraphNode,Boolean> maked = Maps.newHashMap();
    private List<Stack<GraphNode>> cycles = new LinkedList<Stack<GraphNode>>();
    private HashMap<GraphNode,GraphNode> edgeTo = Maps.newHashMap();

    public Cycle(Graph graph) {
        Set<GraphNode> nodes = graph.getNodes();
        for (GraphNode node:nodes){
            if (!maked.get(node)){
                dfs(graph, node, node);
            }
        }
    }

    public void dfs(Graph graph,GraphNode node,GraphNode lastNode){
        maked.put(node, true);
        for (GraphNode toNode:graph.adj(node)){
            if (!maked.get(toNode)){
                edgeTo.put(toNode,node);
                dfs(graph, toNode, node);
                edgeTo.remove(toNode);
            }else if (!toNode.equals(lastNode)){
                Stack<GraphNode> cycle = new Stack<GraphNode>();
                for (GraphNode x=node;x!=toNode;x=edgeTo.get(x)){
                    cycle.push(x);
                }
                cycle.push(toNode);
                cycle.push(node);
                cycles.add(cycle);
            }
        }
    }
}
