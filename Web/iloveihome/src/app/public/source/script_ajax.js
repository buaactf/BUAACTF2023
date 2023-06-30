var Ajaxs = new Array();
var AjaxStacks = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
var ajaxpostHandle = 0;
var evalscripts = new Array();
var ajaxpostresult = 0;

function Ajax(recvType, waitId) {

	for (var stackId = 0; stackId < AjaxStacks.length && AjaxStacks[stackId] != 0; stackId++);
	AjaxStacks[stackId] = 1;

	var aj = new Object();

	//aj.loading = 'Loading...'; //public--------以前的
    //这里添加一个参数，如果有第三个参数，而且为'noEffect',说明不需要加载的效果
    aj.loading = '努力加载中...'//public
	aj.recvType = recvType ? recvType : 'XML'; //public
	aj.waitId = waitId ? $(waitId) : null; //public

	aj.resultHandle = null; //private
	aj.sendString = ''; //private
	aj.targetUrl = ''; //private
	aj.stackId = 0;
	aj.stackId = stackId;

	aj.setLoading = function(loading) {
		if (typeof loading !== 'undefined' && loading !== null) aj.loading = loading;
	}

	aj.setRecvType = function(recvtype) {
		aj.recvType = recvtype;
	}

	aj.setWaitId = function(waitid) {
		aj.waitId = typeof waitid == 'object' ? waitid : $(waitid);
	}

	aj.createXMLHttpRequest = function() {
		var request = false;
		if (window.XMLHttpRequest) {
			request = new XMLHttpRequest();
			if (request.overrideMimeType) {
				request.overrideMimeType('text/xml');
			}
		} else if (window.ActiveXObject) {
			var versions = ['Microsoft.XMLHTTP', 'MSXML.XMLHTTP', 'Microsoft.XMLHTTP', 'Msxml2.XMLHTTP.7.0', 'Msxml2.XMLHTTP.6.0', 'Msxml2.XMLHTTP.5.0', 'Msxml2.XMLHTTP.4.0', 'MSXML2.XMLHTTP.3.0', 'MSXML2.XMLHTTP'];
			for (var i = 0, icount = versions.length; i < icount; i++) {
				try {
					request = new ActiveXObject(versions[i]);
					if (request) {
						return request;
					}
				} catch (e) {}
			}
		}
		return request;
	}

	aj.XMLHttpRequest = aj.createXMLHttpRequest();
    var args = arguments;//传入参数
	aj.showLoading = function() {
        if (args.length >= 3 && args[2] == 'noEffect'){
        }else{
            if (aj.waitId && (aj.XMLHttpRequest.readyState != 4 || aj.XMLHttpRequest.status != 200)) {
                changedisplay(aj.waitId, '');
                aj.waitId.innerHTML = '<span><img src="image/loading154.gif" style="width:18px;height:18px;"> ' + aj.loading + '</span>';
            }
        }
	}

	aj.processHandle = function() {
		if (aj.XMLHttpRequest.readyState == 4 && aj.XMLHttpRequest.status == 200) {
			for (k in Ajaxs) {
				if (Ajaxs[k] == aj.targetUrl) {
					Ajaxs[k] = null;
				}
			}
			if (aj.waitId) changedisplay(aj.waitId, 'none');
			if (aj.recvType == 'HTML') {
				aj.resultHandle(aj.XMLHttpRequest.responseText, aj);
			} else if (aj.recvType == 'XML') {
				try {
                    if(aj.XMLHttpRequest.responseXML.childNodes.length === 0) {
                        aj.resultHandle(aj.XMLHttpRequest.responseText, aj);
                    } else {
					    aj.resultHandle(aj.XMLHttpRequest.responseXML.lastChild.firstChild.nodeValue, aj);
                    }
				} catch (e) {
					aj.resultHandle('', aj);
				}
			}
			AjaxStacks[aj.stackId] = 0;
		}
	}

	aj.get = function(targetUrl, resultHandle) {
		if (targetUrl.indexOf('?') != -1) {
			targetUrl = targetUrl + '&inajax=1';
		} else {
			targetUrl = targetUrl + '?inajax=1';
		}
		setTimeout(function() {
			aj.showLoading()
		}, 500);
		if (in_array(targetUrl, Ajaxs)) {
			return false;
		} else {
			Ajaxs.push(targetUrl);
		}
		aj.targetUrl = targetUrl;
		aj.XMLHttpRequest.onreadystatechange = aj.processHandle;
		aj.resultHandle = resultHandle;
		var delay = 100;
		if (window.XMLHttpRequest) {
			setTimeout(function() {
				aj.XMLHttpRequest.open('GET', aj.targetUrl);
				aj.XMLHttpRequest.send(null);
			}, delay);
		} else {
			setTimeout(function() {
				aj.XMLHttpRequest.open("GET", targetUrl, true);
				aj.XMLHttpRequest.send();
			}, delay);
		}

	}
	aj.post = function(targetUrl, sendString, resultHandle) {
		if (targetUrl.indexOf('?') != -1) {
			targetUrl = targetUrl + '&inajax=1';
		} else {
			targetUrl = targetUrl + '?inajax=1';
		}
		setTimeout(function() {
			aj.showLoading()
		}, 500);
		if (in_array(targetUrl, Ajaxs)) {
			return false;
		} else {
			Ajaxs.push(targetUrl);
		}
		aj.targetUrl = targetUrl;
		aj.sendString = sendString;
		aj.XMLHttpRequest.onreadystatechange = aj.processHandle;
		aj.resultHandle = resultHandle;
		aj.XMLHttpRequest.open('POST', targetUrl);
		aj.XMLHttpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		aj.XMLHttpRequest.send(aj.sendString);
	}
	return aj;
}

