jQuery.noConflict();

function atfriend(uid, name) {
    var messageContent = jQuery("#message").val();
    messageContent = messageContent + '@' + name + '(' + uid + ')' + ' ';
    jQuery("#message").val(messageContent);
}

function sync(msg) {
    jQuery.post("cp.php?ac=doing&sync=true", {
        "msg": msg,
        "uid": "114514",
        "remember": jQuery("#remember").prop("checked")
    }, function (data) {

        location.href = "space.php?uid=114514&do=thread&id=" + data.tid;
    }, "json");
}

function sync_no() {
    jQuery.post("cp.php?ac=doing&sync=false", {
        "remember": jQuery("#remember").prop("checked")
    }, function () {
        jQuery(".xubox_close").click();
    });
}

jQuery(function ($) {
    jQuery.each(['show', 'hide'], function (i, ev) {
        var el = jQuery.fn[ev];
        jQuery.fn[ev] = function () {
            this.trigger(ev);
            return el.apply(this, arguments);
        };
    });

    var bar = $('.bar');
    var percent = $('.percent');
    var showimg = $('#showimg');
    var progress = $(".progress");
    var files = $(".files");
    var btn = $(".btn span");
    $("#fileupload").wrap("<form id='myupload' action='cp.php?ac=upload&file=upload&type=pic' method='post' enctype='multipart/form-data'></form>");
    $("#fileupload").live("change", function () {

        $(".mood_textarea").val("分享图片");
        $("#myupload").ajaxSubmit({
            dataType: 'json',
            beforeSubmit: function (data) {
                showimg.html("<div class='triangle-isosceles' style='width:200px;height:300px;line-height:300px;text-align:center;'></h4><p><b>" + name + "</b></p> <img style='width:30px;height:30px;' src='image/loading154.gif' ></div>");
            },
            success: function (data) {
                var img = "attachment/" + data.pic;
                var num = 12;
                var name = data.name;
                var picid = data.picid;
                name = cut_string(name, num);
                $("#datapicid").val(picid);
                $("#datapicpath").val(data.pic);
                showimg.html("<div class='triangle-isosceles'><p><b>" + name + "</b></p> <img src='" + img + "' ><p><span class='delimg' rel='" + picid + "'>删除</span></p></div>");
                btn.html("图片");
            },
            error: function (xhr) {
                btn.html("上传失败");
                bar.width('0')
                showimg.html("");
            }
        });
    });
    jQuery(".delimg").live('click', function () {
        var picid = $(this).attr("rel");
        $.get("cp.php?ac=upload&file=delete&type=pic", {picid: picid}, function (ancon) {
            if (ancon == 'ok') {
                $("#datapicid").val('');
                $("#datapicpath").val('');
                showimg.empty();
                $("#fileupload").val('');
            } else {
                alert("删除失败，刷新即可~");
            }
        });
    });

    function cut_string(string, num) {
        var str = string.split('.');
        var s_length = str.length;
        var str_len = str[0].replace(/[^\x00-\xff]/g, "**").length;
        if (str_len > num) {
            var content = str[0].substr(0, num);
            return content + "..." + str[s_length - 1];
        } else {
            return string;
        }
    }

    var moodSwitch = jQuery("#mood-switch");
    var jqSubmit = jQuery("#add");
    var jqComplain = jQuery("#complain");
    jQuery("#complain_help").tooltip();
    document.getElementById('message').addEventListener('keydown', (e) => { ctrlEnter(e, 'add')});
    document.getElementById('message').addEventListener('input', (e) => { textCounter(document.getElementById('message'), 'maxlimit', 140);});
    document.getElementById('message').addEventListener('propertychange', (e) => { textCounter(document.getElementById('message'), 'maxlimit', 140)});
    moodSwitch.on("click", "a", function () {
        moodSwitch.find("li").removeClass("active");

        var type = jQuery(this.parentNode).addClass("active");
        console.log(type.hasClass("status"));
        jqSubmit.html(type.hasClass("status") ? '发布' : '诉求');

        if (type.hasClass('status')) {
            jQuery(".complain_tip").hide();
        } else {
            jQuery(".complain_tip").show();
        }

        jqComplain.val(type.hasClass("status") ? '0' : '1');
    });

    jQuery("#message").focus(function () {
        $("#mood_feed").removeClass("invalid");
    });
    
    jqSubmit.click(function (e) {
        e.preventDefault();

        var jqMessage = $("#message").val();
        if (jqMessage === "") {
            $("#mood_feed").addClass("invalid");
            return;
        }
        
        if (jqMessage.indexOf("[em:") != -1) {
            alert("亲，请不要尝试使用旧表情，新表情很可耐不是吗^_^");
            return false;
        }
        var type = jqSubmit.html() == '发布' ? 'comment' : 'appeal';
        var content = jqMessage;
        var data = {'type': type, 'content': JSON.stringify({'msg': content})};
        
        var jqDoingForm = $("#doingform");
        var jqShowimg = $('#showimg');
        jq('#add').text(jq('#add').text().substring(0, 2) + '中...').attr('disabled', 'disabled');

        fetch('/appeal/add', {
            method: 'post',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => response.json())
        .then(data =>  {
            if (jq1("#feed_update").length != 0) {
                jq1("#feed_update").attr('class', 'hidden');
                jq1("#feed_update").attr('stage', jq1("#feed_update").attr('updates'));
            }
            ;
            jqDoingForm.clearForm();
            jqShowimg.empty();
            console.log(data);
            switch (data.msg) {
                case '异常':
                    var message = "<div class='comment_text'>异常</div>";
                    Message_out(message);
                    break;
                case '诉求提交成功!我们会尽快联系相关部分回复您~':
                    var message = "<div class='comment_text'>提交成功!我们会尽快联系相关部分回复您~</div>";
                    Message_out(message);
                    jq1("#reply_bag").text("小黑子刚刚发布了一条消息");
                    break;
                case '诉求提交失败,看看是哪里的问题捏~':
                    var message = "<div class='comment_text'>诉求提交失败,看看是哪里的问题捏~</div>";
                    Message_out(message);
                    break;
                default:
                    Status_show(data);
            }
            $("#maxlimit").text("140");
            $('#datapicpath').val('');
            $('#datapicid').val('');
            jq('#add').text(jq('#add').text().substring(0, 2)).removeAttr('disabled');
        });
        return false;
    });
    jQuery("#face_topic").click(function () {
        jQuery(".mood_textarea").val("#BUAACTF三年啦# ");
    });

    function Status_show(status) {
        var msg = jQuery(status).data('msg');
        switch (msg) {
            case 'note_complain_credit_failed':
                var credit = parseInt(jQuery(status).data('credit'));
                var require = parseInt(jQuery(status).data('require'));
                if (credit < require) {
                    var ctrlid = 'mood_feed';
                    var div = document.createElement('div');
                    div.ctrlid = ctrlid;
                    div.id = ctrlid + '_menu';
                    div.style.display = 'none';
                    div.className = 'popupmenu_popup mood_feed_menu';
                    jQuery('.mood_feed_menu').remove();
                    document.getElementById('append_parent').appendChild(div);

                    var x = new Ajax();
                    var href = 'cp.php?ac=complain&op=credit';
                    x.div = div;

                    x.get(href, function (s) {
                        var evaled = false;
                        if (s.indexOf('ajaxerror') != -1) {
                            evaled = true;
                        }
                        if (s.indexOf('hideMenu()') == -1) { //添加关闭
                            s = '<h1>消息</h1><a href="javascript:hideMenu();" class="float_del" title="关闭">关闭</a><div class="popupmenu_inner">' + s + '<div>';
                        }
                        if (!evaled) {
                            if (x.div) x.div.innerHTML = s;
                            showMenu(ctrlid, false, 0, 3, 0, 0, ctrlid, 1000, false);
                        }
                    });
                    break;
                }
                var message = "<img src='/template/default/image/comment_fail.png'></img><div class='comment_text'>积分不足，此诉求已转为新鲜事发布</div>";
                Message_out(message);
                break;
            case 'note_complain_user_success':
                var message = "<img src='/template/default/image/comment_ok.png'></img><div class='comment_text'>诉求成功</div>";
                Message_out(message);
                break;
            case 'note_complain_user_failed':
                var message = "<img src='/template/default/image/comment_fail.png'></img><div class='comment_text'>诉求失败</div>";
                Message_out(message);
                break;
            default:
                break;
        }
        var newHtml = '<ul class="newStatus" style="display:none">' + status + '</ul>';
        $("#feed_div").prepend(newHtml);
        var newStatus = $(".newStatus");
        newStatus.fadeToggle(2200);
        newStatus.removeClass("newStatus");
    }

    function Message_out(message) {
        $(".message").html(message);
        $(".showMessage").css({"display": "block"});
        $(".message").css({"display": "block"});
        $(".showMessage").stop().animate({"opacity": "0.6"}, 700);
        $(".showMessage").delay(1500).animate({
            "opacity": "0"
        }, 700, function () {
            $(".showMessage").css({
                "display": "none"
            });
            $(".message").css({
                "display": "none"
            });
        });
    }

    $("#at_friends").click(function () {
        $("#at_friends_box").fadeToggle("fast");
        var isComplain = $("#complain").val();
        var getUrl = "data/assets/data_114514.json";
        if (isComplain == 1) {
            getUrl = "data/powerlevel/powerlevel.json";
        }
        $.getJSON(getUrl,
            function (data) {
                $("#friends_list_box").empty();
                $.each(data, function (idx, friend) {
                    var atHtml = '<div class="friends_list"><a href="javascript:void(0)" onclick="javascript:atfriend(\'' + friend.uid + '\',\'' + friend.name + '\')" class="click_at_friends">' + friend.name + '(' + friend.uid + ')</a></div>';
                    $("#friends_list_box").append(atHtml);
                });
            });
    });
    jQuery("#friends_list_box > .click_at_friends").click(function () {
        var messageContent = jQuery("#message");
        var name = jQuery(this).text();
        messageContent = messageContent + '@' + name + ' ';
    });

    function atfriend(uid, name) {
        var messageContent = jQuery("#message");
        messageContent = messageContent + '@' + name + '(' + uid + ')' + ' ';
    }

    $("#close_at_box").click(function () {
        $("#at_friends_box").fadeOut("fast");
        $("#input_friends_name").val('搜索要@的好友');
    });
    $("#doingform").keypress(function (e) {
        if (e.keyCode == 13 && $("#input_friends_name").is(":focus")) {
            $("#search_friends_submit").click();
            e.preventDefault();
        }
    });
    $("#search_friends_submit").click(function () {
        var uname = $("#input_friends_name").val();
        $.getJSON("plugin.php?pluginid=atfriends",
            {name: uname, uid: 114514},
            function (data) {
                $("#friends_list_box").empty();
                $.each(data, function (idx, friend) {
                    var atHtml = '<div class="friends_list"><a href="javascript:void(0)" onclick="javascript:atfriend(\'' + friend.uid + '\',\'' + friend.name + '\')" class="click_at_friends">' + friend.name + '(' + friend.uid + ')</a></div>';
                    $("#friends_list_box").append(atHtml);
                });
            });
    });
    jQuery("#new_function_msg_close").live('click', function () {
        jQuery("#new_function_msg").css("display", "none");
    });
    jQuery("#face_topic").mouseover(function () {
        jQuery(this).find("img").attr({"src": "image/icons/statues_topic_pressed.png"});
    });
    jQuery("#face_topic").mouseout(function () {
        jQuery(this).find("img").attr({"src": "image/icons/statues_topic_normal.png"});
    });
});
