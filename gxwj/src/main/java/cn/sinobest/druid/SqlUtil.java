package cn.sinobest.druid;

import com.google.common.base.Preconditions;
import jodd.util.StringUtil;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by zhouyi1 on 2016/6/22 0022.
 */
public class SqlUtil {

    public static String getNormSql(String sql){
        Preconditions.checkNotNull(sql);
        return sql.replaceAll("\\s*\\n\\s*"," ").trim();
    }

    public static String getNewSql(String newSqlTemp, Map<String, String> params,String defaultSql) {
        if (params.size()==0 || params.isEmpty()){
            return defaultSql;
        }
        if (StringUtil.isBlank(newSqlTemp)){
            return defaultSql;
        }
        for (Map.Entry<String,String> entry:params.entrySet()){
            newSqlTemp = newSqlTemp.replaceAll(entry.getKey(),entry.getValue());
        }
        return newSqlTemp;
    }

    public static String listToString(List<Byte> byteList){
        Byte[] valuebytes = new Byte[byteList.toArray().length];
        valuebytes = byteList.toArray(valuebytes);
        byte[] valuebytess = new byte[byteList.toArray().length];
        for (int j = 0; j < valuebytess.length; j++) {
            valuebytess[j] = valuebytes[j];
        }
        return new String(valuebytess);
    }

    public static Map<String, String> getParams(String sqlTemp,String oldSql,String sqlCharSet) {
        if (sqlCharSet==null){
            sqlCharSet = "UTF-8";
        }
        Map<String,String> params = new HashMap<String,String>();
        try {
            byte[] oldBytes = oldSql.getBytes(sqlCharSet);
            byte[] tempBytes = sqlTemp.getBytes(sqlCharSet);
            boolean matching = false;
            boolean firstTemp = false;
            byte next = 0;
            List<Byte> keyBytes = new ArrayList<Byte>();
            List<Byte> valueBytes = new ArrayList<Byte>();
            String key = null;
            String value;
            int index = 0;
            for (int i = 0; i < oldBytes.length; i++) {
                if (oldBytes[i]==next || oldBytes[i]==tempBytes[index]){
                    index++;
                    firstTemp = true;
                    continue;
                }else if (oldBytes[i]!=tempBytes[index]){
                    if (oldBytes[i]!=next){
                        valueBytes.add(oldBytes[i]);
                    }

                    if (i==oldBytes.length-1 && !firstTemp){
                        value = listToString(valueBytes);
//                        System.out.println("value = " + value);
                        params.put(key,value);
                    }else if (oldBytes[i+1]==next || oldBytes[i+1]==tempBytes[index]){
                        value = listToString(valueBytes);
//                        System.out.println("value = " + value);
                        params.put(key,value);
                        valueBytes.clear();
                        keyBytes.clear();
//                        matching = false;
                    }
                }

                if (firstTemp){
                    while(tempBytes[index]==":".getBytes()[0] || tempBytes[index]!="@".getBytes()[0]){
                        keyBytes.add(tempBytes[index++]);
                    }
                    keyBytes.add("@".getBytes()[0]);
                    if (index+1<tempBytes.length){
                        next = tempBytes[++index];
                    }else{
                        next = 0;
                    }
                    key = listToString(keyBytes);
//                    System.out.println("key = " + key);
                    firstTemp = false;
                }
            }
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        return params;
    }
}