function newfunction(func) {
	var args = new Array();
	for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
	return function(event) {
		doane(event);
		window[func].apply(window, args);
		return false;
	}
}

function changedisplay(obj, display) {
	if (display == 'auto') {
		obj.style.display = obj.style.display == '' ? 'none' : '';
	} else {
		obj.style.display = display;
	}
	return false;
}

function evalscript(s) {
	if (s.indexOf('<script') == -1) return s;
	var p = /<script[^\>]*?>([^\x00]*?)<\/script>/ig;
	var arr = new Array();
	while (arr = p.exec(s)) {
		var p1 = /<script[^\>]*?src=\"([^\>]*?)\"[^\>]*?(reload=\"1\")?\s*(?:charset=\"([\w\-]+?)\")?><\/script>/i;
		var arr1 = new Array();
		arr1 = p1.exec(arr[0]);
		if (arr1) {
			appendscript(arr1[1], '', arr1[2], arr1[3]);
		} else {
			p1 = /<script(.*?)>([^\x00]+?)<\/script>/i;
			arr1 = p1.exec(arr[0]);
			//获取字符集
			var re = /charset=\"([\w\-]+?)\"/i;
			var charsetarr = re.exec(arr1[1]);
			appendscript('', arr1[2], arr1[1].indexOf('reload=') != -1, charsetarr[1]);
		}
	}
	return s;
}

function appendscript(src, text, reload, charset) {
	var id = hash(src + text);
	if (!reload && in_array(id, evalscripts)) return;
	if (reload && $(id)) {
		$(id).parentNode.removeChild($(id));
	}

	evalscripts.push(id);
	var scriptNode = document.createElement("script");
	scriptNode.type = "text/javascript";
	scriptNode.id = id;
	scriptNode.charset = charset;
	try {
		if (src) {
			scriptNode.src = src;
		} else if (text) {
			scriptNode.text = text;
		}
		$('append_parent').appendChild(scriptNode);
	} catch (e) {}
}

function stripscript(s) {
	return s.replace(/<script.*?>.*?<\/script>/ig, '');
}

function ajaxupdateevents(obj, tagName) {
	tagName = tagName ? tagName : 'A';
	var objs = obj.getElementsByTagName(tagName);
	for (k in objs) {
		var o = objs[k];
		ajaxupdateevent(o);
	}
}

