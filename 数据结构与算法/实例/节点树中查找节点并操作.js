/**
 * 原数组中数据不太完善，在转换的过程中加入递增的id来确认即可
 * @param {*} Page
 */
function filterListParentStyle({ rootComponent }) {
    // 首先需要把该树形结构转为一维的数组

    let arr = [];

    let num = 0;

    function flatTree(item, result, pid) {
        let { type, style, children } = item;

        let newId = num++;

        let _result = [{ type, pid, id: newId, style }];

        if (Array.isArray(children) && children.length) {
            children.reduce((result, data) => {
                result.push(...flatTree(data, result, newId));
                return result;
            }, _result);
        }

        return _result;
    }

    arr = flatTree(rootComponent, [], num);

    for (let i = 0; i < arr.length; i++) {
        if (arr[i].type === "list" && i - 1 >= 0) {
            console.log("tryerer");
            delete arr[i - 1].style;
        }
    }

    // 处理完毕，开始转为tree

    function arrayToTree(arr) {
        const result = [];
        const itemMap = {};

        for (let item of arr) {
            const id = item.id;
            const pid = item.pid;

            // 初始化
            if (!itemMap[id]) {
                itemMap[id] = {
                    children: [],
                };
            }

            itemMap[id] = {
                type: item.type,
                style: item.style,
                children: itemMap[id]["children"],
            };
    
            const treeItem = itemMap[id];
    
            if (pid === 0) {
                result.push(treeItem);
            } else {
                if (!itemMap[pid]) {
                    itemMap[pid] = {
                        children: [],
                    };
                }
                itemMap[pid].children.push(treeItem);
            }
    
        }
        
        return result;
    }

    return arrayToTree(arr);
}

