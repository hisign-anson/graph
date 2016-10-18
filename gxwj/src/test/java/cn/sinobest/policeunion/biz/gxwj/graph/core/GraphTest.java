package cn.sinobest.policeunion.biz.gxwj.graph.core;

import com.google.common.collect.LinkedListMultimap;
import com.google.common.collect.Multimap;
import org.junit.Test;

public class GraphTest {

    @Test
    public void testGetSumNode() throws Exception {
        Multimap<String,String> edges = LinkedListMultimap.create();
        edges.put("1","2");
        edges.put("1","3");
        System.out.println(edges.keySet().size());
    }
}