function ajaxupdateevent(o) {
	if (typeof o == 'object' && o.getAttribute) {
		if (o.getAttribute('ajaxtarget')) {
			if (!o.id) o.id = Math.random();
			var ajaxevent = o.getAttribute('ajaxevent') ? o.getAttribute('ajaxevent') : 'click';
			var ajaxurl = o.getAttribute('ajaxurl') ? o.getAttribute('ajaxurl') : o.href;
			_attachEvent(o, ajaxevent, newfunction('ajaxget', ajaxurl, o.getAttribute('ajaxtarget'), o.getAttribute('ajaxwaitid'), o.getAttribute('ajaxloading'), o.getAttribute('ajaxdisplay')));
			if (o.getAttribute('ajaxfunc')) {
				o.getAttribute('ajaxfunc').match(/(\w+)\((.+?)\)/);
				_attachEvent(o, ajaxevent, newfunction(RegExp.$1, RegExp.$2));
			}
		}
	}
}

function ajaxget(url, showid, waitid) {
	waitid = typeof waitid == 'undefined' || waitid === null ? showid : waitid;
	var x = new Ajax();
	x.setLoading();
	x.setWaitId(waitid);
	x.display = '';
	x.showId = $(showid);
	if (x.showId) x.showId.orgdisplay = typeof x.showId.orgdisplay === 'undefined' ? x.showId.style.display : x.showId.orgdisplay;

	if (url.substr(strlen(url) - 1) == '#') {
		url = url.substr(0, strlen(url) - 1);
		x.autogoto = 1;
	}

	var url = url + '&inajax=1&ajaxtarget=' + showid;
	x.get(url, function(s, x) {
		evaled = false;
		if (s.indexOf('ajaxerror') != -1) {
			evalscript(s);
			evaled = true;
		}
		if (!evaled) {
			if (x.showId) {
				changedisplay(x.showId, x.showId.orgdisplay);
				changedisplay(x.showId, x.display);
				x.showId.orgdisplay = x.showId.style.display;
				ajaxinnerhtml(x.showId, s);
				ajaxupdateevents(x.showId);
				if (x.autogoto) scroll(0, x.showId.offsetTop);
			}
		}
		if (!evaled) evalscript(s);
	});
}

function ajaxpost(formid, func, timeout ,callback) {
	showloading();
	if (ajaxpostHandle != 0) {
		return false;
	}

	var ajaxframeid = 'ajaxframe';
	var ajaxframe = $(ajaxframeid);
	if (ajaxframe == null) {
		if (is_ie && !is_opera) {
			ajaxframe = document.createElement("<iframe name='" + ajaxframeid + "' id='" + ajaxframeid + "'></iframe>");
		} else {
			ajaxframe = document.createElement("iframe");
			ajaxframe.name = ajaxframeid;
			ajaxframe.id = ajaxframeid;
		}
		/*try {
            ajaxframe = document.createElement('<iframe name="' + ajaxframeid + '" id="' + ajaxframeid + '"></iframe>');
        } catch (e) {
            ajaxframe = document.createElement('iframe');
            ajaxframe.name = ajaxframeid;
            ajaxframe.id = ajaxframeid;
        }*/
		ajaxframe.style.display = 'none';
		$('append_parent').appendChild(ajaxframe);
	}
	$(formid).target = ajaxframeid;
	$(formid).action = $(formid).action + '&inajax=1';

	ajaxpostHandle = [formid, func, timeout];

	if (ajaxframe.attachEvent) {
		ajaxframe.detachEvent('onload', ajaxpost_load);
		ajaxframe.attachEvent('onload', ajaxpost_load);
	} else {
		document.removeEventListener('load', ajaxpost_load, true);
		ajaxframe.addEventListener('load', ajaxpost_load, false);
	}
	$(formid).submit();
	
	if(callback){
		callback();
	}
	
	return false;
}

