var jq=jQuery.noConflict();
function wall_add(cid, result) {
    result=1;
    if(result) {
		var obj = $('comment_ul');
		var newli = document.createElement("div");
		var x = new Ajax();
		x.get('do.php?ac=ajax&op=comment', function(s){
			newli.innerHTML = s;
		});
		obj.insertBefore(newli, obj.firstChild);
        jq(newli).css({"border-bottom":"1px solid #dcdcdc"});
        if($('comment_message')) {
			$('comment_message').value= '';
		}
		//提示获得积分
		showreward();
	}
}

//添加分享
function share_add(sid, result) {
	result=1;
    if(result) {
		var obj = $('share_ul');
		var newli = document.createElement("div");
		var x = new Ajax();
		x.get('do.php?ac=ajax&op=share', function(s){
			newli.innerHTML = s;
		});
		obj.insertBefore(newli, obj.firstChild);
		$('share_link').value = 'http://';
		$('share_general').value = '';
		//提示获得积分
		showreward();
	}
}
//添加评论
function comment_add(id, result) {
	result=1;
    if(result) {
		var obj = $('comment_ul');
		var newli = document.createElement("div");
		var x = new Ajax();
		x.get('do.php?ac=ajax&op=comment', function(s){
			newli.innerHTML = s;
		});
		if($('comment_prepend')){
            if (obj.childElementCount != 0){
                obj = obj.firstChild;
                while (obj && obj.nodeType != 1){
                    obj = obj.nextSibling;
                }
                obj.parentNode.insertBefore(newli, obj);
            } else {
                obj.appendChild(newli);
            }
		} else {
			obj.appendChild(newli);
		}
		if($('comment_message')) {
			$('comment_message').value= '';
		}
		if($('comment_replynum')) {
			var a = parseInt($('comment_replynum').innerHTML);
			var b = a + 1;
			$('comment_replynum').innerHTML = b + '';
		}
		//提示获得积分
		showreward();
	}
}
//编辑
function comment_edit(id, result) {
	result=1;
    if(result) {
		var ids = explode('_', id);
		var cid = ids[1];
		var obj = $('comment_'+ cid +'_li');
		var x = new Ajax();
		x.get('do.php?ac=ajax&op=comment&cid='+ cid, function(s){
			obj.innerHTML = s;
		});
	}
}
//删除
function comment_delete(id, result) {
	result=1;
    if(result) {
		var ids = explode('_', id);
		var cid = ids[1];
		var obj = $('comment_'+ cid +'_li');
		obj.style.display = "none";
		if($('comment_replynum')) {
			var a = parseInt($('comment_replynum').innerHTML);
			var b = a - 1;
			$('comment_replynum').innerHTML = b + '';
		}
	}
}
//删除feed
function feed_delete(id, result) {
	if(result) {
		var ids = explode('_', id);
		var feedid = ids[1];
		var obj = $('feed_'+ feedid +'_li');
		obj.style.display = "none";
		
	}
}
//编辑一个日历
function calendar_add(id,result){
	result=1;
    if(result) {
		var ids = explode('_', id);
		var obj = $('my_calendar_list');
		var x = new Ajax();
		x.get('do.php?ac=ajax&op=calendar', function(s){
			obj.innerHTML = s;
		});
	}
}
//编辑一个日历
function calendar_edit(id,result){
	result=1;
    if(result) {
		var ids = explode('_', id);
		var cid = ids[1];
		var obj = $('calendar_list_'+ cid +'_li');
		var x = new Ajax();
		x.get('do.php?ac=ajax&op=calendar&calendar_id='+ cid, function(s){
			obj.innerHTML = s;
		});
	}
}
//删除一个日历
function calendar_delete(id,result){
	if(result) {
		var ids = explode('_', id);
		var feedid = ids[1];
		var obj = $('calendar_list_'+ feedid +'_li');
		obj.style.display = "none";
	}
}

