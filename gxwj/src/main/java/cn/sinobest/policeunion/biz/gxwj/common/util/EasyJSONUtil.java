package cn.sinobest.policeunion.biz.gxwj.common.util;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONException;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.util.FieldInfo;
import com.alibaba.fastjson.util.TypeUtils;
import jodd.util.ObjectUtil;
import org.apache.commons.lang.ObjectUtils;

import java.lang.reflect.InvocationTargetException;
import java.util.Collection;
import java.util.List;

/**
 * Created by zy-xx on 17/7/25.
 */
public class EasyJSONUtil {

    public static class DefaultNameProcessFilterImpl implements NameProcessFilter{
        @Override
        public String process(String name, Object value) {
            return name;
        }
    }

    public static class DefaultApplyFilterImpl implements ApplyFilter{
        @Override
        public boolean apply(Object object, String name) {
            return true;
        }
    }

    public static class DefaultWriteBeforeFilterImpl implements WriteBeforeFilter{
        @Override
        public void writeBefore(JSONObject object) {
            return;
        }
    }

    public interface NameProcessFilter {
        String process(String name, Object value);
    }

    public interface ApplyFilter {
        boolean apply(Object object, String name);
    }

    public interface WriteBeforeFilter{
        void writeBefore(JSONObject object);
    }

    public static JSONObject getJSONObject(Object javaObject,NameProcessFilter nameProcessFilter,ApplyFilter applyFilter,WriteBeforeFilter writeBeforeFilter) {
        Class<?> clazz = javaObject.getClass();
        try {
            List<FieldInfo> getters = TypeUtils.computeGetters(clazz, null);

            JSONObject json = new JSONObject(getters.size());
            writeBeforeFilter.writeBefore(json);

            for (FieldInfo field : getters) {
                if (!applyFilter.apply(javaObject,field.getName())){
                    continue;
                }
                Object value = field.get(javaObject);
                Object jsonValue = JSON.toJSON(value);

                String newName = nameProcessFilter.process(field.getName(),jsonValue);

                json.put(newName, jsonValue);
            }

            return json;
        } catch (IllegalAccessException e) {
            throw new JSONException("toJSON error", e);
        } catch (InvocationTargetException e) {
            throw new JSONException("toJSON error", e);
        }
    }

    public static JSONArray getJSONArray(Object javaObject,NameProcessFilter nameProcessFilter,ApplyFilter applyFilter,WriteBeforeFilter writeBeforeFilter){
        if (javaObject instanceof Collection) {
            Collection<Object> collection = (Collection<Object>) javaObject;

            JSONArray array = new JSONArray(collection.size());

            for (Object item : collection) {
                Object jsonValue = getJSONObject(item,nameProcessFilter,applyFilter,writeBeforeFilter);
                array.add(jsonValue);
            }

            return array;
        }
        throw new JSONException(javaObject.getClass()+" can't instanceof java.util.Collection");

    }
}
