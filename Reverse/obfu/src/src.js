FLAG='BUAACTF{J4v4scr1pt_m4k3_m3_cr4zy!}';
(function(flag) {
    var comp=[81, 61, 107, 41, 120, 45, 99, 54, 100, 10, 126, 53, 123, 51, 106, 90, 57, 11, 69, 60, 113, 41, 107, 91, 3, 49, 1, 49, 80, 42, 100, 2, 96, 52, 122, 28, 69, 118, 63, 15, 106, 4, 111, 7, 97, 48, 13, 48];
    // 定义一个字节数组，存储flag的Base64编码
    var x = new Uint8Array(btoa(flag).split("").map(function(c) {
        return c.charCodeAt(0);
    }));
    // 对每个字节进行异或操作，除了第一个字节
    for (var i = 1; i < x.length; i++) {
        x[i] ^= x[i-1];
    }
    for (var i = 1; i < x.length; i++) {
        if(x[i]!=comp[i]){
            console.log("try again.");
            return;
        }
    }
    console.log("How great are you!");
})(FLAG)