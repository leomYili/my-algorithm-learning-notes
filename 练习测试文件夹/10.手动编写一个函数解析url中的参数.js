function parse(url) {
  // 一、夹杂在 ? 与 # 之前的字符就是 qs，使用 /\?([^/?#:]+)#?/ 正则来抽取
  // 使用正则从 URL 中解析出 querystring
  // 二、通过 Optional Chain 来避免空值错误
  const queryString = url.match(/\?([^/?#:]+)#?/)?.[1];
  // 当然,也可以 let queryString = url ? url.split('?')[1] : window.location.search.slice(1);
  // 然后 queryString = queryString.split('#')[0];

  if (!queryString) {
    return {};
  }

  queryObj = queryString.split("&").reduce((params, block) => {
    // 三、如果未赋值，则默认为空字符串
    const [_k, _v = ""] = block.split("=");
    // 四、通过 decodeURIComponent 来转义字符，切记不可出现在最开头，以防 ?tag=test&title=1%2B1%3D2 出错
    const k = decodeURIComponent(_k);
    const v = decodeURIComponent(_v);

    if (params[k] !== undefined) {
      // 处理 key 出现多次的情况，设置为数组
      params[k] = [].concat(params[k], v);
    } else {
      params[k] = v;
    }
    return params;
  }, {});
  return queryObj;
}

function flat(arr, deep) {
  return deep === 0
    ? arr.slice()
    : arr.reduce(
        (sub, value) =>
          sub.concat(Array.isArray(value) ? flat(value, dep - 1) : value),
        []
      );
}
