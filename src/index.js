require('normalize.css');
import VueRouter from 'vue-router';
import App from './app.vue';

Vue.use(VueRouter);

const components = require.context('./components', false, /\w+\.(vue|js)$/);
for (let filename of components.keys()) {
    let opt = components(filename);
    Vue.component(_.upperFirst(_.camelCase(filename.replace(/^\.\/(.*)\.\w+$/, '$1'))), opt.default || opt);
}

new Vue({
    router: new VueRouter({
        routes: [{path: '/', component: App}],
    }),
    template: '<router-view></router-view>',
}).$mount('#app');
