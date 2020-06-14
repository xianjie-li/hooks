import { FormLikeWithExtra, useFn, useFormState } from '@lxjx/hooks';
import { useMemo } from 'react';

export interface UseCheckConf<T, OPTION>
  extends FormLikeWithExtra<T[], OPTION[]> {
  /** 选项数组 */
  options: OPTION[];
  /** 所有禁用值 */
  disables?: T[];
  /** 当option子项为对象类型时，传入此项来决定从该对象中取何值作为实际的选项值  */
  collector?: (item: OPTION) => T;
}

/** checked可以允许存在options中不存在的值， 所有选中, 局部选中都只针对传入选项来确定 */
export interface UseCheckReturns<T, OPTION> {
  /** 部分值被选中 */
  partialChecked: boolean;
  /** 是否全部选中 */
  allChecked: boolean;
  /** 没有任何值被选中 */
  noneChecked: boolean;
  /** 被选中值, 存在collector时所有check项都会先走collector */
  checked: T[];
  /** 被选中的原始值，不走collector，未传collector时与check表现一致 */
  originalChecked: OPTION[];
  /** 检测值是否被选中 */
  isChecked: (val: T) => boolean;
  /** 检测值是否被禁用 */
  isDisabled: (val: T) => boolean;
  /** 选中传入的值 */
  check: (val: T) => void;
  /** 取消选中传入的值 */
  unCheck: (val: T) => void;
  /** 选择全部值 */
  checkAll: () => void;
  /** 取消选中所有值 */
  unCheckAll: () => void;
  /** 反选, 返回反选后的值 */
  toggle: (val: T) => boolean | undefined;
  /** 反选所有值 */
  toggleAll: () => void;
  /** 一次性设置所有选中的值, 不影响禁用项 */
  setChecked: (nextChecked: T[]) => void;
  /** 指定值并设置其选中状态 */
  setCheckBy: (val: T, isChecked: boolean) => void;
}

export function useCheck<T, OPTION = T>(
  conf: UseCheckConf<T, OPTION>
): UseCheckReturns<T, OPTION> {
  const { options = [], disables = [], collector } = conf;

  /** 提取所有选项值 */
  const items = useMemo(() => {
    return collector
      ? options.map(item => collector(item))
      : ((options as unknown) as T[]);
  }, [options, disables]);

  const [checked, setChecked] = useFormState<T[], OPTION[]>(conf, []);

  /** 提取所有禁用项 */
  // const disabledCheckVal = useMemo(() => {
  //   return checked.filter(item => disables.includes(item));
  // }, [checked, disables]);

  const isChecked = useFn((val: T) => checked.includes(val));

  const isDisabled = useFn((val: T) => disables.includes(val));

  const check = useFn((val: T) => {
    if (isDisabled(val)) return;
    const index = checked.indexOf(val);
    if (index === -1) {
      setCheckedWithOptions([...checked, val]);
    }
  });

  const unCheck = useFn((val: T) => {
    if (isDisabled(val)) return;
    const index = checked.indexOf(val);
    if (index !== -1) {
      const temp = [...checked];
      temp.splice(index, 1);
      setCheckedWithOptions(temp);
    }
  });

  const checkAll = useFn(() => {
    setCheckedWithOptions(getEnables());
  });

  const unCheckAll = useFn(() => {
    setCheckedWithOptions(getEnables(false));
  });

  const toggle = useFn((val: T) => {
    if (isDisabled(val)) return;
    const index = checked.indexOf(val);
    if (index === -1) {
      setCheckedWithOptions([...checked, val]);
    } else {
      const newArray = [...checked];
      newArray.splice(index, 1);
      setCheckedWithOptions(newArray);
    }
    return index !== -1;
  });

  const toggleAll = useFn(() => {
    const reverse = items.filter(item => {
      const _isDisabled = isDisabled(item);
      const _isChecked = isChecked(item);
      if (_isDisabled) return _isChecked; // 如果禁用则返回、
      return !_isChecked;
    });
    setCheckedWithOptions(reverse);
  });

  const setCheck = useFn((nextChecked: T[]) => {
    // 只选中列表中未被禁用的项
    const extra = nextChecked.filter(item => {
      if (isDisabled(item)) {
        return isChecked(item);
      }
      return true;
    });
    setCheckedWithOptions([...extra]);
  });

  const setCheckBy = useFn((val: T, _isChecked: boolean) => {
    if (isDisabled(val)) return;
    _isChecked ? check(val) : unCheck(val);
  });

  /** setChecked的额外包装，传入option */
  function setCheckedWithOptions(_checked: T[]) {
    setChecked(_checked, getCheckedOptions(_checked));
  }

  /** 获取所有选项，传入false时，返回空数组。所有禁用项会以原样返回 */
  function getEnables(isCheck = true) {
    return items.filter(item => {
      const _isDisabled = isDisabled(item);

      // 如果是禁用项则根据选中状态返回
      if (_isDisabled) {
        return isChecked(item);
      }
      return isCheck;
    });
  }

  /** 获取所有已选中的选项 */
  function getCheckedOptions(_checked: T[]) {
    if (!collector) return (_checked as unknown) as OPTION[];
    return options.filter(item => {
      return _checked.includes(collector(item));
    });
  }

  /** 判断是否局部选中, 是否所有选中 */
  function getCheckStatus() {
    let checkLen = 0;
    let maxLength = items.length;
    items.forEach(item => {
      if (isChecked(item)) {
        checkLen++;
      }
    });
    return {
      /** 部分值被选中 */
      partialChecked: checkLen > 0 && checkLen !== maxLength,
      /** 是否全部选中 */
      allChecked: checkLen === maxLength,
    };
  }

  /**
   * checked可以允许存在options中不存在的值， 所有选中, 局部选中都只针对传入选项来确定 */
  return {
    ...getCheckStatus(),
    checked,
    originalChecked: getCheckedOptions(checked),
    noneChecked: checked.length === 0,
    isChecked,
    isDisabled,
    check,
    unCheck,
    checkAll,
    unCheckAll,
    toggle,
    toggleAll,
    setChecked: setCheck,
    setCheckBy,
  };
}
