/**
 * @param {string[]} strs
 * @return {string}
 */
 var longestCommonPrefix = function(strs) {
  // 两两比较即可，没必要想复杂
  if(strs.length === 0 || strs[0] === "") return "";

  let res = strs[0];// 选中第一条为标准，都可以

  // 这里的item才是字符串
  for(let i=0;i<strs.length;i++){
      let j = 0;// 为字符串开始计数

      for(;j <res.length && j < strs[i].length;j++){
          if(res[j] !== strs[i][j]) break;// 终止循环，返回j
      }

      res = res.substr(0,j);
  }

  return res;
};