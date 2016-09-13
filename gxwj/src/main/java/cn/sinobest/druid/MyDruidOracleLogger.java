package cn.sinobest.druid;

import com.alibaba.druid.pool.DruidDataSourceStatLogger;
import com.alibaba.druid.pool.DruidDataSourceStatLoggerImpl;
import com.alibaba.druid.pool.DruidDataSourceStatValue;
import com.alibaba.druid.stat.JdbcSqlStatValue;
import com.google.common.collect.Sets;
import jodd.util.StringUtil;
import org.springframework.jdbc.core.namedparam.BeanPropertySqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

/**
 * Created by zhouyi1 on 2016/1/18 0018.
 */
public class MyDruidOracleLogger extends DruidDataSourceStatLoggerImpl implements DruidDataSourceStatLogger {

    private static boolean alreadyChecked = false;

    private Connection conn = null;

    private static String insertSql = "";

    private ArrayList columnName = new ArrayList();

    private final String tableName = "B_DRUID_LOG";

    private NamedParameterJdbcTemplate jdbcTemplate;

    //没有字典集合的java语言只能用数组了
    private final String[] tableColumn = new String[]{"SYSTEMID", "VARCHAR2(50) not null", "Sql", "VARCHAR2(500)", "ExecuteCountMax", "NUMBER(10)", "ExecuteCountTotal", "NUMBER(10)", "ExecuteErrorCount", "NUMBER(10)", "RunningCount", "NUMBER(10)", "ConcurrentMax", "NUMBER(10)", "FetchRowCount", "NUMBER(10)", "FetchRowCountMax", "NUMBER(10)", "UpdateCount", "NUMBER(10)", "UpdateCountMax", "NUMBER(10)"};

    private final String tableSpace4Oracle = "tablespace TBS_GDXZ_DATA\n" +
            "  pctfree 10\n" +
            "  initrans 1\n" +
            "  maxtrans 255\n" +
            "  storage\n" +
            "  (\n" +
            "    initial 64K\n" +
            "    next 8K\n" +
            "    minextents 1\n" +
            "    maxextents unlimited\n" +
            "  )";

    public MyDruidOracleLogger(DataSource druidLoggerDatasource) {
        try {
            this.conn = druidLoggerDatasource.getConnection();
            this.jdbcTemplate = new NamedParameterJdbcTemplate(druidLoggerDatasource);
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public void init(){
        checkOracleTable();
    }

    @Override
    public void log(DruidDataSourceStatValue statValue) {
//        System.out.println("statValue = [" + statValue + "]");
        if (statValue.getSqlList().size() > 0) {
            List<JdbcSqlStatValue> sqlStatValue = statValue.getSqlList();
//                System.out.println("statValue.getSqlList():"+statValue.getSqlList());
//                System.out.println("statValue.getExecuteCount():" + statValue.getExecuteCount());
            SqlParameterSource[] sqlStateParams = new SqlParameterSource[sqlStatValue.size()];
            for (int i = 0; i < sqlStateParams.length; i++) {
                SqlParameterSource paramSource = new BeanPropertySqlParameterSource(sqlStatValue.get(i));
                sqlStateParams[i] = paramSource;
            }
            this.jdbcTemplate.batchUpdate(this.insertSql, sqlStateParams);
        }
        super.log(statValue);
    }

    //把INSERT和CREATE耦合到一起没什么原因，只因为懒
    private String getOracleTableSql() {
        String createSql = "create table " + this.tableName + "(\n";
        HashSet<String> columnSets = Sets.newHashSet();
//        CharMatcher.
        for (int i = 0; i < this.tableColumn.length; i++) {
            if (i % 2 == 0) {
                createSql += this.tableColumn[i] + "    ";
                if (i != 0) {
                    columnSets.add(this.tableColumn[i].trim().toLowerCase());
                }
            } else {
                createSql += this.tableColumn[i] + ",";
            }
        }
        createSql = createSql.substring(0, createSql.length() - 1);
//        createSql += (");");
        createSql += (")\n" + this.tableSpace4Oracle);
        this.insertSql = "insert into " + this.tableName + "(systemid," + StringUtil.join(columnSets, ",") + ")"
                + " values(getid(null),:"+StringUtil.join(columnSets, ",:")+")";
        return createSql;
    }

    /*
    * 看对应DS下是否有配置表，如果没有则创建，通过alreadyChecked来保证一次性
    * 纯conn
    * */
    private void checkOracleTable() {
        if (this.alreadyChecked)
            return;
        String createSql = getOracleTableSql();
        try {
            PreparedStatement ps = this.conn.prepareStatement("select 1 from " + this.tableName);
            ps.execute();
        } catch (SQLException e) {
            //表不存在
            if (e.getMessage().toLowerCase().indexOf("ora-00942") != -1) {
                try {
                    java.sql.Statement s = this.conn.createStatement();
                    s.execute(createSql);
                } catch (SQLException e1) {
                    e1.printStackTrace();
//                }finally {
//                    try {
//                        if (this.conn != null)
//                            this.conn.commit();
//                    } catch (SQLException e1) {
//                        e1.printStackTrace();
//                    }
                }
            } else {
                e.printStackTrace();
            }
        } finally {
            this.alreadyChecked = true;
            try {
                if (this.conn != null) {
                    this.conn.commit();
//                    this.conn.close();
                }
            } catch (SQLException e1) {
                e1.printStackTrace();
            }
        }
    }

}