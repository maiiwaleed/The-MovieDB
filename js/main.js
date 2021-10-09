
//=====================sidebar========================

//$('.content').css({display:"none"});
$(".side-bar").css("left",-$(".side-bar .content").outerWidth())
$('.trigger').click(function (e) { 
    let ofst= $('.ribbon').offset().left;
    $('.side-bar').animate({left:`${-ofst}`},1000)

    //$('.content').css({display:"block"});
    let  linksArr=Array.from($("ul li"))

    
   if( $(this).hasClass("fa-bars")){
        $(this).removeClass("fa-bars")
        $(this).addClass("fa-times")

        linksArr.forEach((item)=>{item.classList.add("animate__animated","animate__fadeInUp")})
        linksArr.forEach((item)=>{item.classList.remove("animate__fadeOutDown")})
        
   }
   else{
        $(this).addClass("fa-bars")
        $(this).removeClass("fa-times")
        
        linksArr.forEach((item)=>{item.classList.add("animate__fadeOutDown")})

        linksArr.forEach((item)=>{item.classList.remove("animate__fadeInUp")})
   }

});

$(".contact").click(function(){
    let ofstNav= $(".form-section").offset().top ;
    $("html , body").animate({scrollTop : ofstNav} , 2000)
})

//========================form=========================
let allFlags=0;
let flags=[0,0,0,0,0,0]; //by default false to disable button
for(let i=0; i<6;i++){
    let valu;
    let regArr=[/^[a-zA-Z]+( [a-zA-Z]+)$/,/^[a-zA-Z0-9_\-\.]+\@[a-z.]+(\.com){1}$/,/^(01)[2,5,1,0][0-9]{8}$/,/^[1-3][0-9]$/,/.{8,20}/];
    
    let pass1Val;

    $(".form").eq(i).change(function(){
        valu=$(".form").eq(i).val()  
        
        // $(this).change(function () {  });
        if(i!=5){   
            if( !regArr[i].test(valu) ||valu==""){
                $(this).next().removeClass("d-none");
                $(this).addClass("is-invalid")
                $(this).removeClass("is-valid")
                $(".btn-outline-danger").addClass("disabled")
                 flags[i]=0
                //  allFlags--
                //  console.log(allFlags)
            }
            else{
                $(this).removeClass("is-invalid")
                $(this).addClass("is-valid")
                $(this).next().addClass("d-none");
                flags[i]=1;//correct
                // allFlags++
                 console.log(flags)
            } 
        }
        else{ //check if password2 matches password1
            pass1Val=$(".form").eq(4).val()
            valu=$(this).val()
                
            if( pass1Val!=valu ||valu==""){
                $(this).next().removeClass("d-none");
                $(this).addClass("is-invalid")
                $(this).removeClass("is-valid")
                $(".btn-outline-danger").addClass("disabled")
                flags[i]=0
                // allFlags--
                // console.log(allFlags)
            }
            else{
                $(this).removeClass("is-invalid")
                $(this).addClass("is-valid")
                $(this).next().addClass("d-none");
                flags[i]=1;//correct  
                // allFlags++
                 console.log(flags)
            }  
        } 
        //   if(($(".form").eq(4).val().length!=0)&&($(".form").eq(5).val().length!=0)){

        //   }
        const allFlags=flags.reduce((total,flag)=>total+flag,0)
        if(allFlags==6){
            $(".btn-outline-danger").removeClass("disabled")
        }  
        else{
            $(".btn-outline-danger").addClass("disabled")
        }    
        // console.log(allFlags)  
});
       
}//end of for

//=========================AJAX==========================

function displayMovies(poster,title,desc,rate,release){     
    let imgPath='https://image.tmdb.org/t/p/w500/'
      if(poster!= null){
                $(".row-main").prepend(`
                <div class="col-md-4 my-3 ">
                <div class="movie position-relative">
                <img class="img-fluid rounded-2" src="https://image.tmdb.org/t/p/original/${poster}" alt="">
                    
                <div class="caption w-100 text-center">
                    <h2 class="pt-5">${title}</h2>
                    <p>${desc}</p>
                    <p><span>rate: </span> <span>${rate}</span></p>
                    <p>${release}</p>
                </div>
                </div>
            </div>             
            `)
      }
}

//initial  display data

