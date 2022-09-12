import React, { useEffect, useState, useRef, useMemo } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  NativeModules,
  NativeEventEmitter,
  UIManager,
  View,
} from 'react-native';

export default function DevLoadingView() {
  const [isDevLoading, setIsDevLoading] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const translateY = useRef(new Animated.Value(0)).current;
  const emitter = useMemo<NativeEventEmitter>(() => {
    try {
      return new NativeEventEmitter(NativeModules.DevLoadingView);
    } catch (error) {
      throw new Error(
        'Failed to instantiate native emitter in `DevLoadingView` because the native module `DevLoadingView` is undefined: ' +
          error.message
      );
    }
  }, []);

  useEffect(() => {
    if (!emitter) return;

    function handleShowMessage({ message }) {
      // "Refreshing..." is the standard fast refresh message and it's the
      // only time we want to display this overlay.
      if (message !== 'Refreshing...') {
        return;
      }

      // TODO: if we show the refreshing banner and don't get a hide message
      // for 3 seconds, warn the user that it's taking a while and suggest
      // they reload

      translateY.setValue(0);
      setIsDevLoading(true);
    }

    function handleHide() {
      // TODO: if we showed the 'refreshing' banner less than 250ms ago, delay
      // switching to the 'finished' banner

      setIsAnimating(true);
      setIsDevLoading(false);
      Animated.timing(translateY, {
        toValue: 150,
        delay: 1000,
        duration: 350,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          setIsAnimating(false);
          translateY.setValue(0);
        }
      });
    }

    emitter.addListener('devLoadingView:showMessage', handleShowMessage);
    emitter.addListener('devLoadingView:hide', handleHide);

    return function cleanup() {
      emitter.removeListener('devLoadingView:showMessage', handleShowMessage);
      emitter.removeListener('devLoadingView:hide', handleHide);
    };
  }, [translateY, emitter]);

  if (isDevLoading || isAnimating) {
    return (
      <Animated.View
        style={[styles.animatedContainer, { transform: [{ translateY }] }]}
        pointerEvents="none">
        <View style={styles.banner}>
          <View style={styles.contentContainer}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.text}>{isDevLoading ? 'Refreshing...' : 'Refreshed'}</Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.subtitle}>
                {isDevLoading ? 'Using Fast Refresh' : "Don't see your changes? Reload the app"}
              </Text>
            </View>
          </View>
        </View>
      </Animated.View>
    );
  } else {
    return null;
  }
}

/**
 * This is a hack to get the safe area insets without explicitly depending on react-native-safe-area-context.
 * The following code is lifted from: https://git.io/Jzk4k
 *
 * TODO: This will need to be updated for Fabric/TurboModules.
 **/
const RNCSafeAreaProviderConfig = UIManager.getViewManagerConfig('RNCSafeAreaProvider') as any;
const initialWindowMetrics = RNCSafeAreaProviderConfig?.Constants?.initialWindowMetrics as
  | { insets: { bottom: number } }
  | undefined;

const styles = StyleSheet.create({
  animatedContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 42, // arbitrary
  },
  banner: {
    flex: 1,
    overflow: 'visible',
    backgroundColor: 'rgba(0,0,0,0.75)',
    paddingBottom: initialWindowMetrics?.insets?.bottom ?? 0,
  },
  contentContainer: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 5,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 15,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.8)',
  },
});
