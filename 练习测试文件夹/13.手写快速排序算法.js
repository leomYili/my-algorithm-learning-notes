// 8月23日,重新手写快速排序算法

let sortArray = (arr) => {
  if (arr.length < 2) return arr;

  return quickSort(arr, 0, arr.length - 1);
};

let quickSort = (nums, left, right) => {
  // 边界条件
  if (left >= right) return;

  let p = partition(nums, left, right);

  quickSort(nums, left, p - 1);
  quickSort(nums, p + 1, right);

  return nums;
};

function partition(nums, left, right) {
  // 为了防止顺序或倒序数组每次重新选取中点
  if (right > left) {
    swap(nums, left, left + Math.floor((right - left) / 2));
  }

  let pivot = nums[left];
  let j = left;

  // 注意,这里不能忘记边界条件
  for (let i = left + 1; i <= right; i++) {
    if (nums[i] < pivot) {
      if (++j === i) continue;

      swap(nums, i, j);
    }
  }

  swap(nums, left, j);
  return j;
}

function swap(nums, i, j) {
  let tmp = nums[i];
  nums[i] = nums[j];
  nums[j] = tmp;
}