//删除分享
function share_delete(id, result) {
	if(result) {
		var ids = explode('_', id);
		var sid = ids[1];
		var obj = $('share_'+ sid +'_li');
		obj.style.display = "none";
	}
}
//删除好友
function friend_delete(id, result) {
	if(result) {
		var ids = explode('_', id);
		var uid = ids[1];
		var obj = $('friend_'+ uid +'_li');
		if(obj != null) obj.style.display = "none";
		var obj2 = $('friend_tbody_'+uid);
		if(obj2 != null) obj2.style.display = "none";
	}
}
//更改分组
function friend_changegroup(id, result) {
	if(result) {
		var ids = explode('_', id);
		var uid = ids[1];
		var obj = $('friend_group_'+ uid);
		var x = new Ajax();
		x.get('do.php?ac=ajax&op=getfriendgroup&uid='+uid, function(s){
			obj.innerHTML = s;
		});
	}
}
//更改分组名
function friend_changegroupname(id, result) {
	if(result) {
		var ids = explode('_', id);
		var group = ids[1];
		var obj = $('friend_groupname_'+ group);
		var x = new Ajax();
		x.get('do.php?ac=ajax&op=getfriendname&group='+group, function(s){
			obj.innerHTML = s;
		});
	}
}
//添加回帖
function post_add(pid, result) {
	result=1;
    if(result) {
		var obj = $('post_ul');
		var newli = document.createElement("div");
		var x = new Ajax();
		x.get('do.php?ac=ajax&op=post', function(s){
			newli.innerHTML = s;
		});
        if($('comment_prepend')){
            obj = obj.firstChild;
            while (obj && obj.nodeType != 1){
                obj = obj.nextSibling;
            }
            obj.parentNode.insertBefore(newli, obj);
        }else{
		    obj.appendChild(newli);
        }
        if($('comment_message')) {
            $('comment_message').value= '';
        }
		/*if($('message')) {
			$('message').value= '';
			newnode = $('quickpostimg').rows[0].cloneNode(true);
			tags = newnode.getElementsByTagName('input');
			for(i in tags) {
				if(tags[i].name == 'pics[]') {
					tags[i].value = 'http://';
				}
			}
			var allRows = $('quickpostimg').rows;
			while(allRows.length) {
				$('quickpostimg').removeChild(allRows[0]);
			}
			$('quickpostimg').appendChild(newnode);
		}*/
		if($('post_replynum')) {
			var a = parseInt($('post_replynum').innerHTML);
			var b = a + 1;
			$('post_replynum').innerHTML = b + '';
		}
		//提示获得积分
		showreward();
	}
}
//编辑回帖
function post_edit(id, result) {
	if(result) {
		var ids = explode('_', id);
		var pid = ids[1];

		var obj = $('post_'+ pid +'_li');
		var x = new Ajax();
		x.get('do.php?ac=ajax&op=post&pid='+ pid, function(s){
			obj.innerHTML = s;
		});
	}
}
//删除回帖
function post_delete(id, result) {
	if(result) {
		var ids = explode('_', id);
		var pid = ids[1];
		
		var obj = $('post_'+ pid +'_li');
		obj.style.display = "none";
		if($('post_replynum')) {
			var a = parseInt($('post_replynum').innerHTML);
			var b = a - 1;
			$('post_replynum').innerHTML = b + '';
		}
	}
}
//打招呼
function poke_send(id, result) {
	if(result) {
		var ids = explode('_', id);
		var uid = ids[1];

		if($('poke_'+ uid)) {
			$('poke_'+ uid).style.display = "none";
		}
		//提示获得积分
		showreward();
	}
}
//好友请求
function myfriend_post(id, result) {
	if(result) {
		var ids = explode('_', id);
		var uid = ids[1];
		$('friend_'+uid).innerHTML = '<p>你们现在是好友了，接下来，您还可以：<a href="space.php?uid='+uid+'#comment" target="_blank">给TA留言</a> ，或者 <a href="cp.php?ac=poke&op=send&uid='+uid+'" id="a_poke_'+uid+'" onclick="ajaxmenu(event, this.id, 1)">打个招呼</a></p>';
	}
}
//删除好友请求
function myfriend_ignore(id) {
	var ids = explode('_', id);
	var uid = ids[1];
	$('friend_tbody_'+uid).style.display = "none";
}

//加入群组
function mtag_join(tagid, result) {
	if(result) {
		location.reload();
	}
}

//选择图片
function picView(albumid) {
	if(albumid == 'none') {
		$('albumpic_body').innerHTML = '';
	} else {
		ajaxget('do.php?ac=ajax&op=album&id='+albumid+'&ajaxdiv=albumpic_body', 'albumpic_body');
	}
}
//删除重发邮件
function resend_mail(id, result) {
	if(result) {
		var ids = explode('_', id);
		var mid = ids[1];
		var obj = $('sendmail_'+ mid +'_li');
		obj.style.display = "none";
	}
}

//设置应用不可见
function userapp_delete(id, result) {
	if(result) {
		var ids = explode('_', id);
		var appid = ids[1];
		$('space_app_'+appid).style.display = "none";
	}
}

