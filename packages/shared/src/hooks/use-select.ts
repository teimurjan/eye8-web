import React from 'react';

import { SelectOptionProps, SelectMultipleValue, SelectOptionChild, SelectValue } from '@eye8/shared/components';
import { useForceUpdate, useScrollPosition } from '@eye8/shared/hooks';
import { reactChildrenFind } from '@eye8/shared/utils';

export interface Props {
  children: Array<SelectOptionChild>;
  value: SelectValue;
  onChange?: (value: SelectValue) => void;
  onLoadMore?: () => void;
  isLoading?: boolean;
  searchable?: boolean;
  multiple?: boolean;
}

const getSelectedOptions = ({ children, value }: Pick<Props, 'children' | 'value'>) => {
  if (Array.isArray(value)) {
    return value.reduce<SelectOptionProps[]>((acc, optionValue) => {
      const childFound = reactChildrenFind(children, (child) => child.props.value === optionValue);
      return childFound ? [...acc, childFound.props] : acc;
    }, []);
  }

  const childFound = reactChildrenFind(children, (child) => child.props.value === value);
  return childFound ? [childFound.props] : [];
};

const LOAD_MORE_SCROLL_OFFSET = 100;
const hasScrolledToLoad = (el: HTMLElement, scrollTop: number) => {
  const { scrollHeight, clientHeight } = el;
  return scrollHeight - scrollTop - LOAD_MORE_SCROLL_OFFSET <= clientHeight;
};

const useSelect = ({
  children: originalChildren,
  onChange,
  value,
  onLoadMore,
  isLoading,
  searchable,
  multiple = false,
}: Props) => {
  const optionsContainerRef = React.useRef<HTMLDivElement>(null);
  const selectedOptions = getSelectedOptions({ children: originalChildren, value });
  const { update, dep } = useForceUpdate();
  const [searchQuery, setSearchQuery] = React.useState('');

  const scrollPos = useScrollPosition(optionsContainerRef);

  React.useEffect(() => {
    if (
      optionsContainerRef.current &&
      hasScrolledToLoad(optionsContainerRef.current, scrollPos.top) &&
      onLoadMore &&
      !isLoading
    ) {
      onLoadMore();
    }
  }, [optionsContainerRef, isLoading, onLoadMore, scrollPos, dep, searchQuery]);

  const onSearch = searchable ? setSearchQuery : undefined;
  const onClose = () => onSearch && onSearch('');

  const getChildOnClick = (child: SelectOptionChild) => () => {
    if (!onChange) {
      return;
    }

    let nextValue: SelectValue = child.props.value;
    if (multiple && child.props.value) {
      const castedValue = value as SelectMultipleValue;
      const selected = castedValue.includes(child.props.value);
      nextValue = selected
        ? castedValue.filter((optionValue) => optionValue !== child.props.value)
        : [...castedValue, child.props.value];
    }

    onChange(nextValue);
  };
  const children = originalChildren
    .filter((child) =>
      searchable && child.props.name && searchQuery.trim().length > 0
        ? child.props.name.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1
        : true,
    )
    .map((child) => {
      const selected = Array.isArray(value) ? value.includes(child.props.value!) : child.props.value === value;

      return React.cloneElement(child, {
        ...child.props,
        selected,
        onClick: getChildOnClick(child),
      });
    });

  const triggerOnChange = React.useCallback(
    (options: Array<SelectOptionProps>) => {
      if (!onChange) {
        return;
      }

      onChange(multiple ? options.map((option) => option.value!) : options[0]?.value);
    },
    [onChange, multiple],
  );

  return {
    onOpen: update,
    onClose,
    onSearch,
    selectedOptions,
    children,
    triggerOnChange,
    searchQuery,
    optionsContainerRef,
  };
};

export default useSelect;
