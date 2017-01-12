package cn.sinobest.policeunion.biz.gxwj.graph.search.relation.impl;

import cn.sinobest.policeunion.biz.gxwj.graph.common.resource.GraphRelation;
import cn.sinobest.policeunion.biz.gxwj.graph.search.callback.INodeCallBackHandler;
import cn.sinobest.policeunion.biz.gxwj.graph.search.relation.IRelationService;
import cn.sinobest.policeunion.share.gxwj.graph.node.GraphNode;
import com.google.common.base.Function;
import com.google.common.collect.Maps;
import com.google.common.collect.Sets;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.ColumnMapRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;

/**
 * Created by zhouyi1 on 2016/6/27 0027.
 */
@Service(value = "gxwj.nodeRelationService")
public class NodeRelationService implements IRelationService {
    private static final Log logger = LogFactory.getLog(NodeRelationService.class);
    @Value("#{configProperties['maxSize']}")
    private Integer maxSize = Integer.MAX_VALUE;
    @Resource(name = "jdbcTemplate")
    private JdbcTemplate jdbcTemplate;

    public Map<String, GraphNode> getFromNodeMap(final StringBuilder condition, final GraphRelation relation, GraphNode... fromNodes) {
        final String conditionPartStr = relation.getFromColumn() + " in (";

        condition.append(" and (");
        condition.append(conditionPartStr);
        final Integer[] count = {new Integer(maxSize)};
        final Map<String, GraphNode> fromNodeMaps = Maps.uniqueIndex(Sets.newHashSet(fromNodes), new Function<GraphNode, String>() {
            @Override
            public String apply(GraphNode node) {
                condition.append("'");
                condition.append(node.getValue());
                if (--count[0] == 0) {
                    condition.append(") ");
                    condition.append("or " + conditionPartStr);
                    count[0] = maxSize;
                } else {
                    condition.append("',");
                }
                return node.getValue();
            }
        });
        if (condition.lastIndexOf(",") == condition.length() - 1) {
            condition.deleteCharAt(condition.length() - 1);
            condition.append("))");
        } else {
            condition.delete(condition.length() - ("or " + conditionPartStr).length(), condition.length());
            condition.append(")");
        }
        return fromNodeMaps;
    }

    private boolean fromSetAble(GraphNode... graphNodes) {
        return graphNodes[0].getNodes().isEmpty();
    }

    @Value("#{configProperties['limitSQL']}")
    private String limitSQL;

//    @Override
//    public Set<GraphNode> search(Map<GraphNode,Object> noNeedSearchMap, final Integer level,final Boolean detail, final GraphRelation relation, final List<INodeCallBackHandler> callBackHandlers, final GraphNode... fromNodes) {
//        return this.search(false,noNeedSearchMap,level,detail,relation,callBackHandlers,fromNodes);
//    }

