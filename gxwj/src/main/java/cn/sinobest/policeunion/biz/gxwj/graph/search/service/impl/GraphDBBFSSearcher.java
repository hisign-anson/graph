package cn.sinobest.policeunion.biz.gxwj.graph.search.service.impl;

import cn.sinobest.policeunion.biz.gxwj.graph.common.resource.GraphContext;
import cn.sinobest.policeunion.biz.gxwj.graph.common.resource.GraphNodeType;
import cn.sinobest.policeunion.biz.gxwj.graph.common.resource.GraphRelation;
import cn.sinobest.policeunion.biz.gxwj.graph.core.Graph;
import cn.sinobest.policeunion.biz.gxwj.graph.core.pj.GraphNode;
import cn.sinobest.policeunion.biz.gxwj.graph.search.relation.IRelationService;
import cn.sinobest.policeunion.biz.gxwj.graph.search.service.IGraphSearcher;
import com.google.common.collect.Sets;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.Set;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorCompletionService;
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

    private ExecutorCompletionService executorService = new ExecutorCompletionService(Executors.newScheduledThreadPool(50));

    /**
     * 获得relationSets和startNodeSets的交集，并且最终的集合Value是唯一的
     * @param relationSets
     * @param startNodeSets
     * @return
     */
    private Set<GraphNode> getUnionSet(Set<GraphNode> relationSets, Set<GraphNode> startNodeSets,GraphNodeType type) {
        Set<GraphNode> nodeSet = Sets.newHashSet();
//        if (!relationSets.isEmpty() && relationSets.size() > startNodeSets.size()) {
//            for (GraphNode node : startNodeSets) {
//                if (!relationSets.contains(node)) {
//                    nodeSet.add(new GraphNode(node.getValue()));
//                }
//            }
//            return nodeSet;
//        }
        for (GraphNode node:startNodeSets){
            if (relationSets.isEmpty() || !relationSets.contains(node)) {
                nodeSet.add(new GraphNode(node.getValue()));
            }
        }
        return nodeSet;
    }

    private Graph graph = new Graph();

    @Override
    public Graph breadthFirstSearch(Integer limitLevel, long maxNode, Boolean detail, GraphNodeType type, Set<GraphNode> startNodes) {
        logger.trace("limitLevel = " + limitLevel);
        if (limitLevel == null && defaultLevel > 0) {
            limitLevel = defaultLevel;
        }
        if (graph.getSumNode() >= maxNode) {
            return graph;
        }
        if (limitLevel <= 0) {
            return graph;
        }

        limitLevel--;

        Set<GraphRelation> relations = context.getRelation(type);
        int j = 0;
        for (GraphRelation relation : relations) {
            Set<GraphNode> graphNodeSet = graph.getNodesFromRelation(relation.getRelationPk());
            Set<GraphNode> nodeSet = getUnionSet(graphNodeSet, startNodes,type);
            if (nodeSet.isEmpty()) {
                continue;
            }
            executorService.submit(new RelationTask(graph, nodeSet, detail, relation));
            j++;
        }
        for (int i = 0; i < j; i++) {
            try {
                executorService.take();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }

        breadthFirstSearch(limitLevel, maxNode, detail, type, graph.getNodesFromType(type.getType()));
        return graph;
    }

    class RelationTask implements Callable {

        private Set<GraphNode> startNodes;

        private Boolean detail;

        private GraphRelation relation;

        private Graph graph;

        private RelationTask(Graph graph, Set<GraphNode> startNodes, Boolean detail, GraphRelation relation) {
            this.graph = graph;
            this.startNodes = startNodes;
            this.detail = detail;
            this.relation = relation;
        }

        @Override
        public Boolean call() {
            relationService.search(graph, detail, relation, startNodes);
            return true;
        }
    }

    public IRelationService getRelationService() {
        return relationService;
    }

    public void setRelationService(IRelationService relationService) {
        this.relationService = relationService;
    }

}
