function extend(target){
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i]
        for (var key in source) {
            if (key === '__proto__') {
                return;
            }
            if (hasOwnProperty.call(source, key)) {
                if (key in source && key in target) {
                    extend(target[key], source[key])
                } else {
                    target[key] = source[key]
                }
            }
        }
    }
    return target
};

jQuery(function ($) {
    var endtime = new Date(parseInt("" + "000"));
    jQuery.fn.datetimepicker.defaults = {
        pickDate: true,                 //en/disables the date picker
        pickTime: false,                 //en/disables the time picker
        useMinutes: false,               //en/disables the minutes picker
        useSeconds: false,               //en/disables the seconds picker
        useCurrent: true,               //when true, picker will set the value to the current date/time
        minuteStepping: 1,               //set the minute stepping
        minDate: '20130505',               //set a minimum date
        maxDate: endtime,     //set a maximum date (defaults to today +100 years)
        showToday: true,                 //shows the today indicator
        language: 'zh-cn',                  //sets language locale
        defaultDate: endtime,                 //sets a default date, accepts js dates, strings and moment objects
        disabledDates: [],               //an array of dates that cannot be selected
        enabledDates: [],                //an array of dates that can be selected
        icons: {
            time: 'glyphicon glyphicon-time',
            date: 'glyphicon glyphicon-calendar',
            up: 'glyphicon glyphicon-chevron-up',
            down: 'glyphicon glyphicon-chevron-down'
        },
        useStrict: false,               //use "strict" when validating dates
        sideBySide: false,              //show the date and time picker side by side
        daysOfWeekDisabled: []          //for example use daysOfWeekDisabled: [0,6] to disable weekends
    };
    var hajime = new Date(parseInt("" + "000"));
    jQuery('#starttime').datetimepicker({
        defaultDate: hajime
    });
    jQuery('#endtime').datetimepicker({
        minDate: hajime
    });
    jQuery("#starttime").on("dp.change", function (e) {
        jQuery('#endtime').data("DateTimePicker").setMinDate(e.date);
    });
    jQuery("#endtime").on("dp.change", function (e) {
        jQuery('#starttime').data("DateTimePicker").setMaxDate(e.date);
    });
    if (window.navigator.userAgent.indexOf('MSIE') != -1) {
        var _oldhide = jQuery.fn.hide;
        jQuery('table.table-condensed').on('mousedown', function (e) {
            jQuery.fn.hide = function () {
            };
        });
        jQuery('table.table-condensed').on('mouseup', function () {
            jQuery.fn.hide = _oldhide;
        });
    }
    $(function() {
        var appeal = {'群公告': {'msg':'ihome就是我们的家，我们要好好维护她'}};
        fetch('/appeal/get', {
            method: 'get', 
            credentials: 'same-origin'
        }).then(response => response.json())
        .then(data =>  {
            extend(appeal,data);
            for(let key of Object.keys(appeal)){
                var title = key;
                var content = JSON.stringify(appeal[key]);
                var comment = '6';
                if(key == 'appeal')title = '我的诉求',comment = "管理员还没上班，别急";
                else if(key == 'comment') {
                    title = '我的动态' ;
                }
                if(appeal[key]['msg'])content=appeal[key]['msg'];
                if(appeal[key]['comment'] && key == 'appeal')comment=appeal[key]['comment'];
                var newElement = $("<div class='panel panel-default'><h5 class='panel-heading'></h5><p class='panel-body'></p><div class='panel-footer'></div></div>");
                newElement.find(".panel-heading").text(title);
                newElement.find(".panel-body").text(content);
                newElement.find(".panel-footer").text('管理员回复: '+ comment);
                $("#content").append(newElement);
            }
            
        });
        console.log(1);
    });
});
