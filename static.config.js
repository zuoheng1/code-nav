import React from 'react';
import path from 'path'

export default {
  Document: ({
               Html,
               Head,
               Body,
               children,
               state: {siteData, renderMeta},
             }) => (
    <Html lang="en-US">
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>林书豪的导航主页</title>
        <meta name="description" content="定制化主页" />
        <meta name="keywords" content="编程,程序员,导航,资源,主页" />
        <link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
        <script src="baiduAnalyze.js"></script>
      </Head>
      <Body>{children}</Body>
    </Html>
  ),
  silent: true,
  getRoutes: async () => {
    return [
      {
        path: 'search',
        template: 'src/pages/search/index',
      }
    ]
  },
  plugins: [
    [
      require.resolve('react-static-plugin-source-filesystem'),
      {
        location: path.resolve('./src/pages'),
      },
    ],
    require.resolve('react-static-plugin-reach-router'),
    require.resolve('react-static-plugin-sitemap'),
  ],
}
