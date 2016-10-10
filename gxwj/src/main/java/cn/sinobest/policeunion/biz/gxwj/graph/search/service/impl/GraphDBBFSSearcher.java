package cn.sinobest.policeunion.biz.gxwj.graph.search.service.impl;

import cn.sinobest.policeunion.biz.gxwj.graph.common.resource.GraphContext;
import cn.sinobest.policeunion.biz.gxwj.graph.common.resource.GraphNodeType;
import cn.sinobest.policeunion.biz.gxwj.graph.common.resource.GraphRelation;
import cn.sinobest.policeunion.biz.gxwj.graph.search.callback.INodeCallBackHandler;
import cn.sinobest.policeunion.biz.gxwj.graph.search.relation.IRelationService;
import cn.sinobest.policeunion.biz.gxwj.graph.search.service.IGraphSearcher;
import cn.sinobest.policeunion.share.gxwj.graph.node.GraphNode;
import com.google.common.base.Function;
import com.google.common.collect.HashMultimap;
import com.google.common.collect.Maps;
import com.google.common.collect.SetMultimap;
import com.google.common.collect.Sets;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.*;
import java.util.concurrent.*;

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

    @Override
    public Set<GraphNode> breadthFirstSearch(Integer limitLevel, long maxNode, Boolean detail, List<INodeCallBackHandler> callBackHandlers, GraphNodeType type, GraphNode... startNodes) {
        if (callBackHandlers == null) {
            callBackHandlers = new ArrayList<INodeCallBackHandler>();
        }
        if (limitLevel == null && defaultLevel > 0) {
            limitLevel = defaultLevel;
        }

        Map<GraphNode, Object> finalResults = new ConcurrentHashMap<GraphNode, Object>();
//        Map<GraphNode, Object> startMap = Maps.asMap(Sets.newHashSet(startNodes), new Function<GraphNode, Object>() {
//            @Override
//            public Object apply(GraphNode graphNode) {
//                return new Object();
//            }
//        });

        Set<GraphRelation> relations = context.getRelation(type);
        for (GraphRelation relation : relations) {
            executorService.submit(new RelationTask(true, finalResults, startNodes, limitLevel, detail, relation, callBackHandlers));
        }
        for (int i = 0; i < relations.size(); i++) {
            Future<TempParam> future = null;
            try {
                //poll可以调整超时
                future = executorService.take();
                TempParam tempParam = future.get();
                Set<GraphNode> nextNodes = tempParam.getNextNodes();

                if (nextNodes.size() == 0) {
                    continue;
                } else {
                    Map<GraphNode, Object> nextMap = Maps.asMap(nextNodes, new Function<GraphNode, Object>() {
                        @Override
                        public Object apply(GraphNode graphNode) {
                            return new Object();
                        }
                    });
//                    synchronized (finalResults) {
                        finalResults.putAll(nextMap);
//                    }
                }
            } catch (InterruptedException e) {
                e.printStackTrace();
            } catch (ExecutionException e) {
                logger.error("startNodes:" + Arrays.toString(startNodes) + " error!", e);
                continue;
            }
        }

//        finalResults.putAll(startMap);

        SetMultimap<GraphNodeType,Set<GraphNode>> typeNodes = HashMultimap.create();
        typeNodes.put(type,Sets.newHashSet(startNodes));
        mergeBreadthFirstSearch(finalResults, limitLevel, maxNode, detail, callBackHandlers, typeNodes);
        return finalResults.keySet();
    }

    private void mergeBreadthFirstSearch(Map<GraphNode, Object> finalResults, Integer limitLevel, long maxNode, Boolean detail, List<INodeCallBackHandler> callBackHandlers, SetMultimap<GraphNodeType, Set<GraphNode>> typeNodes){
        if (limitLevel <= 0) {
            return;
        }

        if (finalResults.size() >= maxNode) {
            return;
        }

        limitLevel--;

        SetMultimap<GraphNodeType,Set<GraphNode>> nextTypeNodes = HashMultimap.create();

        for (Map.Entry<GraphNodeType,Set<GraphNode>> entry:typeNodes.entries()){
            SetMultimap<GraphNodeType,Set<GraphNode>> nextTypeNode = breadthFirstSearch(finalResults, limitLevel, detail, callBackHandlers, entry.getKey(), entry.getValue().toArray(new GraphNode[entry.getValue().size()]));
            if (nextTypeNode.size()>0){
                nextTypeNodes.putAll(nextTypeNode);
            }
        }

        if (nextTypeNodes.size()>0){
            mergeBreadthFirstSearch(finalResults, limitLevel, maxNode, detail, callBackHandlers, nextTypeNodes);
        }
    }

    private SetMultimap<GraphNodeType,Set<GraphNode>> breadthFirstSearch(Map<GraphNode, Object> finalResults, Integer limitLevel, Boolean detail, List<INodeCallBackHandler> callBackHandlers, GraphNodeType type, GraphNode... startNodes) {
        logger.info(String.format(" limitLevel=%s ; type=%s ; node=%s ;",limitLevel,type.getType(),Arrays.toString(startNodes)));

        SetMultimap<GraphNodeType,Set<GraphNode>> typeNodes = HashMultimap.create();

        Set<GraphRelation> relations = context.getRelation(type);
        for (GraphRelation relation : relations) {
            executorService.submit(new RelationTask(finalResults, startNodes, limitLevel, detail, relation, callBackHandlers));
        }

        for (int i = 0; i < relations.size(); i++) {
            Future<TempParam> future = null;
            try {
                //poll可以调整超时
                future = executorService.take();
                TempParam tempParam = future.get();
                Set<GraphNode> nextNodes = tempParam.getNextNodes();
                GraphRelation relation = tempParam.getRelation();

                if (nextNodes.size() == 0) {
                    continue;
                } else {
                    synchronized (finalResults) {
                        Map<GraphNode, Object> nextMap = Maps.asMap(nextNodes, new Function<GraphNode, Object>() {
                            @Override
                            public Object apply(GraphNode graphNode) {
                                return new Object();
                            }
                        });
                        finalResults.putAll(nextMap);
                    }
                    typeNodes.put(relation.getToType(),nextNodes);
                }
            } catch (InterruptedException e) {
                e.printStackTrace();
            } catch (ExecutionException e) {
                logger.error("startNodes:" + Arrays.toString(startNodes) + " error!", e);
                continue;
            }
        }
        return typeNodes;
    }

    class TempParam {
        private Set<GraphNode> nextNodes;
        private GraphRelation relation;

        public TempParam(Set<GraphNode> nextNodes, GraphRelation relation) {
            this.nextNodes = nextNodes;
            this.relation = relation;
        }

        public Set<GraphNode> getNextNodes() {
            return nextNodes;
        }

        public GraphRelation getRelation() {
            return relation;
        }
    }

    class RelationTask implements Callable<TempParam> {

        private GraphNode[] startNodes;

        private Integer limitLevel;

        private Boolean detail;

        private GraphRelation relation;

        private List<INodeCallBackHandler> callBackHandlers;

        private Map<GraphNode, Object> finalResults;

        private boolean first;

        public RelationTask(Map<GraphNode, Object> finalResults, GraphNode[] startNodes, Integer limitLevel, Boolean detail, GraphRelation relation, List<INodeCallBackHandler> callBackHandlers) {
            this(false, finalResults, startNodes, limitLevel, detail, relation, callBackHandlers);
        }

        public RelationTask(boolean first, Map<GraphNode, Object> finalResults, GraphNode[] startNodes, Integer limitLevel, Boolean detail, GraphRelation relation, List<INodeCallBackHandler> callBackHandlers) {
            this.first = first;
            this.finalResults = finalResults;
            this.startNodes = startNodes;
            this.limitLevel = limitLevel;
            this.detail = detail;
            this.relation = relation;
            this.callBackHandlers = callBackHandlers;
        }

        @Override
        public TempParam call() throws Exception {
            Set<GraphNode> loopNodes = Sets.newHashSet(startNodes);
            Set<GraphNode> nextNodes = relationService.search(first, finalResults, limitLevel, detail, relation, callBackHandlers, loopNodes.toArray(new GraphNode[loopNodes.size()]));
            return new TempParam(nextNodes, relation);
        }
    }

    public IRelationService getRelationService() {
        return relationService;
    }

    public void setRelationService(IRelationService relationService) {
        this.relationService = relationService;
    }

}
