package cn.sinobest.policeunion.biz.gxwj.graph.core.pj;

/**
 * Created by zy-xx on 17/3/3.
 */
public class ValueNode {
    private String value;
    private String type;
    private String describe;

    /**
     * 给graphNode初始化使用
     */
    public ValueNode() {
    }

    /**
     * 给searcher到relationService传递使用
     * @param value
     */
    public ValueNode(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getDescribe() {
        return describe;
    }

    public void setDescribe(String describe) {
        this.describe = describe;
    }
}
