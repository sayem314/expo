import * as Analytics from 'expo-firebase-analytics';
import * as FirebaseCore from 'expo-firebase-core';
import { Platform } from 'react-native';

export const name = 'FirebaseAnalytics';

export async function test({ describe, beforeAll, afterAll, it, xit, expect }) {
  const isConfigured = !!FirebaseCore.DEFAULT_APP_OPTIONS;
  const isWebConfigured = !!FirebaseCore.DEFAULT_WEB_APP_OPTIONS;
  const isExpoClient = FirebaseCore.DEFAULT_APP_NAME !== '[DEFAULT]';
  const itWhenConfigured = isConfigured ? it : xit;
  const itWhenNotConfigured = isConfigured ? xit : it;

  describe(name, () => {
    afterAll(async () => {
      if (isConfigured) {
        // Force sending (flushing) the event(s) to the cloud back-end by triggering
        // a conversion event.
        // https://firebase.googleblog.com/2016/11/how-long-does-it-take-for-my-firebase-analytics-data-to-show-up.html
        await Analytics.logEvent('ecommerce_purchase', {
          currency: 'USD',
          value: 1,
        });
      }
    });

    describe('logEvent()', async () => {
      itWhenConfigured(`runs`, async () => {
        let error = null;
        try {
          await Analytics.logEvent('event_name', { foo: 'bar' });
        } catch (e) {
          error = e;
        }
        expect(error).toBeNull();
      });
      itWhenNotConfigured('fails when not configured', async () => {
        let error = null;
        try {
          await Analytics.logEvent('event_name', { foo: 'bar' });
        } catch (e) {
          error = e;
        }
        expect(error).not.toBeNull();
      });
    });
    describe('logEvent() - without optional properties', async () => {
      itWhenConfigured(`runs`, async () => {
        let error = null;
        try {
          await Analytics.logEvent('event_name');
        } catch (e) {
          error = e;
        }
        expect(error).toBeNull();
      });
      itWhenNotConfigured('fails when not configured', async () => {
        let error = null;
        try {
          await Analytics.logEvent('event_name');
        } catch (e) {
          error = e;
        }
        expect(error).not.toBeNull();
      });
    });
    describe('logEvent() - with `items` arrays', async () => {
      itWhenConfigured(`runs`, async () => {
        let error = null;
        try {
          await Analytics.logEvent('add_to_cart', { items: [{ id: 'foo', name: 'bar' }] });
        } catch (e) {
          error = e;
        }
        expect(error).toBeNull();
      });
      itWhenNotConfigured('fails when not configured', async () => {
        let error = null;
        try {
          await Analytics.logEvent('add_to_cart', { items: [{ id: 'foo', name: 'bar' }] });
        } catch (e) {
          error = e;
        }
        expect(error).not.toBeNull();
      });
    });
    describe('setCurrentScreen()', async () => {
      itWhenConfigured(`runs`, async () => {
        let error = null;
        try {
          await Analytics.setCurrentScreen('test-screen');
        } catch (e) {
          error = e;
        }
        expect(error).toBeNull();
      });
      itWhenNotConfigured(`fails when not configured`, async () => {
        let error = null;
        try {
          await Analytics.setCurrentScreen('test-screen');
        } catch (e) {
          error = e;
        }
        expect(error).not.toBeNull();
      });
    });
    describe('setSessionTimeoutDuration()', async () => {
      itWhenConfigured('runs', async () => {
        let error = null;
        try {
          await Analytics.setSessionTimeoutDuration(190000);
        } catch (e) {
          error = e;
        }
        expect(error).toBeNull();
      });
      itWhenNotConfigured(`fails when not configured`, async () => {
        let error = null;
        try {
          await Analytics.setSessionTimeoutDuration(190000);
        } catch (e) {
          error = e;
        }
        if ((!isExpoClient && Platform.OS === 'android') || Platform.OS === 'ios') {
          expect(error).not.toBeNull();
        } else {
          expect(error).toBeNull();
        }
      });
    });
    describe('setUserId()', async () => {
      afterAll(async () => {
        await Analytics.setUserId(null);
      });
      itWhenConfigured(`runs`, async () => {
        let error = null;
        try {
          await Analytics.setUserId('abcuserid');
        } catch (e) {
          error = e;
        }
        expect(error).toBeNull();
      });
      itWhenNotConfigured(`fails when not configured`, async () => {
        let error = null;
        try {
          await Analytics.setUserId('abcuserid');
        } catch (e) {
          error = e;
        }
        expect(error).not.toBeNull();
      });
    });
    describe('setUserProperty()', async () => {
      itWhenConfigured(`runs`, async () => {
        let error = null;
        try {
          await Analytics.setUserProperty('likes_tests', 'true');
        } catch (e) {
          error = e;
        }
        expect(error).toBeNull();
      });
      itWhenNotConfigured(`fails when not configured`, async () => {
        let error = null;
        try {
          await Analytics.setUserProperty('likes_tests', 'true');
        } catch (e) {
          error = e;
        }
        expect(error).not.toBeNull();
      });
    });
    describe('setUserProperties()', async () => {
      itWhenConfigured(`runs`, async () => {
        let error = null;
        try {
          await Analytics.setUserProperties({ likes_tests: 'true' });
        } catch (e) {
          error = e;
        }
        expect(error).toBeNull();
      });
      itWhenNotConfigured(`fails when not configured`, async () => {
        let error = null;
        try {
          await Analytics.setUserProperties({ likes_tests: 'true' });
        } catch (e) {
          error = e;
        }
        expect(error).not.toBeNull();
      });
    });
    describe('setUnavailabilityLogging()', async () => {
      it(`runs`, () => {
        let error = null;
        try {
          Analytics.setUnavailabilityLogging(false);
        } catch (e) {
          error = e;
        }
        expect(error).toBeNull();
      });
    });
    describe('setDebugModeEnabled()', async () => {
      it(
        isExpoClient && isConfigured && isWebConfigured
          ? `runs on client with web-config`
          : `fails when not on client or without web-config`,
        async () => {
          let error = null;
          try {
            await Analytics.setDebugModeEnabled(true);
          } catch (e) {
            error = e;
          }
          if (isExpoClient && isConfigured && isWebConfigured) {
            expect(error).toBeNull();
          } else {
            expect(error).not.toBeNull();
          }
        }
      );
    });
  });
}
