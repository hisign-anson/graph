package cn.sinobest.policeunion.biz.gxwj.graph.core.pj;

import com.google.common.collect.Maps;

import java.util.Map;

/**
 * Created by zy-xx on 17/3/3.
 */
public class GraphNodeRelation {

    private String pkValue = "";
    private Map<String,Object> details = Maps.newHashMap();
    private String pkRelation;
    private String describe;

    public GraphNodeRelation() {
    }

    public Map<String, Object> getDetails() {
        return details;
    }

    public void setDetails(Map<String, Object> details) {
        this.details = details;
    }

    public String getPkValue() {
        return pkValue;
    }

    public void setPkValue(String pkValue) {
        this.pkValue = pkValue;
    }

    public String getPkRelation() {
        return pkRelation;
    }

    public void setPkRelation(String pkRelation) {
        this.pkRelation = pkRelation;
    }

    public String getDescribe() {
        return describe;
    }

    public void setDescribe(String describe) {
        this.describe = describe;
    }

    @Override
    public int hashCode() {
        return getPkRelation().hashCode();
    }

    @Override
    public boolean equals(Object obj) {
        if (!(obj instanceof GraphNodeRelation)) {
            return false;
        }
        if (obj == null) {
            return false;
        }

        GraphNodeRelation target = (GraphNodeRelation) obj;
        return getPkRelation().equals(target.getPkRelation());
    }
}
