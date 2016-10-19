package cn.sinobest.policeunion.biz.gxwj.graph.core;

import cn.sinobest.policeunion.biz.gxwj.graph.common.resource.GraphRelation;
import cn.sinobest.policeunion.share.gxwj.graph.node.GraphNode;
import com.google.common.collect.LinkedListMultimap;
import com.google.common.collect.Multimap;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

/**
 * Created by zhouyi1 on 2016/10/18 0018.
 */
public class Graph {
//    private HashSet<Queue<GraphNode>> edges = new HashSet<Queue<GraphNode>>();
    //默认无向图
    private boolean isDirected = false;
    private Multimap<GraphNode,GraphNode> edges = LinkedListMultimap.create();
    private long sumEdge;

    private HashSet<GraphRelation> relations = new HashSet<GraphRelation>();

    public void addEdge(GraphNode fromNode,GraphNode toNode,String relation){
        edges.put(fromNode,toNode);
        if (!isDirected){
            edges.put(toNode,fromNode);
        }
        sumEdge++;
    }

    public Collection<GraphNode> adj(GraphNode node){
        return edges.get(node);
    }

    public Set<GraphNode> getNodes(){
        return edges.keySet();
    }

    public void setRelations(HashSet<GraphRelation> relations) {
        this.relations = relations;
    }

    public long getSumNode() {
        return edges.keySet().size();
    }

    public long getSumEdge() {
        return sumEdge;
    }
}
