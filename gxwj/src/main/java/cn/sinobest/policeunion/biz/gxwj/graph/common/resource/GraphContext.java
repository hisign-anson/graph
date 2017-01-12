package cn.sinobest.policeunion.biz.gxwj.graph.common.resource;

import cn.sinobest.policeunion.biz.gxwj.graph.common.init.SpringContextInit;
import com.google.common.collect.HashMultimap;
import com.google.common.collect.Lists;
import com.google.common.collect.SetMultimap;
import com.google.common.collect.Sets;
import jodd.util.StringUtil;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Created by zhouyi1 on 2016/6/27 0027.
 */
@Service(value = "gxwj.context")
//@Lazy
public class GraphContext {
    private static final Log logger = LogFactory.getLog(GraphContext.class);
    public final static String defaultRelation = "normalRelation";

    private final String typeParam = "SXBS";

    private final String typeNameParam = "SJXMC";

    private final String tableNameParam = "TNAME";

    private final String tableIdParam = "ZYZLDM";

    private SetMultimap<String, GraphRelation> nodeStrConfig = HashMultimap.create();

    @Resource(name = "jdbcTemplateConf")
    private JdbcTemplate jdbcTemplate;

    @PostConstruct
    public void init() {
//        springInit();
        dbInit();
    }

    public SetMultimap<String, GraphRelation> getNodeStrConfig(){
        return nodeStrConfig;
    }

    private void springInit(){
        ApplicationContext context = SpringContextInit.getContext();
        Map<String, GraphRelation> relationMap = context.getBeansOfType(GraphRelation.class);
        for (GraphRelation relation : relationMap.values()) {
            nodeStrConfig.put(relation.getFromType().toString(), relation);
        }
    }

    private void dbInit(){
        List<String> nodeTypes = getNodeTypes();
        for (String fromNodeType : nodeTypes) {
            GraphNodeType fromGraphNodeType = new GraphNodeType(fromNodeType);
            List<Map<String, Object>> fromNodeTypeNames = getNodeTypeNames(fromNodeType);
            for (Map<String, Object> fromNodeTypeName : fromNodeTypeNames) {
                String sxbs = null;
                String fromTypeName = fromNodeTypeName.get(typeNameParam) == null ? "" : fromNodeTypeName.get(typeNameParam).toString();
                String tableName = fromNodeTypeName.get(tableNameParam) == null ? "" : fromNodeTypeName.get(tableNameParam).toString();
                String tableId = fromNodeTypeName.get(tableIdParam) == null ? "" : fromNodeTypeName.get(tableIdParam).toString();
                String sql = getSql(tableName);
                String pkColumn = getPkColumn(tableName);
                List<Map<String, Object>> toNodeTypeNames = getRelationNodeTypeNames(fromNodeType, fromTypeName, tableName);
                List<String> toTypeName = Lists.newArrayList();
                for (int i = 0; i < toNodeTypeNames.size(); i++) {
                    Map<String, Object> toNodeTypeNameMap = toNodeTypeNames.get(i);
                    Map<String, Object> nextToNodeTypeNameMap = i == toNodeTypeNames.size() - 1 ? null : toNodeTypeNames.get(i + 1);
                    String toNodeTypeName = toNodeTypeNameMap.get(typeNameParam) == null ? "" : toNodeTypeNameMap.get(typeNameParam).toString();
                    String toNodeType = toNodeTypeNameMap.get(typeParam) == null ? "" : toNodeTypeNameMap.get(typeParam).toString();
                    String nextToNodeType = nextToNodeTypeNameMap == null || nextToNodeTypeNameMap.get(typeParam) == null ? "" : nextToNodeTypeNameMap.get(typeParam).toString();
                    toTypeName.add(toNodeTypeName);
                    sxbs = toNodeType;
                    if (nextToNodeTypeNameMap == null || !nextToNodeType.equals(sxbs)) {
                        String toColumn = StringUtil.join(toTypeName, ",");
                        GraphRelation relation = new GraphRelation(fromGraphNodeType, fromTypeName, new GraphNodeType(toNodeType), toColumn.substring(1, toColumn.length()-2), sql, tableId);
                        relation.setPkColumn(pkColumn);
                        nodeStrConfig.put(fromGraphNodeType.toString(), relation);
//                        relation.setFromPKColumn(fromTypeName);
//                        relation.setToPKColumn(StringUtil.join(toTypeName, ","));
                        toTypeName.clear();
                    }
                }
            }
        }

        for (Map.Entry<String, GraphRelation> entry:nodeStrConfig.entries()){
            logger.info("key:" + entry.getKey() + "       value:"+entry.getValue());
        }
    }

    private String getPkColumn(String tableName) {
        String pkColumn = null;
        try {
            pkColumn = jdbcTemplate.queryForObject("select sjxmc from FW_SJZYSJXJ where tname = ? and PRIMARYKEY='1' and rownum=1", String.class, tableName);
        } catch (Exception e) {
            logger.error(e);
            return pkColumn;
        }
        return pkColumn;
    }

    private String getSql(String tableName) {
        List<String> columns = jdbcTemplate.queryForList("select t.sjxmc from FW_SJZYSJXJ t where t.tname = ?\n", String.class, tableName);
        String joinStr = StringUtil.join(columns, ",");
        String sql = String.format("select %s from %s where 1=1 ", joinStr.substring(1, joinStr.length() - 2), tableName);
        return sql;
    }

    private List<Map<String, Object>> getRelationNodeTypeNames(String nodeType, String nodeTypeName, String tableName) {
        return jdbcTemplate.queryForList("select t.tname, t.sjxmc, t.sjxzwmc, t.sxbs\n" +
                "  from FW_SJZYSJXJ t\n" +
                " where t.sxbs <> ? and t.tname=?\n" +
                "   and exists (select 1\n" +
                "          from FW_SJZYSJXJ t2\n" +
                "         where t2.sjxmc = ? and t2.tname=?\n" +
                "           and t2.zyzldm = t.zyzldm)\n" +
                " order by t.sxbs", nodeType, tableName, nodeTypeName, tableName);
    }

    private List<Map<String, Object>> getNodeTypeNames(String nodeType) {
        return jdbcTemplate.queryForList("select t.tname,t.sjxmc,t.zyzldm\n" +
                "  from FW_SJZYSJXJ t\n" +
                " where t.sxbs = ?", nodeType);
    }

    private List<String> getNodeTypes() {
        return jdbcTemplate.queryForList("select sxbs from FW_SX_SJY_CONFIG", String.class);
    }

    public Set<GraphRelation> getRelation(GraphNodeType type) {
//        jdbcTemplate.queryForList(sql);
        return nodeStrConfig.get(type.toString()) == null ? Sets.<GraphRelation>newHashSet() : nodeStrConfig.get(type.toString());
    }
}
