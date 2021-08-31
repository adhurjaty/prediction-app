import { randomString } from '../util/helpers'
import { GoogleOauth } from './models';

export default class GoogleLogin {
    createVerifier() : string {
        return randomString(32);
    }

    codeUrl(verifier : string, origin?: string) : string {
        const googleLogin = new GoogleOauth({
            client_id: '466916983544-t7m40b8hn047m9v5hcbgr9q2vt6hsavm.apps.googleusercontent.com',
            redirect_uri: 'http://localhost:8080/confirm',
            response_type: 'code',
            scope: 'openid email',
            access_type: 'offline',
            securityToken: verifier,
            origin: origin
        });

        const google_base_url = 'https://accounts.google.com/o/oauth2/v2/auth';
        return googleLogin.toUrl(google_base_url).href;
    }
}
