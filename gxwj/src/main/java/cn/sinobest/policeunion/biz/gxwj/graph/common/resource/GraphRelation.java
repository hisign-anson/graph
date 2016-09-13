package cn.sinobest.policeunion.biz.gxwj.graph.common.resource;

import jodd.util.StringUtil;
import org.springframework.beans.factory.BeanNameAware;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by zhouyi1 on 2016/6/27 0027.
 */
public class GraphRelation implements BeanNameAware {
    String relationName;

    String pkColumn;

    String fromPKColumn;

    GraphNodeType fromType;

    String fromColumn;

    String toPKColumn;

    GraphNodeType toType;

    String toColumn;

    String relationSql;

    Map<String,Object> relationDetail = new HashMap<String, Object>();

    public String getPkColumn() {
        return pkColumn;
    }

    public void setPkColumn(String pkColumn) {
        this.pkColumn = pkColumn;
    }

    /**
     * 优先级依次是fromPKColumn,pkColumn,fromColumn
     * @return
     */
    public String getFromPKColumn() {
        return fromPKColumn==null?(getPkColumn()==null?getFromColumn():getPkColumn()):fromPKColumn;
    }

    public void setFromPKColumn(String fromPKColumn) {
        this.fromPKColumn = fromPKColumn;
    }

    public String getToPKColumn() {
        return toPKColumn==null?(getPkColumn()==null?getToColumn():getPkColumn()):toPKColumn;
    }

    public void setToPKColumn(String toPKColumn) {
        this.toPKColumn = toPKColumn;
    }

    public String getFromColumn() {
        return fromColumn;
    }

    public void setFromColumn(String fromColumn) {
        this.fromColumn = fromColumn;
    }

    public String getToColumn() {
        return toColumn;
    }

    public void setToColumn(String toColumn) {
        this.toColumn = toColumn;
    }

    public GraphNodeType getFromType() {
        return fromType;
    }

    public void setFromType(GraphNodeType fromType) {
        this.fromType = fromType;
    }

    public GraphNodeType getToType() {
        return toType;
    }

    public void setToType(GraphNodeType toType) {
        this.toType = toType;
    }

    public String getRelationName() {
        return relationName;
    }

    public Map<String, Object> getRelationDetail() {
        return relationDetail;
    }

    public void setRelationDetail(Map<String, Object> relationDetail) {
        this.relationDetail = relationDetail;
    }

    public String getRelationSql() {
        return relationSql;
    }

    public void setRelationSql(String relationSql) {
        this.relationSql = relationSql;
    }

    @Override
    public void setBeanName(String s) {
        if(StringUtil.isBlank(this.relationName)){
            this.relationName = s;
        }
    }
}
