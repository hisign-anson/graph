package cn.sinobest.policeunion.biz.gxwj.graph.search.service.impl;

import cn.sinobest.policeunion.biz.gxwj.graph.common.resource.GraphContext;
import cn.sinobest.policeunion.biz.gxwj.graph.common.resource.GraphNodeType;
import cn.sinobest.policeunion.biz.gxwj.graph.common.resource.GraphRelation;
import cn.sinobest.policeunion.biz.gxwj.graph.core.Graph;
import cn.sinobest.policeunion.biz.gxwj.graph.core.pj.GraphNode;
import cn.sinobest.policeunion.biz.gxwj.graph.search.relation.IRelationService;
import cn.sinobest.policeunion.biz.gxwj.graph.search.service.IGraphSearcher;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.Iterator;
import java.util.Set;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * Created by zhouyi1 on 2016/6/27 0027.
 */
@Service(value = "gxwj.DBBFSService")
@Scope(value = "prototype")
public class GraphDBBFSSearcher implements IGraphSearcher {
    private static final Log logger = LogFactory.getLog(GraphDBBFSSearcher.class);

    private int defaultLevel = 10;

    private int minLevel = 0;

    @Resource(name = "gxwj.context")
    private GraphContext context;

    @Resource(name = "gxwj.nodeRelationService")
    private IRelationService relationService;

    private ExecutorService executorService = Executors.newScheduledThreadPool(50);

    @Override
    public Graph breadthFirstSearch(Integer limitLevel, long maxNode, Boolean detail, GraphNodeType type, Iterator<GraphNode> startNodes) {
        if (limitLevel == null && defaultLevel > 0) {
            limitLevel = defaultLevel;
        }
        Graph graph = new Graph();
        if (graph.getSumNode()>=maxNode){
            return graph;
        }
        if (limitLevel <= 0) {
            return graph;
        }

        limitLevel--;

        Set<GraphRelation> relations = context.getRelation(type);
        for (GraphRelation relation : relations) {
            executorService.execute(new RelationTask(graph, startNodes, detail, relation));
        }

        breadthFirstSearch(limitLevel,maxNode,detail,type,graph.getNodes());
        return graph;
    }

    class RelationTask implements Runnable {

        private Iterator<GraphNode> startNodes;

        private Boolean detail;

        private GraphRelation relation;

        private Graph graph;

        private RelationTask(Graph graph, Iterator<GraphNode> startNodes, Boolean detail, GraphRelation relation) {
            this.graph = graph;
            this.startNodes = startNodes;
            this.detail = detail;
            this.relation = relation;
        }

        @Override
        public void run() {
            relationService.search(graph, detail, relation, startNodes);
        }
    }

    public IRelationService getRelationService() {
        return relationService;
    }

    public void setRelationService(IRelationService relationService) {
        this.relationService = relationService;
    }

}
