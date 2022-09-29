import {
  MouseEventHandler,
  Ref,
} from 'react';

import { FlexProps, FlexContainer } from '../Containers/FlexContainer';

interface ButtonGroupProps extends FlexProps {
  selectedIndex?: number;
  ref?: Ref<HTMLDivElement>;
  listener?: (selectedIndex: number) => void;
}

const ButtonGroup: React.FC<ButtonGroupProps> = (props: ButtonGroupProps) => {
  const { listener } = props;

  const selectButton: MouseEventHandler<HTMLDivElement> = (event) => {
    if (typeof listener !== 'function') return;
    
    const targetElement = event.target as HTMLDivElement;
    const collection = targetElement.parentElement?.children ?? null;
    const children = collection ? [...collection] : [];

    const targetIndex = children.findIndex((c) => c === targetElement);

    listener(targetIndex);
  };

  return <FlexContainer {...props} onClick={selectButton}></FlexContainer>;
};

ButtonGroup.defaultProps = {
  padding: 0,
  gap: 0,
};

export { ButtonGroup };
