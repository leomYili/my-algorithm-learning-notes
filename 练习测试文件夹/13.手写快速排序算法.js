let sortArray = (nums) => {
  // 首先是边界条件,数组长度必须大于等于2,才能开始快速排序
  if (nums.length < 2) return nums;

  return quickSort(nums, 0, nums.length - 1);
};

let quickSort = (nums, left, right) => {
  // 这里是一个递归函数,也需要边界来中止,当left >= right时,实际上就不用再进行排序了
  if (left >= right) return;

  let p = partition(nums, left, right);

  quickSort(nums, left, p - 1);
  quickSort(nums, p + 1, right);

  return nums;
};

/**
 * 计算分界点的函数
 * @param {*} nums
 * @param {*} left
 * @param {*} right
 */
let partition = (nums, left, right) => {
  // 这里修改计算方式,首先防止顺序数组
  if (right > left) {
    swap(nums, left, left + Math.floor((right - left) / 2));
  }

  // 然后从left开始计数
  let pivot = nums[left];
  let j = left;

  // 这里从left+1执行到right即可
  for (let i = left + 1; i <= right; i++) {
    if (nums[i] < pivot) {
      if (++j === i) continue;

      swap(nums, i, j);
    }
  }

  swap(nums, left, j);

  return j;
};

function swap(nums, i, j) {
  let tmp = nums[i];
  nums[i] = nums[j];
  nums[j] = tmp;
}
