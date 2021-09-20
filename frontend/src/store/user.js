import axios from 'axios';


const user = {
    state: () => ({
        status: '',
        token: localStorage.getItem('token') || '',
        user: {},
    }),
    mutations: {
        auth_request(state) {
            state.status = 'loading';
        },
        auth_success(state, token, user) {
            state.status = 'success';
            state.token = token;
            state.user = user;
        },
        auth_error(state) {
            state.status = 'error';
        },
        logout(state) {
            state.status = '';
            state.token = '';
        },
    },
    actions: {
        login({commit}, user) {
            let userData = new FormData();
            userData.append('username', user.email);
            userData.append('password', user.password);

            return new Promise((resolve, reject) => {
                axios({
                    url: 'http://localhost/api/v1/login/access-token',
                    data: userData,
                    method: 'POST',
                })
                    .then(resp => {
                        const token = resp.data.access_token;
                        const user = resp.data.user;
                        localStorage.setItem('token', token);
                        // Add the following line:
                        axios.defaults.headers.common['Authorization'] = token;
                        commit('auth_success', token, user);
                        resolve(resp);
                    })
                    .catch(err => {
                        commit('auth_error');
                        localStorage.removeItem('token');
                        reject(err);
                    });
            });
        },
        register({commit}, user) {
            return new Promise((resolve, reject) => {
                commit('auth_request');
                axios({
                    url: 'http://localhost/api/v1/users/open',
                    data: user,
                    method: 'POST',
                })
                    .then(resp => {
                        const token = resp.data.token;
                        const user = resp.data.user;
                        localStorage.setItem('token', token);
                        // Add the following line:
                        axios.defaults.headers.common['Authorization'] = token;
                        commit('auth_success', token, user);
                        resolve(resp);
                    })
                    .catch(err => {
                        commit('auth_error', err);
                        localStorage.removeItem('token');
                        reject(err);
                    });
            });
        },
        logout({commit}) {
            return new Promise(resolve => {
                commit('logout');
                localStorage.removeItem('token');
                delete axios.defaults.headers.common['Authorization'];
                resolve();
            });
        },
    },
    getters: {
        isLoggedIn: state => state.token,
        authStatus: state => state.status,
    },
}

export default user;