async function mainApi(currentPage,index){
    let myData = await fetch(`https://api.themoviedb.org/3/movie/${currentPage}?api_key=eba8b9a7199efdcb0ca1f96879b83c44&fbclid=IwAR32Px4_3ZTHYF-tjdSOdkN82Esd5XSCl7c0ueF0LR8urOnlJBZ4TJJdf_k&page=${index}`);
    myData = await myData.json()
    return myData
}
let start=1
let startPage="now_playing";

$(".movie-list").click(function(){
    startPage=$(this).text().toLowerCase().replace(" ","_");
     movies(1)
     $('.current-title h2').text($(this).text())
     $("html , body").animate({scrollTop : "0"} , 2000)
})

async function movies(start) {
  
    let myData= await mainApi(startPage,start)
    let results =myData.results.length;
     $(".row-main").empty();
     
    for (let i=0;i<results;i++){  
        displayMovies(myData.results[i].poster_path,myData.results[i].original_title,myData.results[i].overview,myData.results[i].vote_average,myData.results[i].release_date)
    }
        $(".pages").empty()
        for(var k=1;k<myData.total_pages+1;k++){
            $(".pages").append(`<li class="page-item"><a class="page-link" >${k}</a></li>`)
            //console.log("in movies")
        }
        
        $(".pages").click(function(e){
            let index=e.target.innerText;
            //$(".pageNum").empty();
            $(".pageNum").html(`page ${index}`)
            $(".row-main").empty();
            movies(index)
        })
    }

//===========================search====================


    async function getLink(keyword,pos){
        $(".row-main").empty();
         //make sure only limited amount of search appears//one page only aka 20 movie
        //let apiKey=''

        let link=await fetch(`https://api.themoviedb.org/3/search/movie?api_key=eba8b9a7199efdcb0ca1f96879b83c44&fbclid=IwAR32Px4_3ZTHYF-tjdSOdkN82Esd5XSCl7c0ueF0LR8urOnlJBZ4TJJdf_k&language=en-US&page=${pos}&query=${keyword}`)
        link = await link.json()
        let results = link.results.length;
        //let path="/qHNjcjKa6VHJsa0Eu0DHl2BaYw3.jpg"
        $(".row-main").empty()
        for (let i=0;i<results;i++){       
            if(link.results[i].poster_path!=null){  
                displayMovies(link.results[i].poster_path,link.results[i].original_title,link.results[i].overview,link.results[i].vote_average,link.results[i].release_date)
            }            
        }   
    
        $(".pages").empty()   
        const totPages =link.total_pages 
        //console.log(totPages)
        for(let k=1;k<totPages+1;k++){
            $(".pages").append(`<li class="page-item"><a class="page-link" >${k}</a></li>`)
            
        }
        $(".pages").click(function(e){
            let index=e.target.innerText;
            $(".pageNum").html(`page ${index}`)
            $(".row-main").empty();     
            getLink($('.search1').val(),index);
              })           
    }

    
function initialDisplay(){  
    if($('.search1').val().length==0){
        $(".pages").empty()
        //$(".row-main").empty();
        movies(1)
    }
 
}
    
initialDisplay()

$('.search1').keyup(function (e) { 
   if($('.search1').val().length==0)
   $('.current-title h2').text("Now Playing")
    initialDisplay()   
});

$('.search2').keyup(function (e) { 
    if($('.search2').val().length==0)
    $('.current-title h2').text("Now Playing")
     initialDisplay()   
 });


$('.search1Btn').click(function(){
    let word=$('.search1').val();
    $(".row-main").empty();
    $('.current-title h2').text("All Movies")
    getLink(word,1);
 
})


$('.search2Btn').click(async function(){
    let word=$('.search2').val();
    $('.current-title h2').text("Now Playing")
    $(".row-main").empty();
    $(".pageNum").empty();
    $(".pages").empty()
    let myData= await mainApi("now_playing",1)
    let results = myData.results.length;
    for(let p=1; p<myData.total_pages+1 ; p++ ){     
        myData= await mainApi("now_playing",p)            
        for(let i=0;i<results;i++){   
            if( myData.results[i].original_title.toLowerCase().includes(word)){
           
            displayMovies(myData.results[i].poster_path,myData.results[i].original_title,myData.results[i].overview,myData.results[i].vote_average,myData.results[i].release_date)
            }               
        }           
    }    
})