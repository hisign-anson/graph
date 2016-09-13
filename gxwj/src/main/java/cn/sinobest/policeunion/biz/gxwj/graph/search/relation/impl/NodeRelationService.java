package cn.sinobest.policeunion.biz.gxwj.graph.search.relation.impl;

import cn.sinobest.policeunion.biz.gxwj.graph.common.resource.GraphRelation;
import cn.sinobest.policeunion.share.gxwj.graph.node.GraphNode;
import cn.sinobest.policeunion.biz.gxwj.graph.search.callback.INodeCallBackHandler;
import cn.sinobest.policeunion.biz.gxwj.graph.search.relation.IRelationService;
import com.google.common.base.Function;
import com.google.common.collect.Maps;
import com.google.common.collect.Sets;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.ColumnMapRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Created by zhouyi1 on 2016/6/27 0027.
 */
@Service(value = "gxwj.nodeRelationService")
public class NodeRelationService implements IRelationService {
    private static final Log logger = LogFactory.getLog(NodeRelationService.class);
    @Value("#{configProperties['maxSize']}")
    private Integer maxSize = Integer.MAX_VALUE;
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public Map<String,GraphNode> getFromNodeMap(final StringBuilder condition,final GraphRelation relation,GraphNode... fromNodes){
        final String conditionPartStr = relation.getFromColumn() + " in (";

        condition.append(" and (");
        condition.append(conditionPartStr);
        final Integer[] count = {new Integer(maxSize)};
        final Map<String,GraphNode> fromNodeMaps = Maps.uniqueIndex(Sets.newHashSet(fromNodes), new Function<GraphNode, String>() {
            @Override
            public String apply(GraphNode node) {
                condition.append("'");
                condition.append(node.getValue());
                if (--count[0]==0){
                    condition.append(") ");
                    condition.append("or "+conditionPartStr);
                    count[0] = maxSize;
                }else {
                    condition.append("',");
                }
                return node.getValue();
            }
        });
        if (condition.lastIndexOf(",")==condition.length()-1){
            condition.deleteCharAt(condition.length() - 1);
            condition.append("))");
        }else {
            condition.delete(condition.length() - ("or " + conditionPartStr).length(), condition.length());
            condition.append(")");
        }
        return fromNodeMaps;
    }

    private boolean fromSetAble(GraphNode... graphNodes){
        return graphNodes[0].getNodes().isEmpty();
    }

    @Override
    public Set<GraphNode> search(Map<GraphNode,Object> noNeedSearchMap, final Integer level,final Boolean detail, final GraphRelation relation, final List<INodeCallBackHandler> callBackHandlers, final GraphNode... fromNodes) {
        final Set<GraphNode> nextNodes = Sets.newHashSet();
        if (fromNodes.length==0){
            logger.error("资源："+relation.getRelationName()+"的node为空！");
            return nextNodes;
        }
        final Set<GraphNode> noNeedSearchNode = noNeedSearchMap.keySet();
        final StringBuilder condition = new StringBuilder();
        final Map<String,GraphNode> fromNodeMaps = getFromNodeMap(condition,relation,fromNodes);

        StringBuilder conditionNoNeed = new StringBuilder();
//        if (noNeedSearchNode.size()>0){
//            conditionNoNeed.append(" and ");
//            conditionNoNeed.append(relation.getToType().getPkColumnName() + " not in ('");
//            conditionNoNeed.append(StringUtil.join(noNeedSearchNode,"'',"));
//            conditionNoNeed.append("')");
//        }

        String sql = relation.getRelationSql()+condition.toString()+conditionNoNeed.toString();
        logger.trace("dig sql:"+sql);

        jdbcTemplate.query(sql, new ColumnMapRowMapper() {
            @Override
            public Map<String, Object> mapRow(ResultSet rs, int rowNum) throws SQLException {
                Map<String, Object> maps = super.mapRow(rs, rowNum);
                String toNodePkValue = maps.get(relation.getToPKColumn())==null?null:maps.get(relation.getToPKColumn()).toString();
                String toNodeValue = maps.get(relation.getToColumn())==null?null:maps.get(relation.getToColumn()).toString();
                String fromNodeValue = maps.get(relation.getFromColumn())==null?null:maps.get(relation.getFromColumn()).toString();
                GraphNode nodeFrom = fromNodeMaps.get(fromNodeValue);
                GraphNode nodeTo = null;
                if (fromSetAble(fromNodes)){
                    String fromNodePkValue = maps.get(relation.getFromPKColumn())==null?null:maps.get(relation.getFromPKColumn()).toString();
                    nodeFrom.addNode(detail?maps:null,fromNodePkValue);
                }
                if (toNodeValue!=null){
                    nodeTo = new GraphNode(toNodeValue, relation.getToType().toString());
                    nodeTo.addNode(detail?maps:null,toNodePkValue);
                }
                if (nodeTo!=null && !noNeedSearchNode.contains(nodeTo)){
                    nextNodes.add(nodeTo);
                    for (INodeCallBackHandler callBackHandler:callBackHandlers){
                        callBackHandler.nodeCallBack(nodeFrom, nodeTo,level,relation.getRelationName());
                    }
                }
                return maps;
            }
        });
        return nextNodes;
    }
}
