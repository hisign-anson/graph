package cn.sinobest.policeunion.biz.gxwj.graph.search.adapter.impl;

import cn.sinobest.policeunion.biz.gxwj.graph.common.resource.GraphNodeType;
import cn.sinobest.policeunion.biz.gxwj.graph.core.Graph;
import cn.sinobest.policeunion.biz.gxwj.graph.core.pj.ValueNode;
import cn.sinobest.policeunion.biz.gxwj.graph.search.adapter.IGraphService;
import cn.sinobest.policeunion.biz.gxwj.graph.search.service.IGraphSearcher;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.Set;

/**
 * Created by zhouyi1 on 2016/9/13 0013.
 */
@Service(value = "gxwj.graphService")
@Scope(value = "prototype")
public class GraphAdapter implements IGraphService {

    @Resource(name = "gxwj.DBBFSService")
    private IGraphSearcher searcher;
    public void setSearcher(IGraphSearcher searcher) {
        this.searcher = searcher;
    }

    public void init() {
//        callBackHandlers.add(relationCallBackHandler);
    }

    @Override
    public Graph breadthFirstSearch(Integer limitLevel, long maxNode, Boolean detail, String type, Set<ValueNode> startNodes) {
        Graph graph = searcher.breadthFirstSearch(limitLevel, maxNode, detail, new GraphNodeType(type), startNodes);
        return graph;
    }
}
