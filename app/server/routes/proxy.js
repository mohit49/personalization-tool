// routes/proxy.js
const express = require('express');
const axios = require('axios');
const { URL } = require('url');

const router = express.Router();

router.get('/proxy', async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) return res.status(400).send('URL is required.');

  try {
    const response = await axios.get(targetUrl, { responseType: 'text' });
    let html = response.data;
    const baseUrl = new URL(targetUrl);

    // ✅ Set headers for CORS, CSP, and MIME types (including SVG)
    res.setHeader('Content-Security-Policy', "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:;");
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');

    /**
     * 🔄 Converts relative or protocol-relative URLs to fully qualified URLs
     */
    const toAbsoluteUrl = (path) => {
      if (!path || path.startsWith('data:') || path.startsWith('mailto:') || path.startsWith('tel:')) return path;
      if (path.startsWith('http')) return path; // Full URL
      if (path.startsWith('//')) return `${baseUrl.protocol}${path}`; // Protocol-relative URL
      if (path.startsWith('/')) return `${baseUrl.origin}${path}`; // Absolute path
      return `${baseUrl.origin}/${path}`; // Relative path
    };

    // 🔄 Rewrite attributes with URLs (src, href, action, data, object, embed)
    html = html.replace(
      /\b(src|href|action|data|poster)=["'](.*?)["']/gi,
      (_, attr, path) => `${attr}="${toAbsoluteUrl(path)}"`
    );

    // 🔄 Handle <object> and <embed> tags with SVGs
    html = html.replace(
      /<(object|embed)[^>]*(data|src)=["'](.*?)["'][^>]*>/gi,
      (_, tag, attr, path) => `<${tag} ${attr}="${toAbsoluteUrl(path)}">`
    );

    // 🔄 Rewrite URLs in inline styles (including background-image with SVGs)
    html = html.replace(/style=["'](.*?)["']/gi, (_, style) => {
      const updatedStyle = style.replace(/url\(["']?(.*?)["']?\)/gi, (_, path) => `url("${toAbsoluteUrl(path)}")`);
      return `style="${updatedStyle}"`;
    });

    // 🔄 Rewrite URLs inside <style> tags
    html = html.replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, (_, css) => {
      const updatedCss = css.replace(/url\(["']?(.*?)["']?\)/gi, (_, path) => `url("${toAbsoluteUrl(path)}")`);
      return `<style>${updatedCss}</style>`;
    });

    // 🛡️ Remove existing CSP meta tags that block assets
    html = html.replace(/<meta[^>]*content-security-policy[^>]*>/gi, '');

    res.send(html);
  } catch (error) {
    console.error('Error fetching URL:', error.message);
    res.status(500).send('Error fetching the URL.');
  }
});

module.exports = router;
