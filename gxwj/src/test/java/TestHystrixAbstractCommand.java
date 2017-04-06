import com.netflix.hystrix.HystrixCommandGroupKey;
import com.netflix.hystrix.HystrixObservableCommand;
import rx.Observable;

/**
 * Created by zy-xx on 17/4/3.
 */
public class TestHystrixAbstractCommand extends HystrixObservableCommand {
    protected TestHystrixAbstractCommand(HystrixCommandGroupKey group) {
        super(group);
    }

    @Override
    protected Observable construct() {
        return null;
    }
}
