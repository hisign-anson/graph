package cn.sinobest.druid;

import org.springframework.beans.factory.InitializingBean;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by zhouyi1 on 2016/6/21 0021.
 */
public class SynonymSqlContext implements InitializingBean {
    private Map<List<String>,String> synonymTable = new HashMap<List<String>,String>();

    private String charSet = "UTF-8";

    @Override
    public void afterPropertiesSet() throws Exception {
        for (Map.Entry<List<String>,String> entry:synonymTable.entrySet()){
            List<String> sqlList = entry.getKey();
//            for (String sql:sqlList){
//                sql = SqlUtil.getNormSql(sql);
//            }
            for (int i = 0; i < sqlList.size(); i++) {
                String sql = sqlList.get(i);
                sql = SqlUtil.getNormSql(sql);
                sqlList.remove(i);
                sqlList.add(i,sql);
            }
        }
//        System.out.println(synonymTable);
    }

    public String getCharSet() {
        return charSet;
    }

    public void setCharSet(String charSet) {
        this.charSet = charSet;
    }

    public Map<List<String>, String> getSynonymTable() {
        return synonymTable;
    }

    public void setSynonymTable(Map<List<String>, String> synonymTable) {
        this.synonymTable = synonymTable;
    }
}
