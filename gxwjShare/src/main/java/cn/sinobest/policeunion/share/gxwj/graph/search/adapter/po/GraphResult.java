package cn.sinobest.policeunion.share.gxwj.graph.search.adapter.po;

import cn.sinobest.policeunion.share.gxwj.graph.node.GraphNode;
import cn.sinobest.policeunion.share.gxwj.graph.search.callback.po.RelationResult;

import java.io.Serializable;
import java.util.Map;
import java.util.Set;

/**
 * Created by zhouyi1 on 2016/9/13 0013.
 */
public class GraphResult implements Serializable {
    private Set<GraphNode> nodes;
    private Map<Integer, RelationResult> relationResultMap;

    public GraphResult(Set<GraphNode> nodes, Map<Integer, RelationResult> relationResultMap) {
        this.nodes = nodes;
        this.relationResultMap = relationResultMap;
    }

    public Set<GraphNode> getNodes() {
        return nodes;
    }

    public Map<Integer, RelationResult> getRelationResultMap() {
        return relationResultMap;
    }
}
