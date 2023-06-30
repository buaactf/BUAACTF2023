jq('#close_client').click(function () {
    jq('#client').hide();
});
jq('#client .img').hover(function () {
    jq('.client_s').hide();
    jq('#close_client').hide();
    jq('.client_l').show();
});
jq('#client .img').mouseleave(function () {
    jq('.client_l').hide();
    jq('.client_s').show();
    jq('#close_client').show();
});
