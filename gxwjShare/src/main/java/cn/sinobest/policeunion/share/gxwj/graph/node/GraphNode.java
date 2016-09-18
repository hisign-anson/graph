package cn.sinobest.policeunion.share.gxwj.graph.node;


import java.io.Serializable;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by zhouyi1 on 2016/6/27 0027.
 */
public class GraphNode implements Serializable {
    private String value;

    private String type;

    private Map<Integer,Map<String,Object>> nodes = new HashMap<>();

    public String getType() {
        return type;
    }

    public GraphNode(String value, String type) {
        this.value = value;
        this.type = type;
    }

    public Map<Integer,Map<String,Object>> getNodes() {
        return nodes;
    }

    public void addNode(Map<String,Object> nodeDetails,Object... primaryKeys) {
        this.nodes.put(Arrays.hashCode(primaryKeys), nodeDetails);
    }

    public void addAllNodes(Map<Integer,Map<String,Object>> nodes) {
        this.nodes.putAll(nodes);
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
