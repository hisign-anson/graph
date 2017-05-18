package cn.sinobest.policeunion.biz.gxwj.servlet;

import cn.sinobest.policeunion.biz.gxwj.graph.common.init.SpringContextInit;
import cn.sinobest.policeunion.biz.gxwj.graph.core.Graph;
import cn.sinobest.policeunion.biz.gxwj.graph.core.pj.ValueNode;
import cn.sinobest.policeunion.biz.gxwj.graph.search.adapter.IGraphService;
import com.google.common.collect.Sets;

import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServlet;
import java.io.IOException;

/**
 * Created by zhouyi1 on 2016/7/11 0011.
 */
public class GXWJServlet extends HttpServlet {
    @Override
    public void service(ServletRequest req, ServletResponse res) throws ServletException, IOException {
//        super.service(req, res);
        Integer limitLevel = Integer.valueOf(req.getParameter("limitLevel"));
        long maxNode = Long.valueOf(req.getParameter("maxNode"));
        Boolean detail = Boolean.valueOf(req.getParameter("detail"));
        String startNodeValue = req.getParameter("nodeValue");
        String startNodeType = req.getParameter("nodeType");

        IGraphService service = (IGraphService) SpringContextInit.getBeanByAware("gxwj.graphService");
        Graph graph = service.breadthFirstSearch(limitLevel,maxNode,detail,startNodeType, Sets.newHashSet(new ValueNode(startNodeValue)));

        System.out.println(1);
    }
}