function ajaxpost_load() {
	var formid = ajaxpostHandle[0];
	var func = ajaxpostHandle[1];
	var timeout = ajaxpostHandle[2];

	var formstatus = '__' + formid;

	showloading('none');
	if (is_ie) {
		var s = $('ajaxframe').contentWindow.document.XMLDocument.text;
		//var s = $('ajaxframe').contentWindow.document.body.innerHTML;
	} else {
		var s = $('ajaxframe').contentWindow.document.documentElement.firstChild.nodeValue;
	}

	evaled = false;
	console.log('a');
	console.log(s);
	console.log('b');
	if (s.indexOf('ajaxerror') != -1) {
		evalscript(s);
		evaled = true;
	}
	if (s.indexOf('ajaxok') != -1) {
		ajaxpostresult = 1;
	} else {
		ajaxpostresult = 0;
	}
	//function
	if (func) {
		setTimeout(func + '(\'' + formid + '\',' + ajaxpostresult + ')', 10);
	}

    s = s || "未知错误";
	if (!evaled && $(formstatus)) {
		$(formstatus).style.display = '';
		ajaxinnerhtml($(formstatus), s);
		evalscript(s);
	}

	//层消失
	if (timeout && ajaxpostresult) jsmenu['timer'][formid] = setTimeout("hideMenu()", timeout);

	formid.target = 'ajaxframe';
	ajaxpostHandle = 0;
}

function ajaxmenu(e, ctrlid, isbox, timeout, func) {

	var offset = 0;
	var duration = 3;

	if (isUndefined(timeout)) timeout = 0;
	if (isUndefined(isbox)) isbox = 0;
	if (timeout > 0) duration = 0;

	showloading();
	if (jsmenu['active'][0] && jsmenu['active'][0].ctrlkey == ctrlid) {
		hideMenu();
		doane(e);
		return;
	} else if (is_ie && is_ie < 7 && document.readyState.toLowerCase() != 'complete') {
		return;
	}

	if (isbox) {
		divclass = 'popupmenu_centerbox';
		offset = -1;
	} else {
		divclass = 'popupmenu_popup';
	}

	var div = $(ctrlid + '_menu');
	if (!div) {
		div = document.createElement('div');
		div.ctrlid = ctrlid;
		div.id = ctrlid + '_menu';
		div.style.display = 'none';
		div.className = divclass;
		$('append_parent').appendChild(div);
	}

	var x = new Ajax();
	var href = !isUndefined($(ctrlid).href) ? $(ctrlid).href : $(ctrlid).attributes['href'].value;
	x.div = div;
	x.etype = e.type;

	x.get(href, function(s) {
		evaled = false;
		if (s.indexOf('ajaxerror') != -1) {
			evaled = true;
		}
		if (s.indexOf('hideMenu()') == -1) { //添加关闭
			s = '<h1>消息</h1><a href="javascript:hideMenu();" class="float_del" title="关闭">关闭</a><div class="popupmenu_inner">' + s + '<div>';
		}
		if (!evaled) {
			if (x.div) x.div.innerHTML = s;
			showMenu(ctrlid, x.etype == 'click', offset, duration, timeout, 0, ctrlid, 1000, false);
			//function
			if (func) {
				setTimeout(func + '(\'' + ctrlid + '\')', 10);
			}
		}
		evalscript(s);
	});

	showloading('none');
	doane(e);
}

