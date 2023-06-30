var callback = function () {
    var type = jq1("#new_feed .active").attr('id');
    var version = jq1("#feed_div li:first").attr('id').replace(/.*?(\d+).*/i, '$1');
    var url = "cp.php?ac=feed&op=update&active=" + type + "&version=" + version;

    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);
    xhr.send();
    if (xhr.readyState == 4 && xhr.status == 200) {
        var updates = parseInt(xhr.responseText);
        var stage = 0;
        if (jq1("#feed_update").length) {
            stage = parseInt(jq1("#feed_update").attr('stage'));
            updates += stage;
            jq1("#feed_update").remove();
        }
        ;

        if (updates > 0) {
            if (!jq1("#feed_update").length) {
                jq1("#feed_div").prepend('<a id="feed_update" href="javascript:void(0);" class="hidden" updates="0" stage="0" type=""></a>');
                jq1("#feed_update").click(function () {
                    jq1('#' + jq1(this).attr('type')).click();
                    jq1(this).remove();
                });
            }
            ;
            var now = jq1("#feed_update");
            now.attr("updates", updates);
            now.attr("type", type);
            now.attr("stage", stage);
            now.attr("href", jq1("#new_feed .active a").attr('href'));
            if (updates >= 100) {
                now.text("有99+条新消息，点击查看");
            } else {
                now.text("有" + updates + "条新消息，点击查看");
            }
            ;
            now.attr('class', '');
        }
    }
    ;
    xhr.abort();
    xhr = null;
};

var interval_id;
jq1(window).focus(function () {
    if (!interval_id) {
        interval_id = setInterval(callback, 30000);
    }
    ;
});
jq1(window).blur(function () {
    clearInterval(interval_id);
    interval_id = 0;
});
