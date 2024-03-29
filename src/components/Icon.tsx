import styled from 'styled-components';
import { HTMLAttributes } from 'react';
import * as Icons from '../icons';
import {
  GIANT_ICON_SIZE,
  LARGE_ICON_SIZE,
  NORMAL_ICON_SIZE,
  SMALL_ICON_SIZE,
} from '../constants';

export enum IconType {
  Adjust,
  Backward,
  BringForward,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Compress,
  Crop,
  Delete,
  Expand,
  Export,
  Fade,
  Filters,
  Fit,
  Forward,
  HorizontalFlip,
  Media,
  Minus,
  Pause,
  Play,
  Plus,
  Redo,
  Rotate,
  RotateLeft,
  RotateRight,
  Scale,
  SendBackward,
  Settings,
  Shapes,
  Snap,
  Speed,
  Split,
  Text,
  Transform,
  Transitions,
  Undo,
  VerticalFlip,
  Volume,
  Seeker,
  Edge,
}

export enum IconSize {
  Small,
  Normal,
  Large,
  Giant,
}

interface IconProps extends HTMLAttributes<HTMLDivElement> {
  visible?: boolean;
  variant?: keyof typeof IconType;
  size?: number;
  color?: string;
}

const IconWrapper = styled.div<IconProps>`
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;  
  display: ${(props) => props.visible ? 'inline-flex' : 'none'}; 
  justify-content: center; 
  align-items: center;
  pointer-events: none;
  cursor: inherit;

  & > * {
    width: 100%;
    height: 100%;
    position: relative;
    fill: ${(props) => props.color ?? 'inherit'};
  }
`;

function getIconByType(type?: keyof typeof IconType): React.FC {
  switch (type) {
    case 'Adjust': return Icons.AdjustmentsIcon;
    case 'Backward': return Icons.BackwardIcon;
    case 'BringForward': return Icons.BringForwardIcon;
    case 'ChevronDown': return Icons.ChevronDownIcon;
    case 'ChevronLeft': return Icons.ChevronLeftIcon;
    case 'ChevronRight': return Icons.ChevronRightIcon;
    case 'ChevronUp': return Icons.ChevronUpIcon;
    case 'Compress': return Icons.CompressIcon;
    case 'Crop': return Icons.CropIcon;
    case 'Delete': return Icons.DeleteIcon;
    case 'Expand': return Icons.ExpandIcon;
    case 'Export': return Icons.ExportIcon;
    case 'Fade': return Icons.FadeIcon;
    case 'Filters': return Icons.FiltersIcon;
    case 'Fit': return Icons.FitIcon;
    case 'Forward': return Icons.ForwardIcon;
    case 'HorizontalFlip': return Icons.HorizontalFlipIcon;
    case 'Media': return Icons.MediaIcon;
    case 'Minus': return Icons.MinusIcon;
    case 'Pause': return Icons.PauseIcon;
    case 'Play': return Icons.PlayIcon;
    case 'Plus': return Icons.PlusIcon;
    case 'Redo': return Icons.RedoIcon;
    case 'Rotate': return Icons.RotateIcon;
    case 'RotateLeft': return Icons.RotateLeftIcon;
    case 'RotateRight': return Icons.RotateRightIcon;
    case 'Scale': return Icons.ScaleIcon;
    case 'SendBackward': return Icons.SendBackwardIcon;
    case 'Settings': return Icons.SettingsIcon;
    case 'Shapes': return Icons.ShapesIcon;
    case 'Snap': return Icons.SnapIcon;
    case 'Speed': return Icons.SpeedIcon;
    case 'Split': return Icons.SplitIcon;
    case 'Text': return Icons.TextIcon;
    case 'Transform': return Icons.TransformIcon;
    case 'Transitions': return Icons.TransitionIcon;
    case 'Undo': return Icons.UndoIcon;
    case 'VerticalFlip': return Icons.VerticalFlipIcon;
    case 'Volume': return Icons.VolumeIcon;
    case 'Seeker': return Icons.SeekerIcon;
    case 'Edge': return Icons.EdgeIcon;
  }

  return Icons.CheckIcon;
}

export function getIconSizeBySizeType(iconSize?: keyof typeof IconSize): number {
  switch (iconSize) {
    case 'Giant': return GIANT_ICON_SIZE;
    case 'Large': return LARGE_ICON_SIZE;
    case 'Small': return SMALL_ICON_SIZE;
  }

  return NORMAL_ICON_SIZE;
}

const Icon: React.FC<IconProps> = (props: IconProps) => {
  const Image = getIconByType(props.variant);

  return (
    <IconWrapper {...props}>
      <Image />
    </IconWrapper>
  );
};

Icon.defaultProps = {
  visible: true,
  variant: 'Check',
  size: NORMAL_ICON_SIZE,
};

export { Icon };
