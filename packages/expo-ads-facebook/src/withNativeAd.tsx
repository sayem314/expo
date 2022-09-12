import { requireNativeViewManager } from 'expo-modules-core';
import { EventSubscription } from 'fbemitter';
import nullthrows from 'nullthrows';
import React from 'react';
import { Platform, View, findNodeHandle } from 'react-native';

import { NativeAdIconView } from './AdIconView';
import { NativeAdMediaView } from './AdMediaView';
import AdsManager from './NativeAdsManager';

const NativeAdLayout: React.ComponentType | null =
  Platform.OS === 'android' ? requireNativeViewManager('NativeAdLayout') : null;

type AdContainerProps<P> = {
  adsManager: AdsManager;
  // TODO: rename this to onAdLoad
  onAdLoaded?: ((ad: NativeAd) => void) | null;
  onError?: (error: Error) => void;
} & Pick<P, Exclude<keyof P, keyof AdProps>>;

type AdContainerState = {
  ad: NativeAd | null;
  canRequestAds: boolean;
};

type AdProps = { nativeAd: NativeAd };

type AdNodeHandles = {
  adMediaViewNodeHandle?: number | null;
  adIconViewNodeHandle?: number | null;
  interactiveTriggerNodeHandles?: Map<React.Component, number>;
};

/**
 * A higher-order function that wraps the given `Component` type and returns a new container
 * component type that passes in an extra `nativeAd` prop to the wrapped component.
 *
 * The container component renders null if the native ads manager is not yet ready to display ads or
 * if no ad could be loaded.
 */
export default function withNativeAd<P>(
  Component: React.ComponentType<P & AdProps>
): React.ComponentType<AdContainerProps<P>> {
  return class NativeAdContainer extends React.Component<AdContainerProps<P>, AdContainerState> {
    _readySubscription: EventSubscription | null = null;
    _errorSubscription: EventSubscription | null = null;
    _nativeAdViewRef = React.createRef<NativeAdView>();
    _adMediaViewNodeHandle: number | null = null;
    _adIconViewNodeHandle: number | null = null;
    _interactiveTriggerNodeHandles: Map<React.Component, number> = new Map();

    state: AdContainerState;

    constructor(props: AdContainerProps<P>) {
      super(props);
      this.state = {
        ad: null,
        canRequestAds: props.adsManager.isValid,
      };
    }

    componentDidMount() {
      if (!this.state.canRequestAds) {
        // On mounting, listen to the ads manager to learn when it is ready to display ads
        this._readySubscription = this.props.adsManager.onAdsLoaded(() => {
          this.setState({ canRequestAds: true });
        });
      }
      this._errorSubscription = this.props.adsManager.onAdsErrored((error) => {
        // From what I, @sjchmiela, understand, an error may be encountered multiple times
        // and it does *not* mean that the manager is not able to request ads at all -
        // - this may have been an intermittent error -- that's why we don't set canRequestAds to false
        // here.
        // If the configuration is invalid from the start, the manager will never emit
        // the onAdsLoaded event and the component would never think it could request ads.
        if (this.props.onError) {
          this.props.onError(error);
        }
      });
    }

    componentWillUnmount() {
      if (this._readySubscription) {
        this._readySubscription.remove();
        this._readySubscription = null;
      }
      if (this._errorSubscription) {
        this._errorSubscription.remove();
        this._errorSubscription = null;
      }
    }

    render() {
      if (!this.state.canRequestAds) {
        return null;
      }

      const { adsManager } = this.props;
      const props = this._getForwardedProps();

      const viewHierarchy = (
        <NativeAdView
          ref={this._nativeAdViewRef}
          adsManager={adsManager.placementId}
          onAdLoaded={this._handleAdLoaded}>
          <AdMediaViewContext.Provider value={this._adMediaViewContextValue}>
            <AdIconViewContext.Provider value={this._adIconViewContextValue}>
              <AdTriggerViewContext.Provider value={this._adTriggerViewContextValue}>
                <AdOptionsViewContext.Provider value={this._adOptionsViewContextValue}>
                  {this.state.ad ? <Component {...props} nativeAd={this.state.ad} /> : null}
                </AdOptionsViewContext.Provider>
              </AdTriggerViewContext.Provider>
            </AdIconViewContext.Provider>
          </AdMediaViewContext.Provider>
        </NativeAdView>
      );

      if (NativeAdLayout) {
        return <NativeAdLayout>{viewHierarchy}</NativeAdLayout>;
      }

      return viewHierarchy;
    }

    _getForwardedProps(): P {
      const { adsManager, onAdLoaded, ...props } = this.props as any;
      return props as P;
    }

    _handleAdLoaded = ({ nativeEvent: ad }: { nativeEvent: NativeAd }) => {
      this.setState({ ad }, () => {
        if (this.props.onAdLoaded) {
          const ad = nullthrows(this.state.ad);
          this.props.onAdLoaded(ad);
        }
      });
    };

    _adMediaViewContextValue = {
      nativeRef: (component: NativeAdMediaView | null) => {
        if (component) {
          this._setAdNodeHandles({ adMediaViewNodeHandle: nullthrows(findNodeHandle(component)) });
        } else {
          this._setAdNodeHandles({ adMediaViewNodeHandle: null });
        }
      },
    };

    _adOptionsViewContextValue = {
      nativeAdViewRef: this._nativeAdViewRef,
    };

    _adIconViewContextValue = {
      nativeRef: (component: NativeAdIconView | null) => {
        if (component) {
          this._setAdNodeHandles({ adIconViewNodeHandle: nullthrows(findNodeHandle(component)) });
        } else {
          this._setAdNodeHandles({ adIconViewNodeHandle: null });
        }
      },
    };

    _adTriggerViewContextValue = {
      registerComponent: (component: React.Component) => {
        const nodeHandle = nullthrows(findNodeHandle(component));
        const interactiveTriggerNodeHandles = new Map(this._interactiveTriggerNodeHandles);
        interactiveTriggerNodeHandles.set(component, nodeHandle);
        this._setAdNodeHandles({ interactiveTriggerNodeHandles });
      },
      unregisterComponent: (component: React.Component) => {
        const interactiveTriggerNodeHandles = new Map(this._interactiveTriggerNodeHandles);
        interactiveTriggerNodeHandles.delete(component);
        this._setAdNodeHandles({ interactiveTriggerNodeHandles });
      },
      onTriggerAd: () => {
        if (this._adMediaViewNodeHandle !== null && Platform.OS === 'android') {
          const nodeHandle = findNodeHandle(this._nativeAdViewRef.current)!;
          AdsManager.triggerEvent(nodeHandle);
        }
      },
    };

    /**
     * Updates the registered ad views given their node handles. The node handles are not stored in
     * this component's state nor does this method call "setState" to avoid unnecessarily
     * re-rendering.
     */
    _setAdNodeHandles({
      adMediaViewNodeHandle = this._adMediaViewNodeHandle,
      adIconViewNodeHandle = this._adIconViewNodeHandle,
      interactiveTriggerNodeHandles = this._interactiveTriggerNodeHandles,
    }: AdNodeHandles): void {
      const adMediaViewChanged = adMediaViewNodeHandle !== this._adMediaViewNodeHandle;
      const adIconViewChanged = adIconViewNodeHandle !== this._adIconViewNodeHandle;

      const interactiveTriggersChanged = !_areEqualSets(
        new Set(interactiveTriggerNodeHandles.values()),
        new Set(this._interactiveTriggerNodeHandles.values())
      );

      if (adMediaViewChanged || adIconViewChanged || interactiveTriggersChanged) {
        this._adMediaViewNodeHandle = adMediaViewNodeHandle;
        this._adIconViewNodeHandle = adIconViewNodeHandle;
        this._interactiveTriggerNodeHandles = interactiveTriggerNodeHandles;

        // TODO: handle unregistering views when components are unmounted
        if (this._adMediaViewNodeHandle !== null && this._adIconViewNodeHandle !== null) {
          AdsManager.registerViewsForInteractionAsync(
            nullthrows(findNodeHandle(this._nativeAdViewRef.current)),
            this._adMediaViewNodeHandle,
            this._adIconViewNodeHandle,
            [...this._interactiveTriggerNodeHandles.values()]
          );
        }
      }
    }
  };
}

