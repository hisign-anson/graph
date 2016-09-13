package cn.sinobest.druid.handler;

import cn.sinobest.druid.SynonymSqlContext;
import com.alibaba.druid.proxy.jdbc.StatementProxy;
import jodd.util.StringUtil;
import org.springframework.expression.EvaluationContext;
import org.springframework.expression.ExpressionParser;
import org.springframework.expression.spel.standard.SpelExpressionParser;
import org.springframework.expression.spel.support.StandardEvaluationContext;

import java.util.List;
import java.util.Map;

/**
 * Created by zhouyi1 on 2016/6/22 0022.
 */
public class StatementHandler implements IStatementHandler {
    public StatementProxy executeMatchSql(StatementProxy statement,Map.Entry<List<String>,String> sqlConfigEntry,SynonymSqlContext context){
        if (sqlConfigEntry.getKey().size()<3){
            return statement;
        }
        String express = sqlConfigEntry.getKey().get(2);
        if (StringUtil.isBlank(express)){
            return statement;
        }
        EvaluationContext evaluationContext = new StandardEvaluationContext(statement);
        ExpressionParser parser = new SpelExpressionParser();

        parser.parseExpression(express).getValue(evaluationContext,null);
        return statement;
    }
}
