package cn.sinobest.policeunion.biz.gxwj.graph.core.pj;

import java.util.Arrays;
import java.util.Map;

/**
 * Created by zy-xx on 17/3/3.
 */
public class GraphNode {
    private ValueNode valueNode = new ValueNode();
    private GraphNodeRelation relation = new GraphNodeRelation();

    public GraphNode(String value) {
        valueNode.setValue(value);
    }

    public GraphNode(String value, String pkValue) {
        valueNode.setValue(value);
        relation.setPkValue(pkValue);
    }

    public GraphNode(String value, String pkValue, String type) {
        valueNode.setValue(value);
        relation.setPkValue(pkValue);
        valueNode.setType(type);
    }

    public GraphNodeRelation getRelation() {
        return relation;
    }

    public void setPkRelation(String pkRelation){
        relation.setPkRelation(pkRelation);
    }

    public ValueNode getValueNode() {
        return valueNode;
    }

    public String getType() {
        return valueNode.getType();
    }

    public void setType(String type) {
        valueNode.setType(type);
    }

    public String getPkValue() {
        return relation.getPkValue();
    }

    public void setPkValue(String pkValue) {
        relation.setPkValue(pkValue);
    }

    public Map<String, Object> getDetails() {
        return relation.getDetails();
    }

    public void setDetails(Map<String, Object> details) {
        relation.setDetails(details);
    }

    public String getValue() {
        return valueNode.getValue();
    }

    public void setValue(String value) {
        valueNode.setValue(value);
    }

    public String getDescribe() {
        return valueNode.getDescribe();
    }

    public void setDescribe(String describe) {
        valueNode.setDescribe(describe);
    }

    @Override
    public boolean equals(Object obj) {
        if (!(obj instanceof GraphNode)) {
            return false;
        }
        if (obj == null) {
            return false;
        }

        GraphNode target = (GraphNode) obj;
        return getPkValue().equals(target.getPkValue()) && getValue().equals(target.getValue()) && getType().equals(target.getType());
    }

    @Override
    public int hashCode() {
        return Arrays.hashCode(new int[]{getValue().hashCode(), getPkValue().hashCode(), getType().hashCode()});
    }
}
