'use strict';

window.$docsify = {
  el: '#app',
  name: 'Webpack 搭建指南',
  nameLink: '/',
  repo: 'true',
  // routerMode: 'history',
  corner: {
    url: 'https://github.com/eleven-net-cn/webpack-template',
    icon: 'github',
  },
  logo: '',
  loadSidebar: 'summary.md',
  subMaxLevel: 0,
  // coverpage: 'cover.md',
  // loadNavbar: 'nav.md',
  notFoundPage: '404.md',
  auto2top: true,
  formatUpdated: '{YYYY}/{MM}/{DD} {HH}:{mm}',
  search: {
    placeholder: '输入关键词搜索...',
    noData: '----- 未搜索到结果 -----',
  },
  copyCode: {
    buttonText: '复制',
    errorText: 'Error',
    successText: '已复制',
  },
  // footer: {
  //     copy: '<span>&copy; webpack.eleven.net.cn</span>',
  //     auth: 'lnc.ALL Rights Reserved',
  //     pre: '<hr/>',
  //     style:
  //         'color:#808080;text-align:right;font-family:"Source Sans Pro", "Helvetica Neue", Arial, sans-serif;font-size:12px;',
  // },
  'flexible-alerts': {
    // note: {
    //   label: "注意"
    // },
    // tip: {
    //   label: "提示"
    // },
    // warning: {
    //   label: "警示"
    // },
    // danger: {
    //   label: "危险"
    // }
  },
  scrollToTop: {
    auto: true,
    // text: '返回',
    right: 30,
    bottom: 30,
    offset: 500,
  },
  // count:{
  //   countable:true,
  //   fontsize:'0.9em',
  //   color:'rgb(90,90,90)',
  //   language:'chinese'
  // },
  plugins: [
    window.EditOnGithubPlugin.create(
      'https://github.com/eleven-net-cn/webpack.eleven.net.cn/edit/master/docs/',
      null,
      '📝&nbsp;编辑',
    ),
    function (hook, vm) {
      hook.doneEach(function () {
        // 确保 SPA 每一页都能正常初始化 gitalk
        initGitalk(vm);
      });
    },
  ],
};

var gitalkConfig = {
  clientID: '2f7463c94730f4b6aebc',
  clientSecret: 'c183974bbbaad88fbc07acf2868f9be06d652975',
  repo: 'webpack.eleven.net.cn',
  owner: 'eleven-net-cn',
  admin: ['eleven-net-cn'],
  distractionFreeMode: false,
  proxy: 'https://cors-anywhere.azm.workers.dev/https://github.com/login/oauth/access_token',
  pagerDirection: 'first',
};

function initGitalk(vm) {
  var label = vm.route.path.replace(/\//g, '-');
  var containerId = 'gitalk-container' + label;
  var domObj = Docsify.dom;
  var _main = domObj.getNode('#main');

  Array.apply(null, document.querySelectorAll('div.gitalk-container')).forEach(function (ele) {
    ele.remove();
  });

  gitalkConfig.id = vm.route.path;

  var divEle = domObj.create('div');

  divEle.id = containerId;
  divEle.className = 'gitalk-container';
  divEle.style = 'width: ' + _main.clientWidth + 'px; margin: 0 auto 20px;padding-bottom: 40px;';
  domObj.appendTo(domObj.find('.content'), divEle);

  var gitalk = new window.Gitalk(gitalkConfig);
  gitalk.render(containerId);
}

// PWA
// typeof navigator.serviceWorker !== 'undefined' &&
//     navigator.serviceWorker.register('./assets/sw.js');
