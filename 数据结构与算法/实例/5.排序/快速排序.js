/**
 * 和归并排序一样，快速排序也使用分治的方法，
将原始数组分为较小的数组（但它没有像归并排序那样将它们分割开）。
(1) 首先，从数组中选择中间一项作为主元
(2) 创建两个指针，左边一个指向数组第一个项，右边一个指向数组最后一个项。移动左指
针直到我们找到一个比主元大的元素，接着，移动右指针直到找到一个比主元小的元素，然后交
换它们，重复这个过程，直到左指针超过了右指针。
(3) 接着，算法对划分后的小数组（较主元小的值组成的子数组，以及较主元大的值组成的
子数组）重复之前的两个步骤，直至数组已完全排序。

有bug,需调整
 */

var sortArray = function (nums) {
  quick(nums, 0, nums.length - 1);
  return nums;
};

function quick(list, left, right) {
  let index = 0;
  if (list.length > 1) {
    index = partition(list, left, right); // 帮助我们将子数组分离为较小值数组和较大值数组
    left < index - 1 && quick(list, left, index - 1);
    index < right && quick(list, index, right);
  }
}

function partition(list, left, right) {
  let mid = list[(right + left) >> 1];
  while (left <= right) {
    while (list[left] < mid) {
      left++;
    }
    while (list[right] > mid) {
      right--;
    }
    if (list[right] <= list[left]) {
      [list[left], list[right]] = [list[right], list[left]];
      left++;
      right--;
    }
  }
  return left; // 返回的其实是已排过序的最后一位的值
}

/**
 * @param {number[]} nums
 * @return {number[]}
 */
var sortArray = function (nums) {
  // 快速排序
  function quickSort(array, start = 0, end = array.length - 1) {
    if (start < end) {
      // 取基准值，将array的每个元素与基准值大小比对后放在基准值的左边或者右边
      let pivot = divide(array, start, end);
      // 对小于基准值的元素排序
      quickSort(array, start, pivot - 1);
      // 对大于基准值的元素排序
      quickSort(array, pivot + 1, end);
    }
    return array;
  }

  function divide(array, start, end) {
    // 取中位数作为pivot以避免基本有序时时间复杂度飙升的问题
    let mid = (start + end) >> 1; // 即mid = Math.floor((start + end) / 2);
    // 将中位数交换到开头
    [array[start], array[mid]] = [array[mid], array[start]];
    let pivot = start;

    // 构建一个[low, high]的滑动窗口，想要实现窗口里包含的都是大于pivot的数
    let low = start + 1;
    // 一开始窗口里还没有内容（low=high）
    for (let high = low; high <= end; high++) {
      // 找到的数是小于pivot的数
      if (array[high] < array[pivot]) {
        // 小于pivot的数丢到窗口的第一位去
        [array[low], array[high]] = [array[high], array[low]];
        // 将第一位挤出窗口
        low++;
      }
      // 大于pivot的数，则仅high++，使得窗口扩大
    }
    // 将pivot插回该在的位置
    // 区间(pivot, low-1]的数都小于pivot
    // 区间[low, high)的数都大于等于pivot
    // 故将pivot与low-1交换即可（不与low交换，是因为[low, high)可能没有包含任何的元素，是越界的）
    [array[pivot], array[low - 1]] = [array[low - 1], array[pivot]];
    return low - 1;
  }
  // 调用自定义快排函数
  return quickSort(nums);
};

/**
 *
 */
let sortArray = function (nums) {
  if (nums.length < 2) return nums;
  return quickSort(nums, 0, nums.length - 1);
};

function quickSort(nums, left, right) {
  if (left >= right) return;
  let pivotIndex = partition(nums, left, right);
  quickSort(nums, left, pivotIndex - 1);
  quickSort(nums, pivotIndex + 1, right);
  return nums;
}

/**
 * 将最后一位设为中位数，当小于pivot，则加入到左侧，否则进行交换
 *
 * @param {*} nums
 * @param {*} left
 * @param {*} right
 * @returns
 */
function partition(nums, left, right) {
  let pivot = right; // 这里取最后一个顶点
  let leftIndex = left;

  // 然后通过左侧判断，得到是否有例外情况比如之前都是顺序队列，也是为了确认是否可忽略这些判断，直接跳到要排序的地方
  for (let i = left; i < right; i++) {
    if (nums[i] < nums[pivot]) {
      [nums[leftIndex], nums[i]] = [nums[i], nums[leftIndex]];
      leftIndex++;
    }
  }
  [nums[leftIndex], nums[pivot]] = [nums[pivot], nums[leftIndex]];
  return leftIndex;
}

/**
 * 更简单的方法,直接把数组做一个拆分,拆完之后分区存储,之后再拆
 * 不好的点是,如果数字大的在前面,则算法的时间复杂度会上升很多
 * @param {*} nums 
 * @returns 
 */
var sortArray = function(nums) {
    if( nums.length <= 1 ) return nums
    let left = []
    let right = []
    let pivotIndex  = Math.floor(nums.length / 2)
    let pivotValue =  nums.splice(pivotIndex,1)[0]
    for(let i = 0; i < nums.length; i++ ){
        if(nums[i] > pivotValue){
            right.push(nums[i])
        }else{
            left.push(nums[i])
        }
    }
    return sortArray(left).concat(pivotValue,sortArray(right))
};

/**
 * 新的分界点计算方法
 * @param {*} nums 
 * @returns 
 */
let sortArray = (nums) => {
  // 首先是边界条件,然后是确认边界,开始递归
  if (nums.length < 2) return nums;

  return quickSort(nums, 0, nums.length - 1);
};

function quickSort(nums, left, right) {
  // 这里也需要确认边界,当left>=right时,说明不再需要递归了
  if (left >= right) return;

  let p = partition(nums, left, right);

  quickSort(nums, left, p - 1);
  quickSort(nums, p + 1, right);

  return nums;
}

/**
 * 重点就是如果获取分界点这里的计算
 * 这是新的方法,弥补pivot取最后一位的不足
 * @param {*} nums
 * @param {*} left
 * @param {*} right
 */
function partition(arr, start, end) {
  // 防止顺序或者乱序数组
  if (end > start) {
    swap(arr, start, start + Math.floor((end - start) / 2));
  }

  let pivot = arr[start],
    j = start;

  for (let i = start + 1; i <= end; i++) {
    if (arr[i] < pivot) {
      if (++j === i) continue;
      swap(arr, i, j);
    }
  }

  swap(arr, start, j);
  return j;
}

function swap(arr, i, j) {
  let tmp = arr[i];
  arr[i] = arr[j];
  arr[j] = tmp;
}
