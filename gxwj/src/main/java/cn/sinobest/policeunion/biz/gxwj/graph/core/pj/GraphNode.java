package cn.sinobest.policeunion.biz.gxwj.graph.core.pj;

import com.google.common.collect.Maps;

import java.util.Arrays;
import java.util.Map;

/**
 * Created by zy-xx on 17/3/3.
 */
public class GraphNode {
    private String value;
    private String type;
    private String pkValue = "";
    private Map<String,Object> details = Maps.newHashMap();
    private String describe;

    public GraphNode(String value) {
        this.value = value;
    }

    public GraphNode(String value, String pkValue) {
        this.value = value;
        this.pkValue = pkValue;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getPkValue() {
        return pkValue;
    }

    public void setPkValue(String pkValue) {
        this.pkValue = pkValue;
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

    public String getDescribe() {
        return describe;
    }

    public void setDescribe(String describe) {
        this.describe = describe;
    }
    @Override
    public boolean equals(Object obj) {
        if(!(obj instanceof GraphNode)){
            return false;
        }
        if (obj==null){
            return false;
        }

        GraphNode target = (GraphNode)obj;
        return pkValue.equals(target.getPkValue()) && value.equals(target.getValue());
    }

    @Override
    public int hashCode() {
        return Arrays.hashCode(new int[] {value.hashCode(),pkValue.hashCode()});
    }
}
