package cn.sinobest.policeunion.biz.gxwj.graph.core.pj;

import java.util.Set;

/**
 * Created by zy-xx on 17/3/3.
 */
public class GraphProxyNode {
    private GraphNode node;

    private Set<GraphNodeRelation> relations;

    public boolean addRelation(GraphNodeRelation relation){
        return relations.add(relation);
    }

    public int getRelationSize(){
        return relations.size();
    }

    public GraphProxyNode(GraphNode node) {
        this.node = node;
    }

    public GraphNode getNode() {
        return node;
    }

    public void setNode(GraphNode node) {
        this.node = node;
    }

    public Set<GraphNodeRelation> getRelations() {
        return relations;
    }

    public void setRelations(Set<GraphNodeRelation> relations) {
        this.relations = relations;
    }
}
