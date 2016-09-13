package cn.sinobest.policeunion.biz.gxwj.graph.search.service;

import cn.sinobest.policeunion.biz.gxwj.graph.common.resource.GraphNodeType;
import cn.sinobest.policeunion.share.gxwj.graph.node.GraphNode;
import cn.sinobest.policeunion.biz.gxwj.graph.search.callback.INodeCallBackHandler;

import java.util.List;
import java.util.Set;

/**
 * Created by zhouyi1 on 2016/6/27 0027.
 */
public interface IGraphSearcher {
    Set<GraphNode> breadthFirstSearch(Integer limitLevel, long maxNode, Boolean detail, List<INodeCallBackHandler> callBackHandlers, GraphNodeType type, GraphNode... startNodes);
}
