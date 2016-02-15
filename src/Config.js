import PrivateConfig from './PrivateConfig';

export default {
  GOOGLE_AUTH_CLIENT_ID: PrivateConfig.GOOGLE_AUTH_CLIENT_ID,
  GOOGLE_AUTH_KEY: PrivateConfig.GOOGLE_AUTH_KEY,
  GOOGLE_AUTH_REDIRECT_URI: 'urn:ietf:wg:oauth:2.0:oob:auto',
  GOOGLE_AUTH_SCOPE: 'https://www.googleapis.com/auth/youtube.readonly',
  AUTHORIZATION_STORAGE_KEY: 'token',
  PLAYER_STORAGE_KEY: 'playerState'
};