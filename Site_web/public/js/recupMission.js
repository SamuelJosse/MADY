
async function recupMission(){
    var coordsColis=[]
    var coords;
    if(coords === undefined){
        const getCoords = async () => {
            const pos = await new Promise((resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject);
            });
        
            return {
              long: pos.coords.longitude,
              lat: pos.coords.latitude,
            };
        };
        coords = await getCoords();
    }
    var colis = "";
    var data = await getLivraison();
    var user = await getUser();
    if( !user['user'][0]['disponible'])
        return;
    console.log(data);

    let right_max = 0;
    let top_max = 0;
    let bottom_max = 0;
    let left_max = 0;

    if(user['user'][0]['rayon'] <= 10){
        right_max =  coords['lat']+1/user['user'][0]['rayon'];
        top_max = coords['long']+1/user['user'][0]['rayon'];
        bottom_max = coords['long']-1/user['user'][0]['rayon'];
        left_max = coords['lat']-1/user['user'][0]['rayon'];
    }

    var colis_vus = [];
    if(data != undefined){
        data['data'].forEach(async element => {
            var producer = await getProducteur(element.leproducteur);
            var date_delevry = new Date(element.ladate);
            if(date_delevry.toDateString() == new Date().toDateString()){
                console.log(producer);
                lat_producer = producer['producer'][0].lat;
                long_producer = producer['producer'][0].long;
                console.log(user['user'][0]['rayon'] )
                color = await getRandomColor();
                if(user['user'][0]['rayon'] > 10){

                    colis += "<div class=\"colis-container\"><div class=\"text-container\"><p>N° "+element.qrcode+" </p><span>"+date_delevry.toDateString()+" | "+element.volumecommande+" Colis</span><span class=\"rond\" style=\" background:"+color+"\"></span></div><div class=\"btn-container\"><button onclick=\"validate("+element.idcommande+","+user['user'][0]['idparticulier']+")\">Valider</button></div></div>\n"
                    colis_vus.push(element.idcommande);
                    coordsColis.push({lat: lat_producer, long: long_producer, 'color': color});
                     //Verif
                }else if((lat_producer >= left_max && lat_producer <= right_max) && (long_producer >= bottom_max && long_producer <= top_max)){

                    colis += "<div class=\"colis-container\"><div class=\"text-container\"><p>N°"+element.qrcode+"</p><span>"+date_delevry.toDateString()+" | "+element.volumecommande+" Colis</span> <span class=\"rond\" style=\" background:"+color+"\"></span></p></div><div class=\"btn-container\"><button onclick=\"validate("+element.idcommande+","+user['user'][0]['idparticulier']+")\">Valider</button></div></div>\n"
                    colis_vus.push(element.idcommande);
                    coordsColis.push({lat: lat_producer, long: long_producer, 'color': color});
                }
            }
            var div_colis = document.getElementById('colis');
            div_colis.innerHTML = colis;
            console.log("Position colis:" +JSON.stringify(coordsColis))
            localStorage.clear();
            await localStorage.setItem("coordsColis", JSON.stringify(coordsColis));
            console.log("LocalStorage mise à jour");
            var coco = await setLivraison(colis_vus);
        })
    }

}
function getRandomColor() {
    return new Promise(resolve =>{
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        resolve(color)
    })
  }
function validate(idcommande, idparticulier){
    $.ajax({
        url: 'http://localhost:3000/api/validateColis',
        type: 'GET',
        data: {'idcommande':idcommande, 'idparticulier':idparticulier},
        success: function(data, status){
            document.location.reload();
        },
        error: function(data, status){
            console.log("validateColis: "+status);
            return;
        },
        dataType:'json'
    })
}
function setLivraison(colis_vus){

    return new Promise(resolve =>{
        colis_vus = JSON.stringify(colis_vus);
        $.ajax({
            url: 'http://localhost:3000/api/setLivraison',
            type: 'GET',
            data: {colis_vus: colis_vus},
            success: function(data, status){
                resolve(data);
            },
            error: function(data, status){
                console.log("setLivraion: "+status);
                return;
            },
            dataType:'json'
        })
    })
}
function getLivraison(){
    return new Promise(resolve =>{
        $.ajax({
            url: 'http://localhost:3000/api/livraison',
            type: 'GET',
            success: function(data, status){
                resolve(data);
            },
            error: function(data, status){
                console.log("getLivraion: "+status);
                return;
            },
            dataType:'json'
        })
    })
}
function getUser(){
    return new Promise(resolve =>{
        $.ajax({
            url: 'http://localhost:3000/api/user',
            type: 'GET',
            success: function(data, status){
                console.log(data);
                resolve(data);
            },
            error: function(data, status){
                console.log("getUser: "+status);
                return;
            },
            dataType:'json'
        })
    })
}
function getProducteur(idProducer){
    return new Promise(resolve =>{
        $.ajax({
            url: 'http://localhost:3000/api/producer',
            type: 'GET',
            data: {id: idProducer},
            success: function(data, status){
                console.log(data);
                resolve(data);
            },
            error: function(data, status){
                console.log("getUser: "+status);
                return;
            },
            dataType:'json'
        })
    })
}