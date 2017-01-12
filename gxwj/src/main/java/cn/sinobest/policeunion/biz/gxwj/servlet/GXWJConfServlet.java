package cn.sinobest.policeunion.biz.gxwj.servlet;

import cn.sinobest.policeunion.biz.gxwj.graph.common.resource.GraphContext;
import cn.sinobest.policeunion.biz.gxwj.graph.common.resource.GraphRelation;
import com.google.common.collect.SetMultimap;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServlet;
import java.io.IOException;

/**
 * Created by zhouyi1 on 2016/7/11 0011.
 */
public class GXWJConfServlet extends HttpServlet {

    private static Log logger = LogFactory.getLog(GXWJConfServlet.class);
    WebApplicationContext context;

    @Override
    public void init(ServletConfig config) throws ServletException {
        super.init(config);
        context = WebApplicationContextUtils.getWebApplicationContext(config.getServletContext());
    }

    @Override
    public void service(ServletRequest req, ServletResponse res) throws ServletException, IOException {
        GraphContext graphContext = (GraphContext) context.getBean("gxwj.context");
        SetMultimap<String, GraphRelation> nodeStrConfig =  graphContext.getNodeStrConfig();
    }
}
