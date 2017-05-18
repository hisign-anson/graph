package cn.sinobest.policeunion.biz.gxwj.graph.search.adapter;

import cn.sinobest.policeunion.biz.gxwj.graph.core.Graph;
import cn.sinobest.policeunion.biz.gxwj.graph.core.pj.ValueNode;

import java.util.Set;

/**
 * Created by zhouyi1 on 2016/9/13 0013.
 */
public interface IGraphService {
    Graph breadthFirstSearch(Integer limitLevel, long maxNode, Boolean detail, String type, Set<ValueNode> startNodes);
}
