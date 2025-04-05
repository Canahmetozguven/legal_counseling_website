/**
 * Bundle Size Analyzer Script
 *
 * This script is used with webpack-bundle-analyzer to help visualize and optimize
 * bundle sizes. It's an important tool for performance optimization.
 */
process.env.NODE_ENV = 'production';

const webpack = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const webpackConfigProd = require('react-scripts/config/webpack.config')('production');

// Add bundle analyzer plugin
webpackConfigProd.plugins.push(
  new BundleAnalyzerPlugin({
    analyzerMode: 'static',
    reportFilename: 'bundle-report.html',
    openAnalyzer: true,
    generateStatsFile: true,
    statsFilename: 'bundle-stats.json',
  })
);

// Run webpack with the modified config
webpack(webpackConfigProd, (err, stats) => {
  if (err || stats.hasErrors()) {
    console.error(err || stats.compilation.errors);
    process.exit(1);
  }

  console.log('Bundle analysis complete! See bundle-report.html for details.');
});
