const Store = require('../models/Store');

// @desc  Get all stores
// @route GET /api/v1/stores
// @access Public
exports.getStores = async (req, res, next) => {
  try {
    let location = "";
    console.log(req.body)
    switch (req.body.address) {
      case "Stumpergasse 51, 1060 Vienna": 
      location = "au_vienna_schoenbrunnerstr"; break;
      case "Ungargasse 17, Vienna, Austria": 
      location = "au_vienna_landstrasserhauptstr"; break;
      case "Linzer Straße 7, Vienna, Austria": 
      location = "au_vienna_dreyhausenstr"; break;
      case "Maurer Hauptplatz 7, 1230 Wien, Austria": 
      location = "au_vienna_maurerhauptplatz"; break;
      default: break;
    }
    console.log(location)
    const stores = await Store.find({ loc: location });
console.log(stores)
    return res.status(200).json({
      success: true,
      count: stores.length,
      data: stores
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