function treecomment_get(id, rootid, result) {
	if(result) {
		var showid = id;

		$(showid).style.display = '';
		$(showid).className = 'fcomment do_document is-visible';

		ajaxget('cp.php?ac=treecomment&op=getcomment&rootid='+rootid, showid);
	}
}
//do评论
function docomment_get(id, result) {
	if(result) {
		var ids = explode('_', id);
		var doid = ids[1];
		var showid = 'docomment_'+doid;
		var opid = 'do_a_op_'+doid;

		$(showid).style.display = '';
		$(showid).className = 'fcomment do_document is-visible';

		ajaxget('cp.php?ac=doing&op=getcomment&doid='+doid, showid);

		if($(opid)) {
			$(opid).innerHTML = '收起';
			$(opid).onclick = function() {
				docomment_colse(doid);
			}
		}
		//提示获得积分
		showreward();
	}
}

// 评论加数字,之前写了getNumber函数,不给力,不如直接在这写
function docomment_colse(doid) {
	var showid = 'docomment_'+doid;
	var opid = 'do_a_op_'+doid;

	$(showid).style.display = 'none';
	$(showid).style.className = '';

	var n = new Ajax();
	n.get('cp.php?ac=doing&op=getnumber&doid='+doid, function(s){
			if(s>0) {
				$(opid).innerHTML = "<img src='image/icons/icon-comment.png'></span>&nbsp;评论("+s+')';
			}
			else{
				$(opid).innerHTML = "<img src='image/icons/icon-comment.png'></span>&nbsp;评论";
			}
		});
	
	$(opid).onclick = function() {
		docomment_get(showid, 1);
	}
}

function docomment_form(doid, id) {
	var showid = 'docomment_form_'+doid+'_'+id;
	var divid = 'docomment_' + doid;
	ajaxget('cp.php?ac=doing&op=docomment&doid='+doid+'&id='+id, showid);
	if($(divid)) {
        if($(divid).style.display!='block')
		    $(divid).style.display = 'block';
        else $(divid).style.display = 'none';
	}
}

function docomment_form_close(doid, id) {
	var showid = 'docomment_form_'+doid+'_'+id;
	$(showid).innerHTML = '';
}

function treecomment_form(rootid, id) {
	var showid = 'treecomment_form_'+rootid+'_'+id;
	var divid = 'treecomment_' + rootid;
	ajaxget('cp.php?ac=treecomment&op=add&rootid='+rootid+'&id='+id, showid);
	if($(divid)) {
        if($(divid).style.display!='block')
		    $(divid).style.display = 'block';
        else $(divid).style.display = 'none';
	}
}


//feed评论
function feedcomment_get(feedid, result) {
	var showid = 'feedcomment_'+feedid;
	var opid = 'feedcomment_a_op_'+feedid;

	$(showid).style.display = '';
	$(showid).className = 'fcomment';
	ajaxget('cp.php?ac=feed&op=getcomment&feedid='+feedid, showid);
	if($(opid) != null) {
		$(opid).innerHTML = '收起';
		$(opid).onclick = function() {
			feedcomment_close(feedid);
		}
	}
}

function feedcomment_add(id, result) {
	if(result) {
		var ids = explode('_', id);
		var cid = ids[1];
		var obj = $('comment_ol_'+cid);
		var newli = document.createElement("div");
		var x = new Ajax();
		x.get('do.php?ac=ajax&op=comment', function(s){
			newli.innerHTML = s;
		});
		obj.appendChild(newli);

		$('feedmessage_'+cid).value= '';
		//提示获得积分
		showreward();
	}
}

//关闭评论
function feedcomment_close(feedid) {
	var showid = 'feedcomment_'+feedid;
	var opid = 'feedcomment_a_op_'+feedid;

	$(showid).style.display = 'none';
	$(showid).style.className = '';

	$(opid).innerHTML = "<img src='image/icons/icon-comment.png'/>&nbsp;评论";
	$(opid).onclick = function() {
		feedcomment_get(feedid);
	}
}

//分享完成
function feed_post_result(feedid, result) {
	if(result) {
		location.reload();
	}
}

//显示更多动态
function feed_more_show(feedid) {
	var showid = 'feed_more_'+feedid;
	var opid = 'feed_a_more_'+feedid;

	$(showid).style.display = '';
	$(showid).className = 'sub_doing';

	$(opid).innerHTML = '&laquo; 收起列表';
	$(opid).onclick = function() {
		feed_more_close(feedid);
	}
}

function feed_more_close(feedid) {
	var showid = 'feed_more_'+feedid;
	var opid = 'feed_a_more_'+feedid;

	$(showid).style.display = 'none';

	$(opid).innerHTML = '&raquo; 更多动态';
	$(opid).onclick = function() {
		feed_more_show(feedid);
	}
}

//发布投票
function poll_post_result(id, result) {
	if(result) {
		var aObj = $('__'+id).getElementsByTagName("a");
		window.location.href = aObj[0].href;
	}
}

