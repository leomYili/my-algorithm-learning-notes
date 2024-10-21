function quickSort(arr, left, right) {
  if (arr.length < 2) return arr;

  let len = arr.length, partitionIndex;
  let left = typeof left != "number" ? 0 : left;
  let right = typeof right != "number" ? len - 1 : right;

  if (arr[left] < arr[right]) {
    partitionIndex = partition(arr, left, right);
    quickSort(arr, left, partitionIndex - 1);
    quickSort(arr, partitionIndex + 1, right);
  }

  return arr;
}

function partition(arr, left, right) {
  let pivot = left,
    index = pivot + 1;

  for (let i = index; i < right; i++) {
    if (arr[i] < arr[pivot]) {
      swap(arr, i, index);
      index++;
    }
  }

  swap(arr, pivot, index - 1);

  return index - 1;
}

function swap(arr, i, j) {
  let tmp = arr[i];
  arr[i] = arr[j];
  arr[j] = tmp;
}

// splice

Array.prototype.newSplice = (start, deleteCount, ...items) => {
  if (start < 0) {
    if (Math.abs(start) > this.length) {
      start = 0;
    } else {
      start += this.length;
    }
  }

  if (typeof deleteCount === "undefined") {
    deleteCount = this.length - start;
  }

  let removeList = this.slice(start, start + deleteCount);

  let right = this.slice(start + deleteCount);

  let addIndex = start;

  items.concat(right).forEach((item) => {
    this[addIndex] = item;
    addIndex++;
  });

  this.length = addIndex;

  return removeList
}

function quickSort1(arr, left, right) {
  if (arr.length < 2) return arr;

  let len = arr.length;
  let partitionIndex;
  let left = typeof left != "number" ? 0 : left;
  let right = typeof right != "number" ? len - 1 : right;

  if (left < right) {
    partitionIndex = partition(arr, left, right);
    quickSort1(arr, left, partitionIndex - 1);
    quickSort1(arr, partitionIndex + 1, right);
  }

  return arr;
}

function partition(arr, left, right) {
  let pivot = left;
  let index = pivot + 1;

  for (let i = index; i < right; i++) {
    if (arr[i] < arr[pivot]) {
      swap(arr, i, index);
      index++
    }
  }

  swap(arr, pivot, index - 1);
  return index - 1;
}

function swap(arr, i, j) {
  let tmp = arr[i];
  arr[i] = arr[j];
  arr[j] = tmp;
}