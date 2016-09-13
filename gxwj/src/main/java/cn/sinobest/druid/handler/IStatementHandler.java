package cn.sinobest.druid.handler;

import cn.sinobest.druid.SynonymSqlContext;
import com.alibaba.druid.proxy.jdbc.StatementProxy;

import java.util.List;
import java.util.Map;

/**
 * Created by zhouyi1 on 2016/6/22 0022.
 */
public interface IStatementHandler extends IHandler<StatementProxy> {
    @Override
    StatementProxy executeMatchSql(StatementProxy target, Map.Entry<List<String>, String> sqlConfigEntry, SynonymSqlContext context);
}
