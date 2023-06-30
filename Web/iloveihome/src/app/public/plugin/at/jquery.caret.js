//Copyright (c) 2012 chord.luo@gmail.com
var jq = jQuery.noConflict();
(function() {

  (function(jq) {
    var getCaretPos, setCaretPos;
    getCaretPos = function(inputor) {
      var end, endRange, len, normalizedValue, pos, range, start, textInputRange;
      if (document.selection) {
        range = document.selection.createRange();
        pos = 0;
        if (range && range.parentElement() === inputor) {
          normalizedValue = inputor.value.replace(/\r\n/g, "\n");
          len = normalizedValue.length;
          textInputRange = inputor.createTextRange();
          textInputRange.moveToBookmark(range.getBookmark());
          endRange = inputor.createTextRange();
          endRange.collapse(false);
          if (textInputRange.compareEndPoints("StartToEnd", endRange) > -1) {
            start = end = len;
          } else {
            start = -textInputRange.moveStart("character", -len);
            end = -textInputRange.moveEnd("character", -len);
          }
        }
      } else {
        start = inputor.selectionStart;
      }
      return start;
    };
    setCaretPos = function(inputor, pos) {
      var range;
      if (document.selection) {
        range = inputor.createTextRange();
        range.move("character", pos);
        return range.select();
      } else {
        return inputor.setSelectionRange(pos, pos);
      }
    };
    return jq.fn.caretPos = function(pos) {
      var inputor;
      inputor = this[0];
      inputor.focus();
      if (pos) {
        return setCaretPos(inputor, pos);
      } else {
        return getCaretPos(inputor);
      }
    };
  })(window.jQuery);

}).call(this);
