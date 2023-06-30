jQuery('#message').on('change keyup paste', function () {
    if (jQuery('#add').hasClass('askbag')) {
        var temp = jQuery('#message').val();
        if (temp.match(/@.+\(\d+\)/)) {
            jQuery('.complain_tip').hide();
            jQuery('#add').removeAttr('disabled');
        } else {
            jQuery('.complain_tip').show();
            jQuery('#add').attr('disabled', 'disabled');
        }
    }
    ;
});
jQuery(function () {
    jQuery(document).click(function (e) {
        if (jQuery(e.target).is('.a_share_group')) return;
        if (jQuery(e.target).is('.social_share')) return;
        jQuery('.a_share_group').hide();
    });
});

function social_share(id) {
    if (jQuery('#a_share_group_' + id).is(":visible")) {
        jQuery('#a_share_group_' + id).hide();
        return;
    }
    ;
    jQuery('.a_share_group').hide();
    jQuery('#a_share_group_' + id).show();

    window._bd_share_main = undefined;
    var bdUrl = jQuery('#bdshare_content_' + id).data('url');
    var bdContent = jQuery('#bdshare_content_' + id).data('content');
    var temp = /(.*?)\s*(?:：|:)\s*(.*)/.exec(bdContent);
    bdContent = temp[2] + ' - ' + temp[1];
    window._bd_share_config = {
        common: {
            bdText: bdContent + ' - 小橘子的家',
            bdDesc: bdContent + ' - 小橘子的家',
            bdUrl: location.origin + bdUrl,
            bdSign: 'off'
        },
        share: [{
            "bdSize": 16
        }]
    };
    bdContent = encodeURIComponent(bdContent);
    jQuery('#a_share_group_' + id + ' .bds_renren').click(function () {
        var baseUrl = 'http://widget.renren.com/dialog/share?';
        baseUrl += 'resourceUrl=' + encodeURIComponent(location.origin + bdUrl);
        baseUrl += '&srcUrl=' + encodeURIComponent(location.origin + bdUrl);
        baseUrl += '&pic=' + encodeURIComponent(location.origin + '/image/share_logo.jpg');
        baseUrl += '&title=' + '来自小橘子的家';
        baseUrl += '&description=' + bdContent + ' - 北航ihome';

        window.open(baseUrl);
    });
    jQuery('#a_share_group_' + id + ' .bds_qzone').click(function () {
        var baseUrl = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?';
        baseUrl += 'url=' + encodeURIComponent(location.origin + bdUrl);
        baseUrl += '&summary=' + bdContent + ' - 小橘子的家';
        baseUrl += '&title=' + '来自小橘子的家';
        baseUrl += '&site=' + encodeURIComponent(location.origin + bdUrl);

        window.open(baseUrl);
    });
    jQuery('#a_share_group_' + id + ' .bds_sqq').click(function () {
        var baseUrl = 'http://connect.qq.com/widget/shareqq/index.html?';
        baseUrl += 'url=' + encodeURIComponent(location.origin + bdUrl);
        baseUrl += '&title=' + '来自小橘子的家';
        baseUrl += '&desc=' + bdContent + ' - 小橘子的家';
        baseUrl += '&site=baidu';

        window.open(baseUrl);
    });
    with (document) 0[(getElementsByTagName('head')[0] || body).appendChild(createElement('script')).src = 'http://bdimg.share.baidu.com/static/api/js/share.js?cdnversion=' + ~(-new Date() / 36e5)];
}