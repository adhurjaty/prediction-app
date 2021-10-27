import { TYPES as OAUTH_TYPES } from './oauth/oauth.types'

export const TYPES = {
    LOCAL_STORAGE: 'LOCAL_STORAGE',
    LOCATION_BROWSER: 'LOCATION_BROWSER',

    ...OAUTH_TYPES
}