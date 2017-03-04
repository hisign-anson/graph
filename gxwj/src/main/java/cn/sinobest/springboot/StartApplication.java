package cn.sinobest.springboot;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.support.SpringBootServletInitializer;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.netflix.hystrix.dashboard.EnableHystrixDashboard;
import org.springframework.context.annotation.ImportResource;
import org.springframework.core.annotation.Order;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;

/**
 * Created by zy-xx on 17/3/2.
 */
@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
@Order(2)
@EnableDiscoveryClient
@EnableHystrixDashboard
@ImportResource("classpath:applicationContext.xml")
public class StartApplication extends SpringBootServletInitializer {
    private static Class<StartApplication> applicationClass = StartApplication.class;

    public static void main(String[] strs){
        SpringApplication.run(applicationClass,strs);
    }

    @Override
    public void onStartup(ServletContext servletContext) throws ServletException {
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