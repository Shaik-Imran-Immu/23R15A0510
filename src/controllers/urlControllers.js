const Url = require('../models/Url');
const generateShortcode = require('../utils/generateShortcode');
const geoip = require('geoip-lite');

exports.createShortUrl = async (req, res) => {
  try {
    const { url, validity = 30, shortcode } = req.body;
    if (!url || !/^https?:\/\//.test(url)) {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    const expiry = new Date(Date.now() + validity * 60000);
    let code = shortcode || generateShortcode();

    const exists = await Url.findOne({ shortcode: code });
    if (exists) return res.status(409).json({ error: 'Shortcode already in use' });

    const newUrl = new Url({
      originalUrl: url,
      shortcode: code,
      expiry
    });
    await newUrl.save();

    res.status(201).json({
      shortLink: `${req.protocol}://${req.get('host')}/${code}`,
      expiry: expiry.toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.redirectShortUrl = async (req, res) => {
  try {
    const { code } = req.params;
    const urlDoc = await Url.findOne({ shortcode: code });
    if (!urlDoc) return res.status(404).json({ error: 'Shortcode not found' });

    if (new Date() > urlDoc.expiry) return res.status(410).json({ error: 'Link has expired' });

    urlDoc.clickCount += 1;
    const geo = geoip.lookup(req.ip) || {};
    urlDoc.clicks.push({
      timestamp: new Date(),
      referrer: req.get('Referrer') || '',
      location: geo.country || 'Unknown'
    });
    await urlDoc.save();

    res.redirect(urlDoc.originalUrl);
  } catch (err) {
    res.status(500).json({ error: 'Redirection failed' });
  }
};

exports.getStats = async (req, res) => {
  try {
    const { code } = req.params;
    const urlDoc = await Url.findOne({ shortcode: code });
    if (!urlDoc) return res.status(404).json({ error: 'Shortcode not found' });

    res.status(200).json({
      url: urlDoc.originalUrl,
      createdAt: urlDoc.createdAt.toISOString(),
      expiry: urlDoc.expiry.toISOString(),
      clickCount: urlDoc.clickCount,
      clicks: urlDoc.clicks
    });
  } catch (err) {
    res.status(500).json({ error: 'Could not retrieve stats' });
  }
};
