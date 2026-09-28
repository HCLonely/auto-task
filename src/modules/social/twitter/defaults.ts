import type { ApiConfig } from './types';

/** Endpoint identifiers and browser bearer copied from the original implementation. */
export const DEFAULT_API: ApiConfig = {
  bearerToken: 'AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA',
  userByScreenName: 'jUKA--0QkqGIFhmfRZdWrQ',
  createRetweet: 'ojPdsZsimiJrUGLR1sjUtA',
  deleteRetweet: 'iQtK4dl5hBmXewYZuEOKVw',
  userFeatures: {
    'responsive_web_grok_bio_auto_translation_is_enabled': false,
    'hidden_profile_subscriptions_enabled': true,
    'payments_enabled': false,
    'profile_label_improvements_pcf_label_in_post_enabled': true,
    'rweb_tipjar_consumption_enabled': true,
    'verified_phone_label_enabled': false,
    'subscriptions_verification_info_is_identity_verified_enabled': true,
    'subscriptions_verification_info_verified_since_enabled': true,
    'highlights_tweets_tab_ui_enabled': true,
    'responsive_web_twitter_article_notes_tab_enabled': true,
    'subscriptions_feature_can_gift_premium': true,
    'creator_subscriptions_tweet_preview_api_enabled': true,
    'responsive_web_graphql_skip_user_profile_image_extensions_enabled': false,
    'responsive_web_graphql_timeline_navigation_enabled': true
  },
  userFieldToggles: {
    withAuxiliaryUserLabels: true
  }
};

export const DEFAULT_PAIR_URL = 'https://raw.githubusercontent.com/fa0311/x-client-transaction-id-pair-dict/refs/heads/main/pair.json';
