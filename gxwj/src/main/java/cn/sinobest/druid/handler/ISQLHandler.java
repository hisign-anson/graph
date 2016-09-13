package cn.sinobest.druid.handler;

import cn.sinobest.druid.SynonymSqlContext;

import java.util.List;
import java.util.Map;

/**
 * Created by zhouyi1 on 2016/6/23 0023.
 */
public interface ISQLHandler extends IHandler<String> {
    @Override
    String executeMatchSql(String target, Map.Entry<List<String>, String> sqlConfigEntry, SynonymSqlContext context);
}
