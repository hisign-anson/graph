package cn.sinobest.policeunion.biz.gxwj.graph.core;

import cn.sinobest.policeunion.biz.gxwj.graph.core.pj.GraphNode;
import cn.sinobest.policeunion.biz.gxwj.graph.core.pj.GraphNodeRelation;
import cn.sinobest.policeunion.biz.gxwj.graph.core.pj.ValueNode;
import com.google.common.collect.*;

import java.util.Collection;
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

    private Multimap<GraphNode,GraphNodeRelation> nodeMap = ArrayListMultimap.create();

    private SetMultimap<String,ValueNode> typeValue = HashMultimap.create();
    private SetMultimap<GraphNodeRelation,ValueNode> relationValue = HashMultimap.create();

    private void putNodeMap(GraphNode fromNode,GraphNodeRelation graphRelation){
        nodeMap.put(fromNode,graphRelation);
    }

    private void putNodeMap(ValueNode valueNode){
        typeValue.put(valueNode.getType(),valueNode);
    }

    private void putNodeMap(GraphNodeRelation relationm,ValueNode valueNode){
        relationValue.put(relationm,valueNode);
    }

    public boolean addEdge(GraphNode fromNode,GraphNode toNode,String relation){

        fromNode.setPkRelation(relation);
        toNode.setPkRelation(relation);
        boolean putSuccess = edges.put(fromNode,toNode);

        GraphNodeRelation graphRelation = fromNode.getRelation();
        putNodeMap(fromNode,graphRelation);
        putNodeMap(fromNode.getValueNode());
        putNodeMap(graphRelation,fromNode.getValueNode());

        if (putSuccess){

            if (!isDirected){
                boolean toPutSuccess = edges.put(toNode,fromNode);
                putNodeMap(toNode.getValueNode());
                putNodeMap(graphRelation,toNode.getValueNode());
            }
            sumEdge++;
        }
        return putSuccess;
    }

    public Graph() {
        this(false);
    }

    public Graph(boolean isDirected) {
        this.isDirected = isDirected;
    }

    public Set<ValueNode> getValueNode(String type){
        return typeValue.get(type);
    }

    public Set<ValueNode> getValueNode(GraphNodeRelation relation){
        return relationValue.get(relation);
    }

    public Multimap<GraphNode,GraphNodeRelation> getNodeMap(){
        return nodeMap;
    }

    public Collection<GraphNode> adj(GraphNode node){
        return edges.get(node);
    }

    public Set<GraphNode> getNodes(){
        return edges.keySet();
    }

    public Collection<GraphNode> getRelations(){
        return edges.values();
    }

    public long getSumNode() {
        return edges.keySet().size();
    }

    public long getSumEdge() {
        return sumEdge;
    }

}
