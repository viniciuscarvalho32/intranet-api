onload = function() {
    const btnReload = document.querySelector('.refresh');
    btnReload.addEventListener('click', function() {
        btnReload.classList.remove("refresh");
        btnReload.classList.add("refreshgif");
        location.href = "/fretes";
    })
    
    const btnCheck = document.querySelector('#check');
    if (btnCheck) {
        btnCheck.addEventListener('click', function() {
            const btnReload = document.querySelector('.refresh');
            btnReload.classList.remove("refresh");
            btnReload.classList.add("refreshgif");
            location.href = "/fretes";
        });
    }
    
    const statustd = document.querySelector('#statustd');
    if (statustd) { 
        var classetd = statustd.className;
        //console.log(classetd);
        if ((classetd === "status1") || (classetd === "status2")) {
            let check = document.querySelector('#check');
            check.classList.remove('check');
            check.classList.add('checkhiden');
        }
    }

    var activities = document.querySelector("#selfil");
    //console.log(activities);
    if (activities) {
        activities.addEventListener("change", function(event) {
            const sigfillist = document.querySelectorAll("tbody #sigfil"); 
            sigfillist.forEach(function(elemento) {
                if(event.target.value != elemento.innerHTML) {
                   var elementoTR = elemento.parentNode;
                   elementoTR.classList.add("trhiden");
                } 
            })
        });
    }
    /*
    const logret = document.querySelector(".logret").innerHTML;
    const msgret = document.querySelector(".msgret").innerHTML;
    console.log(logret)
    console.log(msgret)
    */
    //if (!logret) {
    //    msgret.classList.remove("logret");
    //    msgret.classList.add("errohidden");
    //}
    /*
    setInterval(() => {
        msgret.classList.remove("logret");
        msgret.classList.add("errohidden");
    }, 10000);
    */
    /*
    const backgroundmsg = document.querySelector(".msg");
    console.log(backgrounderro.innetText)
    
    if (!backgroundmsg.innerText) {
        backgroundmsg.classList.remove("msg");
        backgroundmsg.classList.add("msghidden")
    }
    */
}