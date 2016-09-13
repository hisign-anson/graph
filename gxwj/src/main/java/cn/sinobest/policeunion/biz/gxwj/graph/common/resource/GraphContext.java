package cn.sinobest.policeunion.biz.gxwj.graph.common.resource;

import cn.sinobest.policeunion.biz.gxwj.graph.common.init.SpringContextInit;
import com.google.common.collect.HashMultimap;
import com.google.common.collect.SetMultimap;
import com.google.common.collect.Sets;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Lazy;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.Map;
import java.util.Set;

/**
 * Created by zhouyi1 on 2016/6/27 0027.
 */
@Service(value = "gxwj.context")
@Lazy
public class GraphContext {
    public final static String defaultRelation = "normalRelation";

    private SetMultimap<String,GraphRelation> nodeStrConfig = HashMultimap.create();

    @Autowired
    private JdbcTemplate jdbcTemplate;

//    private String sql="";

    @PostConstruct
    public void init(){
        ApplicationContext context = SpringContextInit.getContext();
        Map<String,GraphRelation> relationMap = context.getBeansOfType(GraphRelation.class);
        for(GraphRelation relation:relationMap.values()){
            nodeStrConfig.put(relation.getFromType().toString(),relation);
        }
    }

    public Set<GraphRelation> getRelation(GraphNodeType type){
//        jdbcTemplate.queryForList(sql);
        return nodeStrConfig.get(type.toString())==null? Sets.<GraphRelation>newHashSet():nodeStrConfig.get(type.toString());
    }
}