function AJAXrealnameANDbirthdayFETCHoverseas(e, ctrlid, isbox, timeout, func) {

	var offset = 0;
	var duration = 3;
	var realname = $('realname').value;
	var realname = is_ie && document.charset == 'utf-8' ? encodeURIComponent(realname) : realname;
	var birthday = $('birthday').value;
	var birthday = is_ie && document.charset == 'utf-8' ? encodeURIComponent(birthday) : birthday;
	var email = $('email').value;
	var eamil = is_ie && document.charset == 'utf-8' ? encodeURIComponent(email) : email;


	if (isUndefined(timeout)) timeout = 0;
	if (isUndefined(isbox)) isbox = 0;
	if (timeout > 0) duration = 0;

	showloading();
	if (jsmenu['active'][0] && jsmenu['active'][0].ctrlkey == ctrlid) {
		hideMenu();
		doane(e);
		return;
	} else if (is_ie && is_ie < 7 && document.readyState.toLowerCase() != 'complete') {
		return;
	}

	if (isbox) {
		divclass = 'popupmenu_centerbox';
		offset = -1;
	} else {
		divclass = 'popupmenu_popup';
	}

	var div = $(ctrlid + '_menu');
	if (!div) {
		div = document.createElement('div');
		div.ctrlid = ctrlid;
		div.id = ctrlid + '_menu';
		div.style.display = 'none';
		div.className = divclass;
		$('append_parent').appendChild(div);
	}

	var x = new Ajax();
	var href = 'do.php?ac=6299f5ffe24ae256e5e35f501065ff87&op=fetchmobile' + '&realname=' + realname + '&birthday=' + birthday + '&email=' + email;
	x.div = div;
	x.etype = e.type;


	x.get(href, function(s) {
		evaled = false;
		if (s.indexOf('ajaxerror') != -1) {
			evaled = true;
		}
		if (s.indexOf('hideMenu()') == -1) { //添加关闭
			s = '<h1>个人信息确认</h1><a href="javascript:hideMenu();" class="float_del" title="关闭">关闭</a><div class="popupmenu_inner">' + s + '<div>';
		}
		if (!evaled) {
			if (x.div) x.div.innerHTML = s;
			showMenu(ctrlid, x.etype == 'click', offset, duration, timeout, 0, ctrlid, 1000, true);
			//function
			if (func) {
				setTimeout(func + '(\'' + ctrlid + '\')', 10);
			}
		}
		evalscript(s);
	});

	showloading('none');
	doane(e);
}

function AJAXrealnameANDbirthdayFETCHmobile(e, ctrlid, isbox, timeout, func) {

	var offset = 0;
	var duration = 3;
	var realname = $('realname').value;
	var realname = is_ie && document.charset == 'utf-8' ? encodeURIComponent(realname) : realname;
	var birthday = $('birthday').value;
	var birthday = is_ie && document.charset == 'utf-8' ? encodeURIComponent(birthday) : birthday;
	var email = $('email').value;
	var eamil = is_ie && document.charset == 'utf-8' ? encodeURIComponent(email) : email;


	if (isUndefined(timeout)) timeout = 0;
	if (isUndefined(isbox)) isbox = 0;
	if (timeout > 0) duration = 0;

	showloading();
	if (jsmenu['active'][0] && jsmenu['active'][0].ctrlkey == ctrlid) {
		hideMenu();
		doane(e);
		return;
	} else if (is_ie && is_ie < 7 && document.readyState.toLowerCase() != 'complete') {
		return;
	}

	if (isbox) {
		divclass = 'popupmenu_centerbox';
		offset = -1;
	} else {
		divclass = 'popupmenu_popup';
	}

	var div = $(ctrlid + '_menu');
	if (!div) {
		div = document.createElement('div');
		div.ctrlid = ctrlid;
		div.id = ctrlid + '_menu';
		div.style.display = 'none';
		div.className = divclass;
		$('append_parent').appendChild(div);
	}

	var x = new Ajax();
	var href = 'do.php?ac=04d9b414956ce8006a38688f224a0f46&op=fetchmobile' + '&realname=' + realname + '&birthday=' + birthday + '&email=' + email;
	x.div = div;
	x.etype = e.type;


	x.get(href, function(s) {
		evaled = false;
		if (s.indexOf('ajaxerror') != -1) {
			evaled = true;
		}
		if (s.indexOf('hideMenu()') == -1) { //添加关闭
			s = '<h1>个人信息确认</h1><a href="javascript:hideMenu();" class="float_del" title="关闭">关闭</a><div class="popupmenu_inner">' + s + '<div>';
		}
		if (!evaled) {
			if (x.div) x.div.innerHTML = s;
			showMenu(ctrlid, x.etype == 'click', offset, duration, timeout, 0, ctrlid, 1000, true);
			//function
			if (func) {
				setTimeout(func + '(\'' + ctrlid + '\')', 10);
			}
		}
		evalscript(s);
	});

	showloading('none');
	doane(e);
}


//得到一个定长的hash值,依赖于 stringxor()
function hash(string, length) {
	var length = length ? length : 32;
	var start = 0;
	var i = 0;
	var result = '';
	filllen = length - string.length % length;
	for (i = 0; i < filllen; i++) {
		string += "0";
	}
	while (start < string.length) {
		result = stringxor(result, string.substr(start, length));
		start += length;
	}
	return result;
}

