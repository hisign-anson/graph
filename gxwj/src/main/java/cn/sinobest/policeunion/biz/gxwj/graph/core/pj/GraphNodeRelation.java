package cn.sinobest.policeunion.biz.gxwj.graph.core.pj;

/**
 * Created by zy-xx on 17/3/3.
 */
public class GraphNodeRelation {
    private GraphNode node;

    private String pkRelation;
    private String describe;

    public GraphNodeRelation() {
    }

    public GraphNodeRelation(GraphNode node) {
        this.node = node;
    }

    public GraphNode getNode() {
        return node;
    }

    public void setNode(GraphNode node) {
        this.node = node;
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
}
