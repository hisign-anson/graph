package cn.sinobest.policeunion.biz.gxwj.graph.core;

/**
 * Created by zhouyi1 on 2016/11/2 0002.
 */
public class Link {
    public Link() {
    }

    public Link(String style, String value, String time, String startType, String startValue, String stopType, String stopValue, String linkInfo, String linkId) {
        this.style = style;
        this.value = value;
        this.time = time;
        this.startType = startType;
        this.startValue = startValue;
        this.stopType = stopType;
        this.stopValue = stopValue;
        this.linkInfo = linkInfo;
        this.linkId = linkId;
    }

    private String style;
    private String value;
    private String time;
    private String startType;
    private String startValue;
    private String stopType;
    private String stopValue;
    private String linkInfo;
    private String linkId;

    public String getStyle() {
        return style;
    }

    public void setStyle(String style) {
        this.style = style;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public String getStartType() {
        return startType;
    }

    public void setStartType(String startType) {
        this.startType = startType;
    }

    public String getStartValue() {
        return startValue;
    }

    public void setStartValue(String startValue) {
        this.startValue = startValue;
    }

    public String getStopType() {
        return stopType;
    }

    public void setStopType(String stopType) {
        this.stopType = stopType;
    }

    public String getStopValue() {
        return stopValue;
    }

    public void setStopValue(String stopValue) {
        this.stopValue = stopValue;
    }

    public String getLinkInfo() {
        return linkInfo;
    }

    public void setLinkInfo(String linkInfo) {
        this.linkInfo = linkInfo;
    }

    public String getLinkId() {
        return linkId;
    }

    public void setLinkId(String linkId) {
        this.linkId = linkId;
    }
}