function stringxor(s1, s2) {
	var s = '';
	var hash = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	var max = Math.max(s1.length, s2.length);
	for (var i = 0; i < max; i++) {
		var k = s1.charCodeAt(i) ^ s2.charCodeAt(i);
		s += hash.charAt(k % 52);
	}
	return s;
}

function showloading(display, wating) {
	var display = display ? display : 'block';
	var wating = wating ? wating : 'Loading...';
	$('ajaxwaitid').innerHTML = wating;
	$('ajaxwaitid').style.display = display;
}

function ajaxinnerhtml(showid, s) {
	if (showid.tagName != 'TBODY') {
		showid.innerHTML = s;
	} else {
		while (showid.firstChild) {
			showid.firstChild.parentNode.removeChild(showid.firstChild);
		}
		var div1 = document.createElement('DIV');
		div1.id = showid.id + '_div';
		div1.innerHTML = '<table><tbody id="' + showid.id + '_tbody">' + s + '</tbody></table>';
		$('append_parent').appendChild(div1);
		var trs = div1.getElementsByTagName('TR');
		var l = trs.length;
		for (var i = 0; i < l; i++) {
			showid.appendChild(trs[0]);
		}
		var inputs = div1.getElementsByTagName('INPUT');
		var l = inputs.length;
		for (var i = 0; i < l; i++) {
			showid.appendChild(inputs[0]);
		}
		div1.parentNode.removeChild(div1);
	}
}

function __ihome_ajax_reload() {
	window.location.reload();
}
function usetag(tag){
	var id = jq('#acount').val();
	id++;
	if (id > 10){
		jq('#msg').show();
	}else{
		jq('#acount').val(id);
		var otag = jq('#tagnames').val();
		jq('#tagnames').val(otag + ' ' + tag);
		var atag = '<span class="atag" id="atag'+id+'">'+tag+'<a id="del" onClick="delltag('+ id +')" href="javascript:;"><img src="image/tagdel.png"></a></span>';
		jq('.textin').before(atag);
	}
}
function deltag(tuid){	
		var x = new Ajax();
		x.setLoading();
		var url = 'cp.php?ac=addtag&op=del&tuid=' + tuid;
		x.get(url, function(s, x) {
			window.location.reload();
		});		
}
function delltag(id){
	var dtag = jq('#atag'+id).text() + ' ';
	var otag = jq('#tagnames').val() + ' ';
	otag = otag.replace(new RegExp(dtag), " ");
	otag = otag.substring(0,otag.length-1);
	jq('#tagnames').val(otag);
	jq('#atag'+id).remove();
	id = jq('#acount').val()*1 - 1;
	jq('#acount').val(id);
	if(id < 11)  jq('#msg').hide();	
	return false;
}

function savetags(id){
	id = jq('#acount').val();
	var tagstr = jq('#ntagid').val();
	var nc = 0;
	if (tagstr!='') {
		var tagstra = tagstr.split(' ');
		nc = 	tagstra.length;
	}
	var count = id*1 + nc;	
	if (count > 10){
		jq('#msg').show();
		return false;
	}else{
		ajaxpost('addtag', 'addtag_save', 2000)
	}
}
function ctag(putid){
	var tagstr = jq('#'+putid).val();
	var id = jq('#acount').val();	
	if(tagstr.indexOf(" ") > 0 ){    
		tagstr = tagstr.replace(/[ ]/g,"");
		if (tagstr != ''){
			id++;
			if (id > 10){
				jq('#msg').show();
			}else{
				jq('#'+putid).val('');	
				otag = jq('#tagnames').val();
				jq('#tagnames').val(otag + ' ' + tagstr);
				var atag = '<span class="atag" id="atag'+id+'">'+tagstr+'<a id="del" onClick="delltag('+ id +')" href="javascript:;"><img src="image/tagdel.png"></a></span>';
				jq('.textin').before(atag);
			}
		}
	}
}
