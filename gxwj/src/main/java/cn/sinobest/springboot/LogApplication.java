package cn.sinobest.springboot;

import org.springframework.core.annotation.Order;
import org.springframework.web.WebApplicationInitializer;
import org.springframework.web.util.Log4jConfigListener;
import org.springframework.web.util.Log4jWebConfigurer;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;

/**
 * Created by zy-xx on 17/3/3.
 */
@Order(1)
public class LogApplication implements WebApplicationInitializer {
    @Override
    public void onStartup(ServletContext servletContext) throws ServletException {
        servletContext.setInitParameter("webAppRootKey","webapp.root");
        servletContext.setInitParameter("log4jConfigLocation", "classpath:log4j.properties");
        servletContext.setInitParameter("log4jRefreshInterval", "60000");
        servletContext.addListener(Log4jConfigListener.class);
        Log4jWebConfigurer.initLogging(servletContext);
    }
}
