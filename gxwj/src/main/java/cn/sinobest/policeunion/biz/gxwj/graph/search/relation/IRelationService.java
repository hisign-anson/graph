package cn.sinobest.policeunion.biz.gxwj.graph.search.relation;

import cn.sinobest.policeunion.biz.gxwj.graph.common.resource.GraphRelation;
import cn.sinobest.policeunion.biz.gxwj.graph.core.Graph;
import cn.sinobest.policeunion.biz.gxwj.graph.core.pj.GraphNode;

import java.util.Iterator;

/**
 * Created by zhouyi1 on 2016/6/27 0027.
 */
public interface IRelationService {
//    Set<GraphNode> search(Map<GraphNode,Object> noNeedSearchMap, Integer level, Boolean detail, GraphNodeRelation relation, List<INodeCallBackHandler> callBackHandler, GraphNode... startNodes);
    void search(Graph graph, Boolean detail, GraphRelation relation, Iterator<GraphNode> startNodes);
}
