package cn.sinobest.policeunion.biz.gxwj.graph.search.relation;

import cn.sinobest.policeunion.biz.gxwj.graph.common.resource.GraphRelation;
import cn.sinobest.policeunion.biz.gxwj.graph.search.callback.INodeCallBackHandler;
import cn.sinobest.policeunion.share.gxwj.graph.node.GraphNode;

import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Created by zhouyi1 on 2016/6/27 0027.
 */
public interface IRelationService {
//    Set<GraphNode> search(Map<GraphNode,Object> noNeedSearchMap, Integer level, Boolean detail, GraphRelation relation, List<INodeCallBackHandler> callBackHandler, GraphNode... startNodes);
    Set<GraphNode> search(boolean first,Map<GraphNode,Object> noNeedSearchMap, Integer level, Boolean detail, GraphRelation relation, List<INodeCallBackHandler> callBackHandler,long maxNode, GraphNode... startNodes);
}
