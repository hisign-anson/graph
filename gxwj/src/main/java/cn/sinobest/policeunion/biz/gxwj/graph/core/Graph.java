package cn.sinobest.policeunion.biz.gxwj.graph.core;

import cn.sinobest.policeunion.biz.gxwj.graph.core.pj.GraphNode;
import cn.sinobest.policeunion.biz.gxwj.graph.core.pj.GraphNodeRelation;
import com.google.common.collect.HashMultimap;
import com.google.common.collect.LinkedListMultimap;
import com.google.common.collect.Multimap;
import com.google.common.collect.SetMultimap;

import java.util.Collection;
import java.util.Set;

/**
 * Created by zhouyi1 on 2016/10/18 0018.
 */
public class Graph {
//    private HashSet<Queue<GraphNode>> edges = new HashSet<Queue<GraphNode>>();
    //默认无向图
    private boolean isDirected = false;
    private Multimap<GraphNode,GraphNodeRelation> edges = LinkedListMultimap.create();
    private long sumEdge;

    private SetMultimap<String,GraphNode> type2Node = HashMultimap.create();
    private SetMultimap<String,GraphNode> relation2Node = HashMultimap.create();

    public boolean addEdge(GraphNode fromNode,GraphNode toNode,String relation){
        GraphNodeRelation graphToRelation = new GraphNodeRelation(toNode);
        graphToRelation.setPkRelation(relation);
        boolean putSuccess = edges.put(fromNode,graphToRelation);

        if (putSuccess){
            type2Node.put(fromNode.getType(),fromNode);
            relation2Node.put(relation,fromNode);

            if (!isDirected){
                GraphNodeRelation graphFromRelation = new GraphNodeRelation(fromNode);
                graphFromRelation.setPkRelation(relation);
                boolean toPutSuccess = edges.put(toNode,graphFromRelation);

                //只是为了严谨
                if (toPutSuccess){
                    type2Node.put(toNode.getType(),toNode);
                    relation2Node.put(relation,toNode);
                }
            }
            sumEdge++;
        }
        return putSuccess;
    }

    public Graph() {
    }

    public Graph(boolean isDirected) {
        this.isDirected = isDirected;
    }

    public Collection<GraphNodeRelation> adj(GraphNode node){
        return edges.get(node);
    }

    public Set<GraphNode> getNodesFromType(String type){
        return type2Node.get(type);
    }

    public Set<GraphNode> getNodes(){
        return edges.keySet();
    }

    public Collection<GraphNodeRelation> getRelations(){
        return edges.values();
    }

    public Set<GraphNode> getNodesFromRelation(String relation){
        return relation2Node.get(relation);
    }

    public long getSumNode() {
        return edges.keySet().size();
    }

    public long getSumEdge() {
        return sumEdge;
    }

}