//点评之后
function show_click(id) {
	var ids = id.split('_');
	var idtype = ids[1];
	var id = ids[2];
	var clickid = ids[3];
	ajaxget('cp.php?ac=click&op=show&clickid='+clickid+'&idtype='+idtype+'&id='+id, 'click_div');
	//提示获得积分
	showreward();
}

//feed菜单
function feed_menu(feedid, show) {
	var obj=jq('#a_feed_menu_'+feedid);
	if(obj) {
		if(show) {
            obj.css({'display':'block'});
		} else {
            obj.css({'display':'none'});
		}
	}
	var obj = $('#feedmagic_'+feedid);
	if(obj) {
		if(show) {
            obj.css({'display':'block'});
		} else {
            obj.css({'display':'none'});
		}
	}
}

//填写生日
function showbirthday(){
	$('birthday').length=0;
	for(var i=0;i<28;i++){
		$('birthday').options.add(new Option(i+1, i+1));
	}
	if($('birthmonth').value!="2"){
		$('birthday').options.add(new Option(29, 29));
		$('birthday').options.add(new Option(30, 30));
		switch($('birthmonth').value){
			case "1":
			case "3":
			case "5":
			case "7":
			case "8":
			case "10":
			case "12":{
				$('birthday').options.add(new Option(31, 31));
			}
		}
	} else if($('birthyear').value!="") {
		var nbirthyear=$('birthyear').value;
		if(nbirthyear%400==0 || nbirthyear%4==0 && nbirthyear%100!=0) $('birthday').options.add(new Option(29, 29));
	}
}
/**
 * 插入涂鸦
 * @param String fid: 要关闭的层ID
 * @param String oid: 要插入到对象的目标ID
 * @param String url: 涂鸦文件的地址
 * @param String tid: 切换标签ID
 * @param String from: 涂鸦从哪来的
 * @return 没有返回值
 */
function setDoodle(fid, oid, url, tid, from) {
	if(tid == null) {
		hideMenu();
	} else {
		//用于两标签切换用
		$(tid).style.display = '';
		$(fid).style.display = 'none';
	}
	var doodleText = '[img]'+url+'[/img]';
	if($(oid) != null) {
		if(from == "editor") {
			insertImage(url);
		} else {
			insertContent(oid, doodleText);
		}
	}
}

function selCommentTab(hid, sid) {
	$(hid).style.display = 'none';
	$(sid).style.display = '';
}


//文字闪烁
function magicColor(elem, t) {
	t = t || 10;//最多尝试
	elem = (elem && elem.constructor == String) ? $(elem) : elem;
	if(!elem){
		setTimeout(function(){magicColor(elem, t-1);}, 400);//如果没有加载完成，推迟
		return;
	}
	if(window.mcHandler == undefined) {
		window.mcHandler = {elements:[]};
		window.mcHandler.colorIndex = 0;
		window.mcHandler.run = function(){
			var color = ["#CC0000","#CC6D00","#CCCC00","#00CC00","#0000CC","#00CCCC","#CC00CC"][(window.mcHandler.colorIndex++) % 7];
			for(var i = 0, L=window.mcHandler.elements.length; i<L; i++)
				window.mcHandler.elements[i].style.color = color;
		}
	}
	window.mcHandler.elements.push(elem);
	if(window.mcHandler.timer == undefined) {
		window.mcHandler.timer = setInterval(window.mcHandler.run, 500);
	}
}

//隐私密码
function passwordShow(value) {
	if(value==4) {
		$('span_password').style.display = '';
		$('tb_selectgroup').style.display = 'none';
	} else if(value==2) {
		$('span_password').style.display = 'none';
		$('tb_selectgroup').style.display = '';
	} else {
		$('span_password').style.display = 'none';
		$('tb_selectgroup').style.display = 'none';
	}
}

//隐私特定好友
function getgroup(gid) {
	if(gid) {
		var x = new Ajax();
		x.get('cp.php?ac=privacy&op=getgroup&gid='+gid, function(s){
			s = s + ' ';
			$('target_names').innerHTML += s;
		});
	}
}

function upvote(feedid) {
	if (isNaN(feedid)) { return; }
	var _this = jq('#feed_up_'+feedid);
	_this.removeAttr('onclick');
	_this.unbind('click');
	jq.get('cp.php?ac=feed&op=upvote&feedid='+feedid, function(data){
		if (data=='-1') {
			_this.click(function(){
				upvote(feedid);
			});
		} else if (!isNaN(data)) {
			var upvotes = parseInt(data);
			var content = _this.html();
			_this.html(content.replace(/赞.*/,"赞("+upvotes+")")).css({
				'color':'gray',
				'cursor':'default'
			});
		} else {
			_this.click(function(){
				upvote(feedid);
			});
		}
		
	});
}
//添加标签
function addtag_save(id, result) {
    if(result) {
		window.location.reload();
	}
}
