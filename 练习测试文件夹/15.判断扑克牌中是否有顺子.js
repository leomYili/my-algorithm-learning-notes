/**
 * 这里千万不要想复杂
 * 首先需要先排序,且需要去掉0,因为0会让判断不稳定
 * 然后排完序的数组最大值-最小值是否小于等于4,因为只有这样,才能保证有足够的位置放置同花顺
 * 再判断是否有重复的数字,nums[i] === nums[i+1]
 */

 var isStraight = function (nums) {
  // 先将 nums 从小到大进行排序，再把数组中的 0 去掉
  nums = nums.sort((a, b) => a - b).filter(item => item !== 0)
  // 找出数组中的最大数与最小数，分别在数组的头和尾，判断它们的差是否超过 4，超过则说明不是连续的
  if (nums[nums.length - 1] - nums[0] > 4) return false 

  // 遍历数组找出是否有重复的数字，因为涉及到 i + 1，所以遍历长度是 数组长度-1
  for (let i = 0; i < nums.length - 1; i++) {
    if (nums[i] === nums[i + 1]) return false
  }
  return true
};