    public Set<GraphNode> search(final boolean first, final Map<GraphNode, Object> noNeedSearchMap, final Integer level, final Boolean detail, final GraphRelation relation, final List<INodeCallBackHandler> callBackHandlers,final long maxNode, final GraphNode... fromNodes) {
        final Set<GraphNode> nextNodes = Sets.newHashSet();
        if (fromNodes.length == 0) {
            logger.error("source:" + relation.getRelationName() + "'s node is null!");
            return nextNodes;
        }
        final Set<GraphNode> noNeedSearchNode = noNeedSearchMap.keySet();
        final StringBuilder condition = new StringBuilder();
        final Map<String, GraphNode> fromNodeMaps = getFromNodeMap(condition, relation, fromNodes);

        StringBuilder conditionNoNeed = new StringBuilder();
//        if (noNeedSearchNode.size()>0){
//            conditionNoNeed.append(" and ");
//            conditionNoNeed.append(relation.getToType().getPkColumnName() + " not in ('");
//            conditionNoNeed.append(StringUtil.join(noNeedSearchNode,"'',"));
//            conditionNoNeed.append("')");
//        }

        String sql = relation.getRelationSql() + condition.toString() + conditionNoNeed.toString();
        logger.trace("level:"+level);
        logger.trace("relation:"+relation.getFromType()+"-"+relation.getToType());
        logger.trace("dig sql:" + sql + " " + limitSQL);

        try {

            jdbcTemplate.query(sql + " " + limitSQL, new ColumnMapRowMapper() {
                @Override
                public Map<String, Object> mapRow(ResultSet rs, int rowNum) throws SQLException {
                    Map<String, Object> maps = super.mapRow(rs, rowNum);
                    List<String> toNodePkValues = getNodeValues(maps, relation.getToPKColumn());
                    Iterator<String> iteratorToNodePkValues = toNodePkValues.iterator();
//                String toNodePkValue = maps.get(relation.getToPKColumn()) == null ? "" : maps.get(relation.getToPKColumn()).toString();
//                String toNodeValue = maps.get(relation.getToColumn())==null?null:maps.get(relation.getToColumn()).toString();
                    List<String> toNodeValues = getNodeValues(maps, relation.getToColumn());
                    String fromNodeValue = maps.get(relation.getFromColumn()) == null ? null : maps.get(relation.getFromColumn()).toString();
                    GraphNode nodeFrom = fromNodeMaps.get(fromNodeValue);
                    String fromNodePkValue = maps.get(relation.getFromPKColumn()) == null ? "" : maps.get(relation.getFromPKColumn()).toString();
//                Set<GraphNode> nodeTos = Sets.newHashSet();
                    if (first) {
                        if (fromNodeValue != null) {
                            synchronized (nodeFrom) {
                                nodeFrom.addNode(relation.getTableId(), detail ? maps : null, fromNodePkValue);
//                                nodeFrom.addNode(relation.getRelationName(), detail ? maps : null, fromNodePkValue);
//                                if (noNeedSearchNode.size()+nextNodes.size()>=maxNode){
//                                    return maps;
//                                }
                                nextNodes.add(nodeFrom);
                            }
                        }
                    } else {
                        nodeFrom.addNode(relation.getTableId(), detail ? maps : null, fromNodePkValue);
                        if (!toNodeValues.isEmpty() && toNodeValues.size() > 0) {
                            for (String toNodeValue : toNodeValues) {
                                GraphNode nodeTo = new GraphNode(toNodeValue, relation.getToType().toString());
                                String toNodePkValue = iteratorToNodePkValues.hasNext() ? iteratorToNodePkValues.next() : toNodePkValues.get(0);
                                nodeTo.addNode(relation.getTableId(), detail ? maps : null, toNodePkValue);
//                                nodeTo.addNode(relation.getRelationName(), detail ? maps : null, toNodePkValue);
                                synchronized (noNeedSearchNode) {
                                    if (!noNeedSearchNode.contains(nodeTo)) {
//                                        if (noNeedSearchNode.size()+nextNodes.size()>=maxNode){
//                                            return maps;
//                                        }
                                        nextNodes.add(nodeTo);
//                                    }else {
//                                        GraphNode graphNode = noNeedSearchMap.get(nodeTo);

                                    }
                                }
                                for (INodeCallBackHandler callBackHandler : callBackHandlers) {
                                    logger.debug("callbackHandler!");
                                    callBackHandler.nodeCallBack(nodeFrom, nodeTo, level, relation.getRelationName());
                                }
                            }
                        }
                    }
                    return maps;
                }
            });
        } catch (Exception e) {
            logger.error(e);
        }
        return nextNodes;
    }

    private List<String> getNodeValues(Map<String, Object> maps, String column) {
        logger.trace("column:"+column);
        List<String> nodeValues = new ArrayList<String>();
        for (String columnName : column.split(",")) {
            String columnValue = maps.get(columnName) == null ? null : maps.get(columnName).toString();
            if (columnValue != null) {
                nodeValues.add(columnValue);
            }
        }
        return nodeValues;
    }
}
