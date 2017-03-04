package cn.sinobest.policeunion.biz.gxwj.controller;

import cn.sinobest.policeunion.biz.gxwj.graph.common.init.SpringContextInit;
import cn.sinobest.policeunion.biz.gxwj.graph.core.Graph;
import cn.sinobest.policeunion.biz.gxwj.graph.core.pj.GraphNode;
import cn.sinobest.policeunion.biz.gxwj.graph.search.adapter.IGraphService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by zy-xx on 17/3/2.
 */
@RestController
public class GXWJController {

    @RequestMapping("/getGraph")
    public Graph getGraph(Integer limitLevel,long maxNode,Boolean detail,String startNodeValue,String startNodeType){
        IGraphService service = (IGraphService) SpringContextInit.getBeanByAware("gxwj.graphService");
        Graph graph = service.breadthFirstSearch(limitLevel,maxNode,detail,startNodeType,new GraphNode(startNodeValue,startNodeValue+startNodeType));
        return graph;
    }
}
