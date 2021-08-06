# 正文

> nSum原先看是可以通过滑动窗口双指针来解，这里不太清除还可以怎么解

## 这里不再用暴力破解，之前在leetcode记忆的方法是暴力破解，而这里采用双指针

```()
// 最重要的部分

// 先排序
sort((a,b) => a-b);

// 左闭右闭
let left = 0;
let right = nums.length - 1;

let res = [];

while(left < right){
    let subSum = nums[left] + nums[right];
    let leftRes = nums[left],rightRes = nums[right];
    if(sum < target){
        // 重复
        while(left < right && nums[left] === leftRes) left++;
    }else if(sum > target){
        // 重复
        while(left < right && nums[right] === rightRes) right--;
    }else{
        // 说明相等，但也需要处理重复问题
        res.push({left,right});
        while(left < right && nums[left] === leftRes) left++;
        while(left < right && nums[right] === rightRes) right--;
    }
}

return res;
```

## 3Sum

拿到了2sum之和之后，可以发现，三数之和完全可以站在二数之和的基础上，就是除了三数的第一个数为 nums[i],
剩下两个数就是2sum的结果

所以遍历nums，且给2sum函数加上left 的起始位置即可

只是要注意第一个数字不能重复
所以需要

```()
while(i < n -1 && nums[i] === nums[i-1]) i++;
```

来跳过开头重复的数字

## 4Sum

则是继续调用3Sum即可

## 结尾

因此，上面可以形成递归，一层层简化到2sum即可。