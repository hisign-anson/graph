package cn.sinobest.policeunion.share.gxwj.graph.search.callback.po;

import cn.sinobest.policeunion.share.gxwj.graph.node.GraphNode;

import java.io.Serializable;

/**
 * Created by zhouyi1 on 2016/9/13 0013.
 */
public class RelationResult implements Serializable {
    private GraphNode[] relation = new GraphNode[2];
    private String relationName;

    public RelationResult(GraphNode[] relation, String relationName) {
        this.relation = relation;
        this.relationName = relationName;
    }

    public GraphNode[] getRelation() {
        return relation;
    }

    public String getRelationName() {
        return relationName;
    }
}
