import Scrollbars from 'react-custom-scrollbars-2';
import { FlexProps, FlexContainer } from './FlexContainer';

const ScrollableContainer: React.FC<FlexProps> = (props: FlexProps) => {
  return (
    <Scrollbars 
      style={{ width: '100%', height: '100%' }} 
      hideTracksWhenNotNeeded
      autoHide 
    >
      <FlexContainer {...props} />
    </Scrollbars>
  );
};

export { ScrollableContainer };
