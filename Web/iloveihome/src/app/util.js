// this is my lifelong learning, you cannot break into my ihome!!! 
const banWords = ['javascript:window', '<', '>', 'data:text/html', 'alert', 'confirm', 'expression', 'prompt', 'benchmark', 'sleep', 'group', 'concat', 'bcase', 'when', 'load_file', 'or4nge','and',  'bin', 'blike', 'script', 'exec', 'union', 'select', 'update', 'set', 'insert', 'into', 'values', 'from', 'create',  'alterdrop', 'truncate', 'table', 'database', 'onerror', 'onmousemove', 'onload', 'onclick', 'onmouseover', 'file_put_contents', 'file_get_contents', 'fwrite', 'base64_decode', 'shell_exec', 'eval', 'assert', 'system', 'exec', 'passthru', 'pcntl_exec', 'popen', 'proc_open', 'print_r', 'extractvalue', 'data', 'ftp', 'php', 'regexp', '=', 'sleep', '0x', 'file', 'dict'];

function purify_string(str, replaceword) {
  console.log(str);
  for (const bad of banWords) {
    str = str.toLowerCase().replace(bad, replaceword);
  }
  return str;
}


function purify(obj, banedword, replaceword) {
  if(typeof obj === 'string'){
    return obj.replace(banedword, replaceword);
  }
    for (let key in obj) {
      console.log(key);
        if (obj.hasOwnProperty(key)) {
          console.log(key, typeof obj[key]);
          if (typeof obj[key] === 'object') {
            obj[key] = purify(obj[key]); // 递归处理对象类型的值
          } else if (typeof obj[key] === 'string') {
            obj[key] = obj[key].replace(banedword, replaceword);
          }
        }
      }
      return obj;
}

module.exports = {
  purify: purify,
  purify_string: purify_string
};