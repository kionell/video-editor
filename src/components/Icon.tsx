import styled from 'styled-components';
import * as Icons from '../icons';
import { 
  GIANT_ICON_SIZE,
  LARGE_ICON_SIZE, 
  NORMAL_ICON_SIZE, 
  SMALL_ICON_SIZE 
} from '../constants';

export enum IconType {
  Adjustments,
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
  Resize,
  Rotate,
  RotateLeft,
  RotateRight,
  SendBackward,
  Settings,
  Shapes,
  Snap,
  Speed,
  Split,
  Text,
  Transform,
  Transition,
  Undo,
  VerticalFlip,
  Seeker,
  Edge,
}

export enum IconSize {
  Small,
  Normal,
  Large,
  Giant,
}

interface IconProps {
  visible?: boolean;
  variant?: keyof typeof IconType;
  size?: number;
  useColor?: boolean;
  className?: string;
}

const IconWrapper = styled.div<IconProps>`
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;  
  display: ${(props) => props.visible ? 'inline-flex' : 'none'}; 
  justify-content: center; 
  align-items: center;
  pointer-events: none;

  & > * {
    width: 100%;
    height: 100%;
    position: relative;
    fill: ${(props) => {
      return props.useColor ? props.theme.text.normal : 'inherit';
    }};
  }
`;

function getIconByType(type?: keyof typeof IconType): React.FC {
  switch (type) {
    case 'Adjustments': return Icons.AdjustmentsIcon;
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
    case 'Resize': return Icons.ResizeIcon;
    case 'Rotate': return Icons.RotateIcon;
    case 'RotateLeft': return Icons.RotateLeftIcon;
    case 'RotateRight': return Icons.RotateRightIcon;
    case 'SendBackward': return Icons.SendBackwardIcon;
    case 'Settings': return Icons.SettingsIcon;
    case 'Shapes': return Icons.ShapesIcon;
    case 'Snap': return Icons.SnapIcon;
    case 'Speed': return Icons.SpeedIcon;
    case 'Split': return Icons.SplitIcon;
    case 'Text': return Icons.TextIcon;
    case 'Transform': return Icons.TransformIcon;
    case 'Transition': return Icons.TransitionIcon;
    case 'Undo': return Icons.UndoIcon;
    case 'VerticalFlip': return Icons.VerticalFlipIcon;
    case 'Seeker': return Icons.SeekerIcon;
    case 'Edge': return Icons.EdgeIcon;
  }

  return Icons.CheckIcon;
}

export function getIconSizeBySizeType(iconSize?: keyof typeof IconSize): number {
  switch (iconSize) {
    case 'Giant': return GIANT_ICON_SIZE;
    case 'Large': return LARGE_ICON_SIZE;
    case 'Normal': return NORMAL_ICON_SIZE;
  }

  return SMALL_ICON_SIZE;
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
  useColor: true,
};

export { Icon };
