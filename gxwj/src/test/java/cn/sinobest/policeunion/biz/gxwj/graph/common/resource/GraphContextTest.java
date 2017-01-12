package cn.sinobest.policeunion.biz.gxwj.graph.common.resource;

import com.google.common.collect.HashMultimap;
import com.google.common.collect.SetMultimap;
import jodd.util.StringUtil;
import org.junit.Test;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class GraphContextTest {

    @Test
    public void testInit() throws Exception {
        SetMultimap<String, String> nodeStrConfig = HashMultimap.create();
        nodeStrConfig.put("key1","value1");
        nodeStrConfig.put("key1","value2");
        nodeStrConfig.put("key2","value1");
        nodeStrConfig.put("key2","value2");

        for (Map.Entry<String, String> entry:nodeStrConfig.entries()){
            System.out.println("key:" + entry.getKey() + "       value:"+entry.getValue());
        }


        List<String> columns = new ArrayList<String>();
        columns.add("COLUMNA");
        columns.add("COLUMNB");
        columns.add("COLUMNC");
        String joinStr = StringUtil.join(columns, ",");
        String sql = String.format("select %s from %s where 1=1 ", joinStr.substring(1, joinStr.length()-2), "tablename");
        System.out.println("sql = " + sql);
    }
}