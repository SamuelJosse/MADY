function launch(){
    const slidePage = document.querySelector('.slidepage');
    const firstNextBtn = document.querySelector('.nextBtn');
    const prevBtnSec = document.querySelector('.prev-2');
    const nextBtnSec = document.querySelector('.next-2');

    const prevBtnThr = document.querySelector('.prev-3');
    const nextBtnThr = document.querySelector('.next-3');

    const prevBtnFour = document.querySelector('.prev-4');
    const nextBtnFour = document.querySelector('.next-4');

    const prevBtnFive = document.querySelector('.prev-5');
    const nextBtnFive = document.querySelector('.next-5');

    const prevBtnSix = document.querySelector('.prev-6');
    const submitBtn = document.querySelector('.submit');

    const progressText = document.querySelectorAll('.step p');
    const progressCheck = document.querySelectorAll('.step .check');
    const bullet = document.querySelectorAll('.step .bullet');
    var select = document.querySelector(".choice");

    let max = 6;
    let current = 1;
    firstNextBtn.addEventListener("click", function(){
        var name = document.getElementById('name');
        var surname = document.getElementById('surname');
        if(name.value != "" && surname.value != ""){
            slidePage.style.marginLeft = "-25%";
            bullet[current - 1].classList.add("active");
            progressCheck[current - 1].classList.add("active");
            progressText[current - 1].classList.add("active");
            current++;
            document.getElementById("alert").innerHTML = "";
        }else{
            document.getElementById("alert").innerHTML = "Nom ou Prénom vide";
        }
        
    })

    nextBtnSec.addEventListener("click", function(){
        var mail = document.getElementById('mail');
        var phone = document.getElementById('phone');
        console.log(mail.value + " "+ phone)
        const re = /\S+@\S+\.\S+/;
        if(re.test(String(mail.value).toLowerCase()) && phone.value != ""){
            slidePage.style.marginLeft = "-50%";
            bullet[current - 1].classList.add("active");
            progressCheck[current - 1].classList.add("active");
            progressText[current - 1].classList.add("active");
            current++;
            document.getElementById("alert_2").innerHTML = "";
        }else{
            document.getElementById("alert_2").innerHTML = "Mail ou Téléphone invalide";
        }
    })
    nextBtnThr.addEventListener("click", function(){
        if(select.value == "Livreur"){
            slidePage.style.marginLeft = "-75%";
            bullet[current - 1].classList.add("active");
            progressCheck[current - 1].classList.add("active");
            progressText[current - 1].classList.add("active");
            current++;
        }else{
            slidePage.style.marginLeft = "-100%";
            bullet[current - 1].classList.add("active");
            progressCheck[current - 1].classList.add("active");
            progressText[current - 1].classList.add("active");
            current = current+1;
        }
    })
    nextBtnFour.addEventListener("click", function(){
        slidePage.style.marginLeft = "-125%";
        /*bullet[current - 1].classList.add("active");
        progressCheck[current - 1].classList.add("active");
        progressText[current - 1].classList.add("active");
        current++;*/
    })

    nextBtnFive.addEventListener("click", function(){
        slidePage.style.marginLeft = "-125%";
        /*bullet[current - 1].classList.add("active");
        progressCheck[current - 1].classList.add("active");
        progressText[current - 1].classList.add("active");
        current++;*/
    })


    submitBtn.addEventListener("click", function(){
        var password = document.getElementById('password');
        var repassword = document.getElementById('repassword');
        if(password.value == repassword.value){
            bullet[current - 1].classList.add("active");
            progressCheck[current - 1].classList.add("active");
            progressText[current - 1].classList.add("active");
            current++;
            document.getElementById("alert_5").innerHTML = "";
        }else{
            document.getElementById("alert_5").innerHTML = "Mot de passe différent";
        }
      

    })

    prevBtnSec.addEventListener("click", function(){
        slidePage.style.marginLeft = "0%";
        bullet[current - 2].classList.remove("active");
        progressCheck[current - 2].classList.remove("active");
        progressText[current - 2].classList.remove("active");
        current --;
        
    })

    prevBtnThr.addEventListener("click", function(){
        slidePage.style.marginLeft = "-25%";
        bullet[current - 2].classList.remove("active");
        progressCheck[current - 2].classList.remove("active");
        progressText[current - 2].classList.remove("active");
        current --;
    })

    prevBtnFour.addEventListener("click", function(){
        slidePage.style.marginLeft = "-50%";
        bullet[current - 2].classList.remove("active");
        progressCheck[current - 2].classList.remove("active");
        progressText[current - 2].classList.remove("active");
        current --;
    })
    prevBtnFive.addEventListener("click", function(){
        if(select.value == "Livreur"){
            slidePage.style.marginLeft = "-75%";
            bullet[current - 2].classList.remove("active");
            progressCheck[current - 2].classList.remove("active");
            progressText[current - 2].classList.remove("active");
            current --;
        }else{
            slidePage.style.marginLeft = "-50%";
            bullet[current - 2].classList.remove("active");
            progressCheck[current - 2].classList.remove("active");
            progressText[current - 2].classList.remove("active");
            current --;
        }

    })
    prevBtnSix.addEventListener("click", function(){
        if(select.value == "Livreur"){
            slidePage.style.marginLeft = "-75%";
            bullet[current - 2].classList.remove("active");
            progressCheck[current - 2].classList.remove("active");
            progressText[current - 2].classList.remove("active");
            current --;
        }else{
            slidePage.style.marginLeft = "-100%";
            bullet[current - 2].classList.remove("active");
            progressCheck[current - 2].classList.remove("active");
            progressText[current - 2].classList.remove("active");
            current --;
        }
    })
}