type NativeAdViewProps = {
  adsManager: string;
  onAdLoaded?: (event: { nativeEvent: NativeAd }) => void;
} & React.ComponentPropsWithRef<typeof View>;

type NativeAdView = React.Component<NativeAdViewProps>;
// eslint-disable-next-line @typescript-eslint/no-redeclare -- the type and variable share a name
const NativeAdView: React.ComponentType<any> = requireNativeViewManager('CTKNativeAd');

// React contexts for ad views that need to register with the ad container
export type AdIconViewContextValue = {
  nativeRef: (component: NativeAdMediaView | null) => void;
};

export type AdMediaViewContextValue = {
  nativeRef: (component: NativeAdIconView | null) => void;
};

export type AdTriggerViewContextValue = {
  registerComponent: (component: React.Component) => void;
  unregisterComponent: (component: React.Component) => void;
  onTriggerAd: () => void;
};

export type AdOptionsViewContextValue = {
  nativeAdViewRef: React.RefObject<NativeAdView>;
};

export const AdIconViewContext = React.createContext<AdIconViewContextValue | null>(null);
export const AdMediaViewContext = React.createContext<AdMediaViewContextValue | null>(null);
export const AdTriggerViewContext = React.createContext<AdTriggerViewContextValue | null>(null);
export const AdOptionsViewContext = React.createContext<AdOptionsViewContextValue | null>(null);

export type NativeAd = {
  /**
   * The headline the advertiser entered when they created their ad. This is usually the ad's main
   * title.
   */
  headline?: string;

  /**
   * The link description which is additional information that the advertiser may have entered
   */
  linkDescription?: string;

  /**
   * The name of the Facebook Page or mobile app that represents the business running the ad
   */
  advertiserName?: string;

  /**
   * The ad's social context, such as, "Over half a million users"
   */
  socialContext?: string;

  /**
   * The call-to-action phrase of the ad, such as, "Install Now"
   */
  callToActionText?: string;

  /**
   * The body text, truncated to 90 characters, that contains the text the advertiser entered when
   * they created their ad to tell people what the ad promotes
   */
  bodyText?: string;

  /**
   * The word "ad", translated into the viewer's language
   */
  adTranslation?: string;

  /**
   * The word "promoted", translated into the viewer's language
   */
  promotedTranslation?: string;

  /**
   * The word "sponsored", translated into the viewer's language
   */
  sponsoredTranslation?: string;
};

function _areEqualSets<T>(set1: Set<T>, set2: Set<T>): boolean {
  if (set1.size !== set2.size) {
    return false;
  }

  for (const item of set1.values()) {
    if (!set2.has(item)) {
      return false;
    }
  }
  return true;
}
