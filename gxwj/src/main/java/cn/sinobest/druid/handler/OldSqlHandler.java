package cn.sinobest.druid.handler;

import cn.sinobest.druid.SqlUtil;
import cn.sinobest.druid.SynonymSqlContext;

import java.util.List;
import java.util.Map;

/**
 * Created by zhouyi1 on 2016/6/22 0022.
 */
public class OldSqlHandler implements ISQLHandler {
    @Override
    public String executeMatchSql(String oldSql, Map.Entry<List<String>, String> sqlConfigEntry,SynonymSqlContext context) {
        String newSql = null;
        Map<String,String> params = SqlUtil.getParams(sqlConfigEntry.getKey().get(0), oldSql, context.getCharSet());
        String newSqlTemp = sqlConfigEntry.getValue();
        newSql = SqlUtil.getNewSql(newSqlTemp, params, oldSql);
        return newSql;
    }
}
