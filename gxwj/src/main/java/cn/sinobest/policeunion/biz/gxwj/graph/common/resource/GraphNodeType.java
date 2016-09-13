package cn.sinobest.policeunion.biz.gxwj.graph.common.resource;

import jodd.util.StringUtil;
import org.springframework.beans.factory.BeanNameAware;

/**
 * Created by zhouyi1 on 2016/6/29 0029.
 */
public class GraphNodeType implements BeanNameAware {
    private String type;
//    private String pkColumnName;

    public GraphNodeType() {
    }

//    public GraphNodeType(String type, String pkColumnName) {
//        this.type = type;
//        this.pkColumnName = pkColumnName;
//    }

    public GraphNodeType(String type) {
        this.type = type;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type.toUpperCase();
    }

//    public String getPkColumnName() {
//        return pkColumnName;
//    }
//
//    public void setPkColumnName(String pkColumnName) {
//        this.pkColumnName = pkColumnName;
//    }

    @Override
    public String toString() {
        return type;
    }

    @Override
    public void setBeanName(String s) {
        if(StringUtil.isBlank(this.type)) {
            this.type = s;
        }
    }
}
