package cn.sinobest.policeunion.biz.gxwj.graph.search.callback.impl;

import cn.sinobest.policeunion.biz.gxwj.graph.core.Cycle;
import cn.sinobest.policeunion.biz.gxwj.graph.core.Graph;
import cn.sinobest.policeunion.biz.gxwj.graph.search.callback.INodeCallBackHandler;
import cn.sinobest.policeunion.share.gxwj.graph.node.GraphNode;
import cn.sinobest.policeunion.share.gxwj.graph.search.callback.po.RelationResult;

import java.util.Arrays;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Created by zhouyi1 on 2016/7/8 0008.
 */
public class RelationCallBackHandler implements INodeCallBackHandler {
    private Map<Integer,RelationResult> relationMap = new ConcurrentHashMap();
    private Graph graph = new Graph();

    @Override
    public void nodeCallBack(GraphNode nodeFrom, GraphNode nodeTo, Integer level,String relationName) {
        if (nodeFrom==null || nodeTo==null){
            return;
        }
        GraphNode[] relation = new GraphNode[2];
        RelationResult relationResult = new RelationResult(relation,relationName);
        int fromValue = nodeFrom.hashCode();
        int toValue = nodeTo.hashCode();
        if (fromValue>toValue){
            relation[0] = nodeTo;
            relation[1] = nodeFrom;
        }else {
            relation[0] = nodeFrom;
            relation[1] = nodeTo;
        }

        Integer key = Arrays.hashCode(new Object[]{relation[0],relation[1],relationName});
        if (!relationMap.containsKey(key)){
            relationMap.put(key,relationResult);
            graph.addEdge(nodeFrom,nodeTo,relationName);
        }
    }

    public Map<Integer, RelationResult> getRelationMap() {
        return relationMap;
    }

    public Cycle getCycle(){
        return new Cycle(graph);
    }
}
