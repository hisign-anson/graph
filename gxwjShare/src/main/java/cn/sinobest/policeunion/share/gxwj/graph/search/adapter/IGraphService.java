package cn.sinobest.policeunion.share.gxwj.graph.search.adapter;

import cn.sinobest.policeunion.share.gxwj.graph.node.GraphNode;
import cn.sinobest.policeunion.share.gxwj.graph.search.adapter.po.GraphResult;

/**
 * Created by zhouyi1 on 2016/9/13 0013.
 */
public interface IGraphService {
    GraphResult breadthFirstSearch(Integer limitLevel, long maxNode, Boolean detail, String type, GraphNode... startNodes);
}
