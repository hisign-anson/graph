package cn.sinobest.policeunion.biz.gxwj.graph.search.service;

import cn.sinobest.policeunion.biz.gxwj.graph.common.resource.GraphNodeType;
import cn.sinobest.policeunion.biz.gxwj.graph.core.Graph;
import cn.sinobest.policeunion.biz.gxwj.graph.core.pj.ValueNode;

import java.util.Set;

/**
 * Created by zhouyi1 on 2016/6/27 0027.
 */
public interface IGraphSearcher {
    Graph breadthFirstSearch(Integer limitLevel, long maxNode, Boolean detail, GraphNodeType type, Set<ValueNode> startNodes);
}
