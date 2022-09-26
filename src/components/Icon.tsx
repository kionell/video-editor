import styled from 'styled-components';
import * as Icons from '../icons';

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
  display: ${(props) => props.visible ? 'flex' : 'none'}; 
  justify-content: center; 
  align-items: center;

  & > * {
    min-width: 100%;
    min-height: 100%;
    position: relative;
    fill: ${(props) => props.theme.text.normal};
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
  }

  return Icons.CheckIcon;
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
  size: 14,
  useColor: true,
};

export { Icon };
