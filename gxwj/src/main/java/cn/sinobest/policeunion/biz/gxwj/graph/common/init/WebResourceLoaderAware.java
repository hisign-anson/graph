package cn.sinobest.policeunion.biz.gxwj.graph.common.init;

import org.springframework.context.ResourceLoaderAware;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;

/**
 * Created by zhouyi1 on 2016/1/21 0021.
 */
@Component
public class WebResourceLoaderAware implements ResourceLoaderAware {
    private static ResourceLoader loader;
    @Override
    public void setResourceLoader(ResourceLoader resourceLoader) {
        this.loader = resourceLoader;
    }
    public static ResourceLoader getLoader(){
        return loader;
    }
}
