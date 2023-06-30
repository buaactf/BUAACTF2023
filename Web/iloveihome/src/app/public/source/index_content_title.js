var showIntro = localStorage.getItem('showIntro');
var jq2=jQuery.noConflict();
    jq2(document).ready(function () {
        if (showIntro != 'no') {
            var intro = introJs();
            intro.setOptions({
                steps: [
                    {
                        intro: "<div style='border-bottom: 1px solid; font-size: 14px; width: 250px'><b style='font-size: 18px;'>邮箱验证</b></div><span style='font-size: 14px;'>邮箱验证后您可以拥有在ihome更多的权限。</span><div><a href='cp.php?ac=profile&op=contact' target='_blank' style='float: right;'>去验证</a></div><br>"
                    },
                    {
                        intro: "<div style='border-bottom: 1px solid; font-size: 14px; width: 250px'><b style='font-size: 18px;'>上传头像</b></div><span style='font-size: 14px;'>拥有自己独特的头像，让自己变的与众不同</span><div><a href='cp.php?ac=avatar' target='_blank' style='float: right;'>去上传</a></div><br>"
                    },
                    {
                        intro: "<div style='border-bottom: 1px solid; font-size: 14px; width: 250px'><b style='font-size: 18px;'>密保设置</b></div><span style='font-size: 14px;'>进行密码设置后，再也不用担心忘记密码了。</span><div><a href='cp.php?ac=protect' target='_blank' style='float: right;'>去设置</a></div><br>"
                    },
                    {
                        intro: "<div style='border-bottom: 1px solid; font-size: 14px; width: 250px'><b style='font-size: 18px;'>发诉求</b></div><span style='font-size: 14px;'>您可以尝试向我们的测试账号发起诉求，来了解诉求流程。</span><div><a href='#tab5' target='_blank' style='float: right;'>去发送</a></div><br>"
                    }
                ],
                exitOnOverlayClick: false,
                showBullets: false,
                nextLabel: '下一步',
                prevLabel: '上一步',
                skipLabel: '跳过',
                doneLabel: '开启ihome之旅'
            });

            intro.start();
            localStorage.showIntro = 'no';
        }
        ;


    });