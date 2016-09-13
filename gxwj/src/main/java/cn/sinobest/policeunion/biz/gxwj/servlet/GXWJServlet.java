package cn.sinobest.policeunion.biz.gxwj.servlet;

import cn.sinobest.policeunion.biz.gxwj.graph.common.init.SpringContextInit;
import cn.sinobest.policeunion.biz.gxwj.graph.common.resource.GraphNodeType;
import cn.sinobest.policeunion.share.gxwj.graph.node.GraphNode;
import cn.sinobest.policeunion.biz.gxwj.graph.search.callback.INodeCallBackHandler;
import cn.sinobest.policeunion.biz.gxwj.graph.search.callback.impl.RelationCallBackHandler;
import cn.sinobest.policeunion.share.gxwj.graph.search.callback.po.RelationResult;
import cn.sinobest.policeunion.biz.gxwj.graph.search.service.IGraphSearcher;

import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServlet;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.*;

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

        IGraphSearcher service = (IGraphSearcher) SpringContextInit.getBeanByAware("gxwj.DBBFSService");

        RelationCallBackHandler callBackHandler = new RelationCallBackHandler();
        List<INodeCallBackHandler> handlers = new ArrayList<INodeCallBackHandler>();
        handlers.add(callBackHandler);
        long startTime = System.currentTimeMillis();
        Set<GraphNode> nodes = service.breadthFirstSearch(limitLevel, maxNode, detail, handlers, new GraphNodeType(startNodeType), new GraphNode(startNodeValue, startNodeType));
//        System.out.println("nodes = " + nodes);
        Map<Integer, RelationResult> relaNodes = callBackHandler.getRelationMap();

        PrintWriter printWriter = res.getWriter();
        printWriter.write("<h1>costTime[seconds]</h1>");
        printWriter.write(String.valueOf((System.currentTimeMillis() - startTime) / 1000));
        printWriter.write("<br>");
        printWriter.write("<br>");
        printWriter.write("<h1>resultNodes</h1>");
        printWriter.write(nodes.toString());
        printWriter.write("<br>");
        printWriter.write("<br>");
        printWriter.write("<br>");
        printWriter.write("<h1>resultRelations</h1>");
        for (RelationResult ss : relaNodes.values()) {
            printWriter.write(ss.getRelationName() + ":" + Arrays.toString(ss.getRelation()));
            printWriter.write("<br>");
        }
    }
}
