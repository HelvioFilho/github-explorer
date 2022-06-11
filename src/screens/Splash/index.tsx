import React, { useEffect, useRef } from 'react';
import LottieView from 'lottie-react-native';

import logoGitHub from '../../assets/splashLogo.json';
import explore from '../../assets/githubExplorer.json';

import { Container } from './styles';
import { StatusBar } from 'react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

export function Splash() {
  const { dispatch } = useNavigation();

  const animationLottie = useRef<LottieView>(null);
  const animationExplorer = useRef<LottieView>(null);
  const splashAnimation = useSharedValue(0);

  const containerStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(splashAnimation.value,
        [0, 50],
        [0, 1]
      )
    }
  })

  function goDashboard() {
    dispatch(CommonActions.reset({
      index: 0,
      routes: [{ name: 'Dashboard' }]
    }))
  }

  useEffect(() => {
    splashAnimation.value = withTiming(
      50,
      {
        duration: 3000,
      }
    );

    setTimeout(() => {
      animationLottie.current?.play();
      animationExplorer.current?.play(0, 80);
    }, 850);

    setTimeout(() => {
      goDashboard();
    }, 3000);
  }, []);

  return (
    <Container>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#FFFFFF"
        translucent
      />
      <Animated.View style={containerStyle}>
        <LottieView
          ref={animationLottie}
          source={logoGitHub}
          style={{ height: 250 }}
          resizeMode="contain"
          loop={false}
        />
        <LottieView
          ref={animationExplorer}
          source={require('../../assets/githubExplorer.json')}
          resizeMode="contain"
          style={{ width: 250, height: 50, position: "relative", top: -15 }}
          loop={false}
        />
      </Animated.View>
    </Container>
  );
}