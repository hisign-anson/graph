package cn.sinobest.springboot;

import cn.sinobest.policeunion.biz.gxwj.servlet.GXWJConfServlet;
import com.alibaba.druid.support.http.StatViewServlet;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.support.SpringBootServletInitializer;
import org.springframework.cloud.netflix.hystrix.dashboard.EnableHystrixDashboard;
import org.springframework.context.annotation.ImportResource;
import org.springframework.web.util.Log4jConfigListener;
import org.springframework.web.util.Log4jWebConfigurer;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletRegistration;

/**
 * Created by zy-xx on 17/3/2.
 */
@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
//@EnableDiscoveryClient
@EnableHystrixDashboard
@ImportResource("classpath:applicationContext.xml")
public class StartApplication extends SpringBootServletInitializer {
    private static Class<StartApplication> applicationClass = StartApplication.class;

    public static void main(String[] strs){
//        SpringApplication.run(applicationClass,strs);
        new SpringApplicationBuilder(applicationClass).web(true).run(strs);
    }

    @Override
    public void onStartup(ServletContext servletContext) throws ServletException {
        servletContext.setInitParameter("webAppRootKey","webapp.root");
        servletContext.setInitParameter("log4jConfigLocation", "classpath:log4j.properties");
        servletContext.setInitParameter("log4jRefreshInterval", "60000");
        servletContext.addListener(Log4jConfigListener.class);
        Log4jWebConfigurer.initLogging(servletContext);

        ServletRegistration.Dynamic dynamicDruid = servletContext.addServlet("DruidStatView",new StatViewServlet());
        dynamicDruid.setInitParameter("loginUsername","admin");
        dynamicDruid.setInitParameter("loginPassword","sinobest2015");
        dynamicDruid.addMapping("/druid/*");

        ServletRegistration.Dynamic dynamicTest = servletContext.addServlet("TestConfServlet",new GXWJConfServlet());
        dynamicTest.addMapping("/testConf");

        super.onStartup(servletContext);
    }

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
        return builder.sources(applicationClass);
    }
}

//public class StartApplication {
//
//}