import cn.sinobest.policeunion.biz.gxwj.graph.core.Graph;
import cn.sinobest.policeunion.biz.gxwj.graph.core.pj.GraphNode;
import jodd.util.collection.SortedArrayList;
import org.junit.Test;

import java.util.Comparator;
import java.util.Set;

/**
 * Created by zy-xx on 17/5/12.
 */
public class TestGraph {

    @Test
    public void testGraph(){
        Graph graph = new Graph();
        graph.addEdge(new GraphNode("430102198704020515","pk2","sfzh"),new GraphNode("粤A8GX45","pk2","cph"),"table2");
        graph.addEdge(new GraphNode("430102198704020515","pk1","sfzh"),new GraphNode("粤A8GX15","pk1","cph"),"table1");
        graph.addEdge(new GraphNode("430102198704020514","pk3","sfzh"),new GraphNode("粤A8GX15","pk3","cph"),"table1");
        graph.addEdge(new GraphNode("430102198704020519","pk4","sfzh"),new GraphNode("粤A8GX35","pk4","cph"),"table3");
        Set<GraphNode> nodeSet = graph.getNodes();
    }

    private SortedArrayList<GraphNode> sortSet(Set<GraphNode> nodeSet){
        Comparator comparator = new Comparator<GraphNode>() {
            @Override
            public int compare(GraphNode o1, GraphNode o2) {
                if (o1.getValue().equals(o2.getValue())){
                    if (o1.getType().equals(o2.getType())){
                        return o1.getPkValue().hashCode()-o2.getPkValue().hashCode();
                    }else {
                        return o1.getType().hashCode()-o2.getType().hashCode();
                    }
                }else {
                    return o1.getValue().hashCode()-o2.getValue().hashCode();
                }
            }
        };
        SortedArrayList<GraphNode> sortedArrayList = new SortedArrayList<>(comparator);
        return sortedArrayList;
    }
}
