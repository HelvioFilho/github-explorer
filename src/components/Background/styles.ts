import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import { ImageBackground } from 'react-native';
import styled from 'styled-components/native';

export const Container = styled(ImageBackground).attrs({
  imageStyle: {
    position: 'absolute',
    top: -RFValue(165),
  },
  resizeMode: 'contain'
})`
  flex: 1;
  height: ${RFPercentage(100)}px;
`;

export const SafeAreaViewIOS = styled.SafeAreaView`
  flex: 1;
`;