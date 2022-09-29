import styled from 'styled-components';
import {
  MouseEventHandler, 
  ReactElement, 
  Ref, 
  useMemo,
  useEffect, 
  useState, 
  useRef
} from 'react';

import { Label } from '../Label';
import { DropdownItem, DropdownItemProps, DropdownItemWrapper } from './DropdownItem';
import { DropdownHeader } from './DropdownHeader';

interface DropdownProps {
  disabled?: boolean;
  expanded?: boolean;
  showLabel?: boolean;
  label?: string;
  labelPosition?: 'top' | 'left' | 'right';
  placeholder?: string; 
  selectedIndex?: number;
  options?: string[];
  ref?: Ref<HTMLDivElement>;
  onChange?: MouseEventHandler<HTMLDivElement>;
}

const StyledDropdownWrapper = styled.div<DropdownProps>`
  position: relative;
  display: flex;
  justify-content: left;
  margin: 12px;
  gap: 5px;

  flex-direction: ${(props) => {
    if (props.labelPosition === 'left') return 'row';
    if (props.labelPosition === 'right') return 'row-reverse';

    return 'column';
  }};

  align-items: ${(props) => props.labelPosition === 'top' ? 'start' : 'center'};

  opacity: ${(props) => props.disabled ? 0.25 : 1};
`;

const StyledDropdownMenu = styled.div<DropdownProps>`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  outline: none;
  border-radius: 4px;
  cursor: ${(props) => props.disabled ? 'inherit' : 'pointer'};

  .selected {
    background: ${(props) => props.theme.secondary.accent};
  }
`;

const DropdownMenu: React.FC<DropdownProps> = (props: DropdownProps) => {
  const { 
    showLabel, 
    label, 
    labelPosition, 
    disabled,
    options, 
    selectedIndex, 
    expanded, 
    placeholder 
  } = props;

  const [isExpanded, setExpanded] = useState(expanded as boolean);
  const [currentSelectedIndex, setSelectedIndex] = useState(selectedIndex as number);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => !disabled && setExpanded(!isExpanded);
  
  const collapseMenu = (event: MouseEvent) => {
    if (!dropdownRef.current) return;

    const targetPath = event.composedPath();

    if (event.target !== dropdownRef.current && !targetPath?.includes(dropdownRef.current)) {
      setExpanded(false);
    }
  };

  const selectOption: MouseEventHandler<HTMLDivElement> = (event) => {
    const targetElement = event.target as HTMLDivElement;
    const indexAttribute = targetElement.dataset.index ?? null;
    const targetIndex = indexAttribute === null ? -1 : parseInt(indexAttribute);
    
    setSelectedIndex(targetIndex);
    setExpanded(false);

    if (typeof props.onChange === 'function') {
      props.onChange(event);
    }
  };

  let dropdownItems: ReactElement<DropdownItemProps>[] = [];

  useMemo(() => {
    const items = options ?? [];
    
    dropdownItems = items.map((option, i) => {
      return (
        <DropdownItem
          key={i}
          data-index={i}
          text={option} 
          selected={currentSelectedIndex === i}
          onClick={selectOption}
        />
      );
    });
  }, [options, currentSelectedIndex, isExpanded]);

  useEffect(() => {
    document.addEventListener('click', collapseMenu);
  
    return () => {
      document.removeEventListener('click', collapseMenu);
    };
  }, []);

  return (
    <StyledDropdownWrapper
      labelPosition={labelPosition}
      disabled={disabled}
    >
      <Label 
        visible={showLabel} 
        text={label}
      />
      <StyledDropdownMenu ref={dropdownRef} {...props}>
        <DropdownHeader 
          onClick={toggleMenu}
          disabled={disabled} 
          expanded={isExpanded}
          empty={currentSelectedIndex === -1}
          text={dropdownItems[currentSelectedIndex]?.props.text ?? placeholder}
        />
        <DropdownItemWrapper visible={isExpanded}>
          {dropdownItems}
        </DropdownItemWrapper>
      </StyledDropdownMenu>
    </StyledDropdownWrapper>
  );
};

DropdownMenu.defaultProps = {
  disabled: false,
  expanded: false,
  showLabel: true,
  label: 'Select',
  labelPosition: 'left',
  placeholder: 'Placeholder Text',
  selectedIndex: -1,
  options: [],
};

export { DropdownMenu };
