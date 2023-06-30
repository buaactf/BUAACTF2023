(function(root) {
    if (root.bailin_face) {
        return;
    }

    var jq = jQuery.noConflict();
	face_num = [57,16];
    function pop_info(cols,num,th) {
        
		var arrow = '<div class="arrow"></div>';
		arrow += '<input type="hidden" id="getNum" value="'+th+'"/>'; 
		arrow += '<div class="face_header"><a class="face_header_a"data-num="1" href="javascript:;">默认</a><a class="face_header_a" data-num="2" href="javascript:;">小i</a></div>';
		var FACE_TPL = arrow + "<div class='face_view'></div><table>";
        var COLS = cols;
        FACE_TPL += "<tr>"
        for (var i = 1; i <= num; i++) {
            if (i % COLS != 0) {
                FACE_TPL += '<td class="face_cell"><img data-index="' + i + '" src="image/face_new/face_'+th+'/' + i + '.gif"></img></td>';
            } else {
                FACE_TPL += '</tr><tr>'
            }
        }
        FACE_TPL += "</table>";
        return FACE_TPL;
    }

    function getPos(target) {
        var el = jq(target).get(0);
        var pos = 0;
        if ('selectionStart' in el) {
            pos = el.selectionStart;
        } else if ('selection' in document) {
            el.focus();
            var Sel = document.selection.createRange();
            var SelLength = document.selection.createRange().text.length;
            Sel.moveStart('character', -el.value.length);
            pos = Sel.text.length - SelLength;
        }
        return pos;
    }

    function insertface(id, num ,target) {
        if(num==1)	ch='a';
		if(num==2)	ch='b';
		var faceText = '['+ch+'m:' + id + ':]';
        var pos = getPos(target);
        var strHead = '',
            strEnd = '';
        if (jq(target).val() == '评论...'){
            jq(target).val('');
        }
        strHead = jq(target).val().substr(0, pos);
        strEnd = jq(target).val().substr(pos, jq(target).val().length);
        jq(target).val(strHead + faceText + strEnd);
        jq(target).get(0).selectionStart = strHead.length + faceText.length;
        jq(target).get(0).selectionEnd = strHead.length + faceText.length;
    }

    function popover_menu(e, height, width, html, source) {
        e = e.next(".drop_face_menu");
        if (e.html() == "") {
            e.html(html);
            e.css({
                "display": "block"
            });
            if (source == 'im') {
                e.stop().animate({
                    "height": height + "px"
                }, 50, function() {
                    e.stop().animate({
                        "width": width + "px"
                    }, 100, function() {
                        e.addClass("face_menu_opened");
                    });
                });
            } else {
                e.stop().animate({
                    "width": width + "px"
                }, 100, function() {
                    e.stop().animate({
                        "height": height + "px"
                    }, 50, function() {
                        e.addClass("face_menu_opened");
                    });
                });
            }
        }
    }

    function close_menu(target) {
        if (!jq(target).hasClass("drop_face") && !jq(target).hasClass("drop_face_menu")&&!jq(target).hasClass("face_header_a") && !jq(target).parents().hasClass("drop_face_menu")) {
            jq(".drop_face_menu").each(function() {
                obj = jq(this);
                if (obj.hasClass("face_menu_opened")) {
                    obj.removeClass("face_menu_opened");
                    obj.html("");
                    obj.css({
                        "height": "0px",
                        "width": "0px",
                        "display": "none"
                    });
                }
            });
        }
    }
    
    jq(document).on("mousemove",".face_cell",function(e){
    	e.preventDefault();
		var img_data = jq(this).find("img").attr("src");
		var div_left = jq(this).position().left;
		if(div_left > 191)	{
			jq(".face_view").css({
				"display":"block",
				"left":"0px",
				"margin-left":"5px"
			});
		}
		else {
			jq(".face_view").css({
				"display":"block",
				"left":"337px",
				"margin-left":"-13px"
			});
		}
		var html = "<img src='"+img_data+"'/>";
		jq(".face_view").html(html);
	});
    jq(document).on("mouseout",".face_cell",function(){
    	jq(".face_view").css({
    		"display":"none"
    	});
    });
	jq(document).on("click", ".face_cell", function() {
		var img_id = jq(this).children().data("index");
        var obj = jq(this).closest(".drop_face_menu");
        target = "#" + obj.data("target");
        document.getElementById(obj.data("target")).focus();
		var num=jq("#getNum").val();
		insertface(img_id, num ,target);

    });
    jq(document).on("click", ".drop_face", function(e) {
        e.preventDefault();
        popover_menu(jq(this), 208, 393, pop_info(14,57,1));
    });
    jq(document).on("click", ".layim_addface", function(e) {
        e.preventDefault();
        popover_menu(jq(this), 208, 393, pop_info(14,57,1), 'im');
    });

	jq(document).on("click",".face_header_a",function(e){
		e.preventDefault();
		var num = jq(this).data("num");
		if(num!=jq("#getNum").val())	{
			jq(this).parents(".drop_face_menu").find("table").animate({
			"margin-left":"-400px"
			},400,function(){
			
				jq(this).parents(".drop_face_menu").html(pop_info(14,face_num[num-1],num));
				jq(".drop_face_menu").find("table").css({
					"margin-left":"400px"	
				});
			
				jq(".drop_face_menu").find("table").animate({
					"margin-left":"0px"	
				},400);	
			});
		}
	});
  
	jq(document).on("click", function(e) {
        close_menu(e.target);
    });
	root.bailin_face = {};
})(window);
