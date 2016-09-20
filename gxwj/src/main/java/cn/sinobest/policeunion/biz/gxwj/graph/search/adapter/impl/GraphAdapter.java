package cn.sinobest.policeunion.biz.gxwj.graph.search.adapter.impl;

import cn.sinobest.policeunion.biz.gxwj.graph.common.resource.GraphNodeType;
import cn.sinobest.policeunion.share.gxwj.graph.node.GraphNode;
import cn.sinobest.policeunion.share.gxwj.graph.search.adapter.IGraphService;
import cn.sinobest.policeunion.biz.gxwj.graph.search.callback.INodeCallBackHandler;
import cn.sinobest.policeunion.biz.gxwj.graph.search.callback.impl.RelationCallBackHandler;
import cn.sinobest.policeunion.share.gxwj.graph.search.callback.po.RelationResult;
import cn.sinobest.policeunion.biz.gxwj.graph.search.service.IGraphSearcher;
import cn.sinobest.policeunion.share.gxwj.graph.search.adapter.po.GraphResult;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Created by zhouyi1 on 2016/9/13 0013.
 */
public class GraphAdapter implements IGraphService {

    private IGraphSearcher searcher;

    private List<INodeCallBackHandler> callBackHandlers = new ArrayList();

    private RelationCallBackHandler relationCallBackHandler = new RelationCallBackHandler();

    public void setSearcher(IGraphSearcher searcher) {
        this.searcher = searcher;
    }

    public void setCallBackHandlers(List<INodeCallBackHandler> callBackHandlers) {
        this.callBackHandlers = callBackHandlers;
    }

    public void init() {
        callBackHandlers.add(relationCallBackHandler);
    }

    @Override
    public GraphResult breadthFirstSearch(Integer limitLevel, long maxNode, Boolean detail, String type, GraphNode... startNodes) {
        Set<GraphNode> nodes = searcher.breadthFirstSearch(limitLevel, maxNode, detail, callBackHandlers, new GraphNodeType(type), startNodes);
        Map<Integer, RelationResult> relationResultMap = relationCallBackHandler.getRelationMap();
        return new GraphResult(nodes,relationResultMap);
    }
}
