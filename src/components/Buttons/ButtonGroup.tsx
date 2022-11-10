import React, { MouseEvent, EventHandler, useState } from 'react';
import { FlexProps, FlexContainer } from '../Containers/FlexContainer';

type SelectEvent<T = HTMLButtonElement> = MouseEvent<T> & {
  selectedIndex: number;
};

type SelectEventHandler<T = HTMLButtonElement> = EventHandler<SelectEvent<T>>;

interface ButtonGroupProps extends FlexProps {
  selectedIndex?: number;
  children?: JSX.Element[];
  onClick?: SelectEventHandler;
}

const ButtonGroup: React.FC<ButtonGroupProps> = (props: ButtonGroupProps) => {
  const {
    selectedIndex,
    onClick,
  } = props as Required<ButtonGroupProps>;

  const [currentIndex, setCurrentIndex] = useState(selectedIndex);

  const selectButton = (event: MouseEvent<HTMLButtonElement>) => {
    const targetElement = event.target as HTMLButtonElement;
    const isButton = targetElement.tagName === 'BUTTON';

    if (!isButton || !onClick) return;

    const parentElement = targetElement.parentElement;
    const children = [...(parentElement?.children ?? [])];

    const targetIndex = children.findIndex((c) => c === targetElement);

    if (targetIndex !== -1) {
      const selectedIndex = targetIndex === currentIndex ? -1 : targetIndex;

      onClick({ ...event, selectedIndex });
      setCurrentIndex(selectedIndex);
    }
  };

  return <FlexContainer {...props} onClick={selectButton} />
};

ButtonGroup.defaultProps = {
  selectedIndex: -1,
  padding: 0,
  gap: 0,
};

export { ButtonGroup };
