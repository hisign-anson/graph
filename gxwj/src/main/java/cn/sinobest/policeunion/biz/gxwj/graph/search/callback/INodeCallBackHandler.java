package cn.sinobest.policeunion.biz.gxwj.graph.search.callback;

import cn.sinobest.policeunion.share.gxwj.graph.node.GraphNode;

/**
 * Created by zhouyi1 on 2016/6/29 0029.
 */
public interface INodeCallBackHandler {
    void nodeCallBack(GraphNode nodeFrom,GraphNode nodeTo,Integer level,String relationName);
}
