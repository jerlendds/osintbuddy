import { LoginFormValues } from '@/routes/public/SigninPage';
import axios from 'axios';
import api from './api.service';
import { LS_USER_AUTH_KEY } from './api.service';

class AuthService {
  async loginUser(user: LoginFormValues) {
    const form = new FormData();
    form.append('username', user.email);
    form.append('password', user.password);

    if (user.remembered) {
      // @todo
    }

    return await api
      .post('/login/access-token/', form)
      .then(async (resp) => {
        // if login successful, response will have token
        let user = null;
        if (resp.data && resp.data.token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${resp.data.token}`;
        } else {
          api.defaults.headers.common['Authorization'] = '';
        }
        await api
          .get('/users/me')
          .then((data) => {
            user = {
              fullName: data.data.full_name,
              ...data.data,
            };
          })
          .catch((error) => console.warn(error));
        localStorage.setItem(LS_USER_AUTH_KEY, JSON.stringify({ token: resp.data.token, user, isAuthenticated: true }));

        return { ...resp, user };
      })
      .catch((error) => {
        console.warn(error);
        localStorage.removeItem(LS_USER_AUTH_KEY);
        return error;
      });
  }

  logout() {
    localStorage.removeItem(LS_USER_AUTH_KEY);
    axios.defaults.headers.common['Authorization'] = '';
  }

  async register(user: LoginFormValues) {
    return await api
      .post('/users/', user)
      .then((resp) => resp)
      .catch((error) => error);
  }

  async forgotPassword(email: string) {
    return await api.post('/auth/forgot/password', { email });
  }

  async changePassword(hash: string, password: string) {
    return await api
      .post('/auth/reset/password', { hash, password })
      .then((resp) => resp)
      .catch((error) => error);
  }

  async confirmEmail(hash: string) {
    return await api.post('/auth/email/confirm/', { hash });
  }
}

export default new AuthService();
