package com.example.activitytest;

import static com.example.activitytest.R.*;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;

import android.content.DialogInterface;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.Toast;

public class SecondActivity extends AppCompatActivity implements View.OnClickListener {
    private static final String TAG = "Simple Java Maze";
    public static int[][] v1;
    public static int v2;
    public static int v3;

    static {
        v1 = new int[][]{
                {1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1},
                {1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1},
                {1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1},
                {1, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1},
                {1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1},
                {1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1},
                {1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1},
                {1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1},
                {1, 0, 1, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 1},
                {1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1},
                {1, 1, 0, 0, 1, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1},
                {1, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0},
                {1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1},
                {1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1}
        };
        v2 = 1;
        v3 = 1;
    }


    public void func1() {
        v1 = new int[][]{
                {1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1},
                {1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1},
                {1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1},
                {1, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1},
                {1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1},
                {1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1},
                {1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1},
                {1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1},
                {1, 0, 1, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 1},
                {1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1},
                {1, 1, 0, 0, 1, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1},
                {1, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0},
                {1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1},
                {1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1}
        };
        v2 = 1;
        v3 = 1;
    }

    public boolean func2() {
        if (v1[v3 - 1][v2] == 0) {
            v1[v3 - 1][v2] = 1;
            v3--;
            if (func6()) func7();
            return true;
        } else {
            return false;
        }
    }

    public boolean func3() {
        if (v1[v3 + 1][v2] == 0) {
            v1[v3 + 1][v2] = 1;
            v3++;
            if (func6()) func7();
            return true;
        } else {
            return false;
        }
    }

    public boolean func4() {
        if (v1[v3][v2 - 1] == 0) {
            v1[v3][v2 - 1] = 1;
            v2--;
            if (func6()) func7();
            return true;
        } else {
            return false;
        }
    }

    public boolean func5() {
        if (v1[v3][v2 + 1] == 0) {
            v1[v3][v2 + 1] = 1;
            v2++;
            if (func6()) func7();
            return true;
        } else {
            return false;
        }
    }

    public boolean func6() {
        return (v2 == 11 && v3 == 11);
    }
    public void func7(){
        func1();
        AlertDialog.Builder dialog = new AlertDialog.Builder(SecondActivity.this);
        dialog.setTitle("Congratulations!");
        dialog.setMessage("Now you know the flag.");
        dialog.setCancelable(false);
        dialog.setPositiveButton("go get your points!", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialogInterface, int i) {

            }
        });
        dialog.setNegativeButton("go get your points!", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialogInterface, int i) {

            }
        });
        dialog.show();
    }
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(layout.activity_second);
        Button v5 = (Button) findViewById(id.button_up);
        v5.setOnClickListener(this);
        Button v6 = (Button) findViewById(id.button_down);
        v6.setOnClickListener(this);
        Button v7 = (Button) findViewById(id.button_left);
        v7.setOnClickListener(this);
        Button v8 = (Button) findViewById(id.button_right);
        v8.setOnClickListener(this);
        Button v9 = (Button) findViewById(id.button_center);
        v9.setOnClickListener(this);
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        //通过getMenuInflater()方法能够得到MenuInflater对象
        //再调用它的inflate()方法就可以给当前活动创建菜单了
        getMenuInflater().inflate(R.menu.main, menu);
        //inflate()第一个参数用于指定我们通过哪一个资源文件来创建菜单
        //这里当然传入R.menu.main
        //第二个参数用于指定我们的菜单项将添加到哪一个Menu对象当中，
        //这里直接使用onCreateOptionsMenu()方法中传入的menu参数
        return true;//返回true，表示允许创建的菜单显示出来，
        //如果返回了false，创建的菜单将无法显示。
    }

    @Override
    public boolean onOptionsItemSelected(@NonNull MenuItem item) {
        switch (item.getItemId()) {
            case id.add_item:
                Toast.makeText(this, "😡", Toast.LENGTH_SHORT).show();
                break;
            case id.remove_item:
                Toast.makeText(this, "😡", Toast.LENGTH_SHORT).show();
                break;
            default:
        }
        return true;
    }

    @Override
    public void onClick(View v10) {
        switch (v10.getId()) {

            case id.button_up:
                if (func2()) {
                    Toast.makeText(SecondActivity.this, "J", Toast.LENGTH_SHORT).show();

                } else {
                    Toast.makeText(SecondActivity.this, this.getText(string.Oops), Toast.LENGTH_SHORT).show();
                    func1();
                }
                break;
            case id.button_down:
                if (func3()) {
                    Toast.makeText(SecondActivity.this, "V", Toast.LENGTH_SHORT).show();

                } else {
                    Toast.makeText(SecondActivity.this, this.getText(string.Oops), Toast.LENGTH_SHORT).show();
                    func1();
                }
                break;
            case id.button_left:
                if (func4()) {
                    Toast.makeText(SecondActivity.this, "A", Toast.LENGTH_SHORT).show();

                } else {
                    Toast.makeText(SecondActivity.this, this.getText(string.Oops), Toast.LENGTH_SHORT).show();
                    func1();
                }
                break;
            case id.button_right:
                if (func5()) {
                    Toast.makeText(SecondActivity.this, "a", Toast.LENGTH_SHORT).show();

                } else {
                    Toast.makeText(SecondActivity.this, this.getText(string.Oops), Toast.LENGTH_SHORT).show();
                    func1();
                }
                break;
            case id.button_center:
                func1();
                Toast.makeText(SecondActivity.this, this.getText(string.refreshed), Toast.LENGTH_SHORT).show();
                break;
            default:
                throw new IllegalStateException("Unexpected value: " + v10.getId());
        }
    }

    @Override
    public void onPointerCaptureChanged(boolean hasCapture) {
        super.onPointerCaptureChanged(hasCapture);
    }
}