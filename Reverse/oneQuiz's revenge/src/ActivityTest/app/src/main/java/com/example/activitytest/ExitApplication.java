package com.example.activitytest;

import java.util.LinkedList;
import java.util.List;

import android.app.Activity;
import android.app.Application;

public class ExitApplication extends Application {
    private List activityList = new LinkedList();
    private static ExitApplication instance;

    private ExitApplication() {
    }

    //单例模式中获取唯一的ExitApplication实例
    public static ExitApplication getInstance() {
        if (null == instance) {
            instance = new ExitApplication();
        }
        return instance;
    }

    //添加Activity到容器中
    public void addActivity(Activity activity) {
        activityList.add(activity);
    }

    //遍历所有Activity并finish
    public void exit() {
        for (Object activity : activityList) {
            ((Activity)activity).finish();
        }
        System.exit(0);
    }
}
