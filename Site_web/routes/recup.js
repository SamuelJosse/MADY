var express = require('express');
const {Pool} = require('pg');
var bcrypt = require('bcryptjs');
var router = express.Router();
var producer = -1;
var shopkeeper = -1;
const pool = new Pool({
    user: process.env.USER,
    password: process.env.PASSWORD,
    host: process.env.HOST,
    port: process.env.PORT_DB,
    database: process.env.DATABASE
});
async function setId(id, type){
    return new Promise(resolve => {
        type = id;
        resolve(type);
    })

}
const request = {
    "id": "NDY-27",
    "order_date": "2021-03-29",
    "delivery_date": "2021-03-29",
    "box_number": "2",
    "producer": {
        "name": "Chato",
        "adresse": "2 rue Jacques Bossuet, 29000 QUIMPER",
        "geo": " 47.996365560320655, -4.137079516007125"
        },
    "shopkeeper": {
        "name": "L'Amphitryon",
        "adresse": "Rue Jérôme Piéton, 29000 QUIMPER",
        "geo": "47.99337875188882, -4.133174315233415"
    }
};

let salt = bcrypt.genSaltSync(10);
let hashedPassword = bcrypt.hashSync("abc",salt);

pool.query("INSERT INTO producteur (Nom,Prenom,Societe,AdresseSource,Mail,MotDePasse,Tel, Lat, Long) VALUES ($1,$2,$3,$4,$5,$6,$7, $8, $9)",['pr','fuc','Chato','Kergohal, 56850 CAUDAN','producteur@email.com',hashedPassword, '16548648',  47.996365560320655, -4.137079516007125])
    .then(function(res, err){
    if(err){
        console.log(err);
        return;
    }else{
        console.log("Inserting new producteur");
    }
})

pool.query("INSERT INTO Commercant (Nom,Prenom,AdresseDest, MotDePasse,Mail,Tel,Lat,Long,Societe) VALUES ($1,$2,$3,$4,$5,$6,$7, $8, $9)",['dfs','sdfs','127 Rue Colonel Jean Muller, 56100 Lorient', hashedPassword, 'commercant@email.com', '546468', 47.99337875188882, -4.133174315233415,  'L\'Amphitryon'])
    .then(function(res, err){
    if(err){
        console.log(err);
        return;
    }else{
        console.log("Inserting new commercant");
    }
})

pool.query("INSERT INTO Particulier (Nom,Prenom,Rayon,Mail,MotDePasse,Points,TypeVehicule,Tel) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)",['Pas','Livroju',15,'particulier@email.com',hashedPassword,0,1,'0684545467'])
    .then(function(res, err){
    if(err){
        console.log(err);
        return;
    }else{
        console.log("Inserting new livreur");
    }
})

router.post('/', function(req, res, next) {
    if(request){
        console.log(request)
    }
    res.render('recup');
});
async function verifAdrProducer (adr, newAdr, name){
    return new Promise(resolve => {

        if(adr !== newAdr){
            pool.query("UPDATE producteur SET AdresseSource = $1 WHERE Societe = $2",[newAdr, name])
            .then(async function(res,err){
                if(err){
                    console.log(err);
                    return;
                }else{
                    console.log("Updating adresse of the producer");
                }
            })
        }
        resolve(true);
    })
}
async function verifGeoProducer (geo, newGeo, name){
    return new Promise(resolve => {
        if(geo['lat'] != newGeo[0] || geo['long'] != newGeo[1]){
            pool.query("UPDATE producteur SET Lat = $1 , Long = $2 WHERE Societe = $3",[newGeo[0], newGeo[1], name])
            .then(async function(res,err){
                if(err){
                    console.log(err);
                    return;
                }else{
                    console.log("Updating Lat, Long of the producter");

                }
            })
        }
        resolve(true);
    })
}
async function verifProducer(request){
    return new Promise(resolve => {
        //Verif si l'adresse du producteur est diff de celle en db
        pool.query('SELECT * FROM Producteur WHERE Societe = $1',[request['producer']['name']])
        .then( async function(res, err){
            console.log("count: "+res.rowCount);
            if(err){
                console.log(err);
                return;
            }else if(res.rowCount == 0){
                console.log("Compte producteur introuvable: Veuillez créer un compte avant de faire une commande");
                return ;
            }else if(res.rowCount == 1){
                producer =  await setId(res.rows[0]['idproducteur'], producer);
                console.log(producer);
                ret = await verifAdrProducer(res.rows[0]['adressesource'],request['producer']['adresse'], request['producer']['name']);
                var geo = request['producer']['geo'].split(",");
                ret = await verifGeoProducer(res.rows[0], geo, request['producer']['name']);
                resolve(ret);
            }
        })
    })
    
}
async function verifCommercant(request){
    return new Promise(resolve =>{
        //Verif si l'adresse du commercant est diff de celle en db
        pool.query('SELECT * FROM Commercant WHERE Societe = $1',[request['shopkeeper']['name']])
        .then( async function(res, err){
            if(err){
                console.log(err);
                return;
            }else if(res.rowCount == 0){
                console.log("Compte Commerçant introuvable: Veuillez créer un compte avant de faire une commande");
                return ;
            }else if(res.rowCount == 1){
                shopkeeper = await setId(res.rows[0]['idcommercant'], shopkeeper);
                ret = await VerifAdrCommercant(res.rows[0]['adressesource'],request['shopkeeper']['adresse'], request['shopkeeper']['name']);
                var geo = request['shopkeeper']['geo'].split(",");
                ret = await VerifGeoCommercant(res.rows[0], geo, request['shopkeeper']['name']);
                resolve(ret);
            }
        })
    })
}
async function VerifGeoCommercant(geo, newGeo, name){
    return new Promise(resolve => {
        if(geo['lat'] != newGeo[0] || geo['long'] != newGeo[1]){
            pool.query("UPDATE commercant SET Lat = $1 , Long = $2 WHERE Societe = $3",[newGeo[0], newGeo[1],name])
            .then(function(res,err){
                if(err){
                    console.log(err);
                    return;
                }else{
                    console.log("Updating Lat, Long of the shopkeeper");
                }
            })
        }
        resolve(true);
    })

}
async function VerifAdrCommercant(adr, newAdr, name){
    return new Promise(resolve =>{
        if(adr !== newAdr){
            pool.query("UPDATE commercant SET AdresseDest = $1 WHERE Societe = $2",[newAdr, name])
            .then(function(res,err){
                if(err){
                    console.log(err);
                    return;
                }else{
                    console.log("Updating adresse of the shopkeeper");
                }
            })
        }
        resolve(true);
    })
}
async function insertCommande(){
    return new Promise(resolve => {
        pool.query("INSERT INTO commande (LeProducteur, LeParticulier, LeCommercant, LaDate, VolumeCommande, QRCode, Etat) VALUES ($1,$2,$3,$4,$5,$6,$7)", [producer, null, shopkeeper, request['order_date'], request['box_number'], Math.round(new Date().getTime() / 1000), "existe"])
            .then(function(res, err){
            if(err){
                console.log(err);
                return;
            }
            console.log("Order push in database");
        })
        resolve(true);
    })
}
router.get('/', async function(req, res, next) {
    if(request){

        let salt = bcrypt.genSaltSync(10);
        await verifProducer(request);
        await verifCommercant(request);
        await insertCommande(producer, shopkeeper,  request);

        console.log(producer+":"+shopkeeper);
    }
    res.render('recup');
});
module.exports = router;