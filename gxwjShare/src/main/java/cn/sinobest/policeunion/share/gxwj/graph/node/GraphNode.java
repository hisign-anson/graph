package cn.sinobest.policeunion.share.gxwj.graph.node;


import java.io.Serializable;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Created by zhouyi1 on 2016/6/27 0027.
 */
public class GraphNode implements Serializable {
    private String value;

    private String type;

    private AtomicInteger totalSize = new AtomicInteger();

    private Map<String,Map<Integer,Map<String,Object>>> nodes = new HashMap<String, Map<Integer,Map<String,Object>>>();

//    private Map<Integer,Map<String,Object>> nodes = new HashMap();

    public String getType() {
        return type;
    }

    public GraphNode(String value, String type) {
        this.value = value;
        this.type = type;
    }

    public int getTotalSize() {
        return totalSize.intValue();
    }

    public Map<String,Map<Integer,Map<String,Object>>> getNodes() {
        return nodes;
    }

    public void addNode(String relationName,Map<String,Object> nodeDetails,Object... primaryKeys) {
        Map<Integer,Map<String,Object>> relationNodes = nodes.get(relationName);
        if (relationNodes==null){
            relationNodes = new HashMap<Integer,Map<String,Object>>();
            relationNodes.put(Arrays.hashCode(primaryKeys), nodeDetails);
            doAddNode(relationName,relationNodes);
//        }else {
//            relationNodes.put(Arrays.hashCode(primaryKeys), nodeDetails);
        }
    }

    private void doAddNode(String relationName,Map<Integer,Map<String,Object>> relationNodes){
        nodes.put(relationName,relationNodes);
        totalSize.addAndGet(relationNodes.size());
    }

    public void addAllNodes(Map<String,Map<Integer,Map<String,Object>>> nodes) {
        for (Map.Entry<String,Map<Integer,Map<String,Object>>> node:nodes.entrySet()){
            Map<Integer,Map<String,Object>> relationNodes = this.nodes.get(node.getKey());
            if (relationNodes==null){
                doAddNode(node.getKey(), node.getValue());
            }
        }
//        this.nodes.putAll(nodes);
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    @Override
    public String toString() {
        return "GraphNode{" +
                "nodes=" + nodes +
                ", value='" + value + '\'' +
                ", totalSize=" + totalSize +
                '}';
    }

    @Override
    public boolean equals(Object obj) {
        if (!(obj instanceof GraphNode)){
            return false;
        }
        GraphNode node = (GraphNode) obj;
        boolean result = value.equals(node.getValue());
        if (result){
            node.addAllNodes(getNodes());
        }
        return result;
    }

    @Override
    public int hashCode() {
        return value.hashCode();
    }
}
