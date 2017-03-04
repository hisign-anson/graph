package cn.sinobest.policeunion.biz.gxwj.graph.core.pj;

import com.google.common.collect.Maps;

import java.util.Map;
import java.util.Set;

/**
 * Created by zy-xx on 17/3/3.
 */
public class GraphNode {
    private String pkValue;
    private String value;
    private Map<String,Object> details = Maps.newHashMap();
    private String describe;

    private Set<GraphNodeRelation> relations;

    public GraphNode(String value,String pkValue) {
        this.value = value;
        this.pkValue = pkValue;
    }

    public GraphNode(String value,String pkValue, String describe) {
        this.value = value;
        this.pkValue = pkValue;
        this.describe = describe;
    }

    public Map<String, Object> getDetails() {
        return details;
    }

    public void setDetails(Map<String, Object> details) {
        this.details = details;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public Set<GraphNodeRelation> getRelations() {
        return relations;
    }

    public void setRelations(Set<GraphNodeRelation> relations) {
        this.relations = relations;
    }

    public String getPkValue() {
        return pkValue;
    }

    public void setPkValue(String pkValue) {
        this.pkValue = pkValue;
    }

    public String getDescribe() {
        return describe;
    }

    public void setDescribe(String describe) {
        this.describe = describe;
    }
}
