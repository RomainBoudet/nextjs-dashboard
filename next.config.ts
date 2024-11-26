import {withSentryConfig} from '@sentry/nextjs';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  /* images: {
    localPatterns: [
      {
        pathname: '/images/*',
        search: '',
      },
    ],
  },  */
  
  
  // config nécéssaire pour autoriser le partial pre rendering, 
  // qui permet en utilisant Suspense de react, 
  // de rendre sur une même page des partie dynamlic et d'autre static 
  // Mais il faut également, l'autoriser dans le le layout de notre route ! => ""export const experimental_ppr = true;"

  // la diff se verra surtout en prod, 
  // Next.js pré-affichera les parties statiques de la route et différera les parties dynamiques jusqu'à ce que l'utilisateur les demande.
   experimental: {
    ppr: 'incremental',
  }, 
};

export default withSentryConfig(nextConfig, {
// For all available options, see:
// https://github.com/getsentry/sentry-webpack-plugin#options

org: "leo-hv",
project: "javascript-nextjs",

// Only print logs for uploading source maps in CI
silent: !process.env.CI,

// For all available options, see:
// https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

// Upload a larger set of source maps for prettier stack traces (increases build time)
widenClientFileUpload: true,

// Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
// This can increase your server load as well as your hosting bill.
// Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
// side errors will fail.
tunnelRoute: "/monitoring",

// Hides source maps from generated client bundles
hideSourceMaps: true,

// Automatically tree-shake Sentry logger statements to reduce bundle size
disableLogger: true,

// Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
// See the following for more information:
// https://docs.sentry.io/product/crons/
// https://vercel.com/docs/cron-jobs
automaticVercelMonitors: true,
});