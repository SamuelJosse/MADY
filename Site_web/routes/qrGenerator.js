var express = require('express');
var router = express.Router();
var QRCode = require('qrcode');

/* GET home page. */
router.get('/', function(req, res, next) {

    if ( !req.session.connected) {
        res.render("forbidden"); 
    }

    if ( req.session.role != "Producteur") {
        res.render("forbidden"); 
    }

    if ( req.query == undefined ){
        console.log("No parameter on the query");
        res.render('qrGenerator',{url:"https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Antu_dialog-error.svg/768px-Antu_dialog-error.svg.png"});
    }

    if (req.query.commandTimestamp == undefined){
        console.log("Undefined commandTimestamp");
        res.render('qrGenerator',{url:"https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Antu_dialog-error.svg/768px-Antu_dialog-error.svg.png"});
    }

    QRCode.toDataURL(req.query.commandTimestamp, function (err, url) {
        if (err){
            res.render('qrGenerator',{url:"https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Antu_dialog-error.svg/768px-Antu_dialog-error.svg.png"});
        } else {
            console.log(url);
            res.render('qrGenerator',{url});
        }
        
    });

    
});

router.post('/', function(req, res, next) {

    if ( !req.session.connected) {
        res.render("forbidden"); 
    }

    if ( req.session.role != "Livreur" && req.session.role != "Commercant" ) {
        res.render("forbidden"); 
    }

    res.render('qrGenerator');
});

module.exports = router;
