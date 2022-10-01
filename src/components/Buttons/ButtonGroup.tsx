import React, { useState } from 'react';
import { MouseEventHandler } from 'react';
import { FlexProps, FlexContainer } from '../Containers/FlexContainer';
import { ButtonProps } from './Button';

interface ButtonGroupProps extends FlexProps {
  selectedIndex?: number;
  listener?: (selectedIndex: number) => void;
}

const ButtonGroup: React.FC<ButtonGroupProps> = (props: ButtonGroupProps) => {
  const { listener, children, selectedIndex } = props;

  const [currentIndex, setSelectedIndex] = useState(selectedIndex as number);

  const selectButton: MouseEventHandler<HTMLButtonElement> = (event) => {
    const targetElement = event.target as HTMLButtonElement;
    const parentElement = targetElement.parentElement;
    const children = parentElement?.children ? [...parentElement.children] : [];

    const targetIndex = children.findIndex((c) => c === targetElement);

    if (targetIndex === -1) return;

    if (targetIndex === currentIndex) {
      setSelectedIndex(-1);
      
      return;
    }

    setSelectedIndex(targetIndex);

    if (typeof listener === 'function') {
      listener(targetIndex);
    }
  };

  const childrenWithIndex = React.Children.map(children, (child, index) => {
    return React.cloneElement<ButtonProps>(child as any, {
      toggled: currentIndex === index,
      onClick: selectButton,
    });
  });

  return <FlexContainer {...props}>{childrenWithIndex}</FlexContainer>;
};

ButtonGroup.defaultProps = {
  selectedIndex: -1,
  padding: 0,
  gap: 0,
};

export { ButtonGroup };
