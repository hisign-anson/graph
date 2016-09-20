package cn.sinobest.policeunion.biz.gxwj.graph.impl;

import cn.sinobest.policeunion.biz.gxwj.graph.common.resource.GraphNodeType;
import cn.sinobest.policeunion.biz.gxwj.graph.search.callback.INodeCallBackHandler;
import cn.sinobest.policeunion.biz.gxwj.graph.search.callback.impl.RelationCallBackHandler;
import cn.sinobest.policeunion.share.gxwj.graph.search.callback.po.RelationResult;
import cn.sinobest.policeunion.biz.gxwj.graph.search.service.IGraphSearcher;
import com.google.common.base.Function;
import com.google.common.collect.Maps;
import com.google.common.collect.Sets;
import jodd.util.StringUtil;
import cn.sinobest.policeunion.share.gxwj.graph.node.GraphNode;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import javax.annotation.Resource;
import java.util.*;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"classpath:applicationContext.xml"})
public class GraphDBBFSServiceTest {

    @Resource(name = "gxwj.DBBFSService")
    IGraphSearcher service;

    @Resource(name = "sfzh")
    GraphNodeType nodeType;

    @org.junit.Test
    public void testBreadthFirstSearch() throws Exception {
        RelationCallBackHandler callBackHandler = new RelationCallBackHandler();
        List<INodeCallBackHandler> handlers = new ArrayList<INodeCallBackHandler>();
        handlers.add(callBackHandler);
        Set<GraphNode> nodes = service.breadthFirstSearch(3, 1000, true, handlers, nodeType, new GraphNode("620103197809141011", "sfzh"));
        System.out.println("nodes = " + nodes);
        Map<Integer, RelationResult> relaNodes = callBackHandler.getRelationMap();
        for (RelationResult ss:relaNodes.values()){
            System.out.println(Arrays.toString(ss.getRelation()));
        }
    }

    @Test
    public void test4() throws ExecutionException, InterruptedException {
        String str1 = new String("1");
        String str2 = new String("2");
        String str3 = new String("3");
        HashSet hm = new HashSet();
        hm.add(str1);
        hm.add(str2);
        hm.add(str3);
        Map<String,Object> nextMap = Maps.asMap(hm, new Function<String, Object>() {
            @Override
            public Object apply(String graphNode) {
                return new Object();
            }
        });
        HashMap<String,Object> hms = new HashMap();
        hms.putAll(nextMap);

        String[] hmStrs = (String[]) hm.toArray(new String[hm.size()]);
        System.out.println(str1==hmStrs[0]);
        System.out.println(hms.keySet().iterator().next()==hmStrs[0]);

    }

    @Test
    public void test3() throws ExecutionException, InterruptedException {
        final HashSet hm = new HashSet();

        ExecutorService es = Executors.newScheduledThreadPool(50);
        List<Future> results = new ArrayList<Future>();
        for (int i = 0; i < 9999; i++) {
            final Integer j = new Integer(i);
            Future future = es.submit(new Runnable() {
                @Override
                public void run() {
                    hm.add(j);
                    System.out.println("num = " + j + ";hm = " + hm);
                }
            });
            results.add(future);
        }
    }

    @Test
    public void test2(){
        String str1 = "1";
        String str2 = "2";
        String[] sss1 = new String[]{str1,str2};
        String[] sss2 = new String[]{str2,str1};
        System.out.println(Arrays.hashCode(sss1));
        System.out.println(Arrays.hashCode(sss2));
        System.out.println("sss1.equals(sss2)====="+sss1.equals(sss2));
        System.out.println("sss1.hashCode()==sss2.hashCode()=====" + (sss1.hashCode() == sss2.hashCode()));
    }

    @Test
    public void test1(){
        String result = StringUtil.join(Sets.newHashSet(new GraphNode("id1","type1"),new GraphNode("id2","type2")),"','");
        System.out.println("result = " + result);
    }

    @Test
    public void test(){
        Set<Long> longs = Sets.newHashSet(1L,2L);
//        Map fromNodeMaps = Maps.asMap(Sets.newHashSet(longs), new Function<Object, Long>() {
//            @Override
//            public Long apply(Object node) {
//                Long node1 = (Long) node;
//                node = node1.toString();
//                return node1;
//            }
//        });

//        Map fromNodeMaps = Maps.toMap(longs.iterator(), new Function<Long, String>() {
//            @Override
//            public String apply(Long aLong) {
//                return aLong.toString();
//            }
//        });

        Map fromNodeMaps = Maps.uniqueIndex(longs.iterator(), new Function<Long,String>() {
            @Override
            public String apply(Long s) {
                return s.toString();
            }
        });

        Set sets = fromNodeMaps.keySet();
        Class stringClass = sets.iterator().next().getClass();
        System.out.println(stringClass);
    }
}