require('normalize.css');
import VueRouter from 'vue-router';
import App from './app.vue';

Vue.use(VueRouter);

new Vue({
    router: new VueRouter({
        routes: [{path: '/', component: App}],
    }),
    template: '<router-view></router-view>',
}).$mount('#app');
