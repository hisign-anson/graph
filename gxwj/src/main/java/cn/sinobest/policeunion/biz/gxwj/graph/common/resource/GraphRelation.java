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

    String tableId;

    Map<String,Object> relationDetail = new HashMap<String, Object>();

    public String getRelationPk() {
        return tableId+relationName;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(" | fromType = " + fromType);
        sb.append(" | fromColumn = " + fromColumn);
        sb.append(" | toType = " + toType);
        sb.append(" | toColumn = " + toColumn);
        sb.append(" | relationSql = " + relationSql);
        sb.append(" | tableId = " + tableId);
        sb.append(" | pkColumn = " + pkColumn);
        sb.append(" | relationName = " + relationName);
        return sb.toString();
    }

    public GraphRelation(GraphNodeType fromType, String fromColumn, GraphNodeType toType, String toColumn, String relationSql,String tableId) {
        this.fromType = fromType;
        this.fromColumn = fromColumn;
        this.toType = toType;
        this.toColumn = toColumn;
        this.relationSql = relationSql;
        this.tableId = tableId;
        this.relationName = tableId+"对应"+fromType+"和"+toType+"的关系";
    }

    public GraphRelation() {
    }

    public String getTableId() {
        return tableId==null?getRelationName():tableId;
    }

    public void setTableId(String tableId) {
        this.tableId = tableId;
    }

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
        return fromColumn==null?"":fromColumn;
    }

    public void setFromColumn(String fromColumn) {
        this.fromColumn = fromColumn;
    }

    public String getToColumn() {
        return toColumn==null?"":toColumn;
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

    public void setRelationName(String relationName) {
        this.relationName = relationName;
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
