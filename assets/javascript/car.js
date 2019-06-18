var makeArr=["Honda","Ford","Dodge","Nissan"];
const startYear=2018;
const endYear=2019;
var make,model,year,vehicleTyp;
var makeSelFlg,yearSelFlg,vTypSelFlg,modelSelFlg;
var modelArr=[];
var typeArr=[];
var carKey;
var ref;
var modals;
var userFlg;
var favoriteArr=[];
favoriteFlg=false;

  

$(document).ready(function(){

initialFun();

function initialFun(){    
    //initialize variables
    makeSelFlg=false;
    yearSelFlg=false;
    vTypSelFlg=false;
    modelSelFlg=false;
    favoriteFlg=false;
    modelArr=[];
    userFlg=false;    
    ref=database.ref();
    modals = $(".modal");
    M.Modal.init(modals);

     //get the favorites from localstorage and store in favorite Array    
     if (localStorage.getItem("favorite")!= null){
        favoriteArr=JSON.parse(localStorage.getItem("favorite"));
    }  
    
    $(".carRecallTable").hide();   

    // load makes from array    
    getMakeList();
    getYearList();   
    $("#btnSearch").prop("disabled",true);
}

//get the initial make list from array makeArr
function getMakeList(){
    
    for (var i=0;i<makeArr.length;i++){
        var makeOption=$("<option>").addClass("makeClass").text(makeArr[i]);
              
        $("#make-menu").append(makeOption);        
    }   
}

//get the initial year list based on the defined start and end year 
function getYearList(){
    
    for (var j=endYear;j>=startYear;j--){
        var yearOption=$("<option>").addClass("yearClass").text(j);      
        $("#year-menu").append(yearOption);        
    }   
}

//When user select a make from the list , perform this function
$("select.make").change(function(){
    
    make=$(this).children("option:selected").val()
    if (make != 1){
        makeSelFlg=true;
        //if user reselect make again, use flags to make sure model flag and vehicle type must be reselected. 
        modelSelFlg=false;
        vTypSelFlg=false;
    } else{
        makeSelFlg=false;
    }
    
    //call function getCarInfo to get the vechicle type under this make
    getCarInfo("vehicle-type");

    //if user has selected make, vehicle type and year, call getCarInfo to get models
    if(yearSelFlg && makeSelFlg && vTypSelFlg){
        getCarInfo("model");}    
    
})

//When user selects year, perform this function
$("select.year").change(function(){
    
    //get the selected value
    year=$(this).children("option:selected").val()
    if (year != 1){
        yearSelFlg=true;
        //if user reselect year again, use modelSelFlg to make sure model flag must be reselected. 
        modelSelFlg=false;
    } else{
        yearSelFlg=false;
    }   

    //if user has selected make, vehicle type and year, call getCarInfo to get models
    if(yearSelFlg && makeSelFlg && vTypSelFlg){
       getCarInfo("model");
    }
})

//when user select vehicle type, perform this function
$("select.vehicleTyp").change(function(){

    //get selected vehicle type value
    vehicleTyp=$(this).children("option:selected").val()
    if (vehicleTyp != 1){
        vTypSelFlg=true;
        //if user reselect vehicle type again, use modelSelFlg to make sure model flag must be reselected. 
        modelSelFlg=false;
    } else{
        vTypSelFlg=false;
    }  

    //if user has selected make, vehicle type and year, call getCarInfo to get models
    if(yearSelFlg && makeSelFlg && vTypSelFlg){
       getCarInfo("model");
    }
})

//when user selects model, perform this function
$("select.model").change(function(){
    //get selected model value
    model=$(this).children("option:selected").val();
   
    if (model != 1){
        modelSelFlg=true;
    } else{
        modelSelFlg=false;
    }       
    //if all the make,year,type and model have been selected, set search button to enable3
    
    if(makeSelFlg && yearSelFlg && modelSelFlg && vTypSelFlg){
        $("#btnSearch").prop("disabled",false);
    }
    
}) 

//when user click search button, perform this function
$("#btnSearch").on("click",function(){

    favoriteFlg=false;
    $(".carRecallTable").show();
    //combine the make, year and model as the key , in order to retrieve data from database
    carKey=(make+year+model).toUpperCase();
    //empty result divs
    $(".recallList").empty();
    $(".searchResult").empty();
   
    //get car sales data from database
    retrieveSaleData(carKey);
    //get car recall data from database
    retrieveMData(carKey);

})

//create vehicle type list
function createVTypList(data){
    
    var typeOption;
    $("#vehicle-menu").empty();    
    //add first option 
    typeOption=$("<option>").addClass("vehicle-option").text("Select Vehicle Type").val("1");
    $("#vehicle-menu").append(typeOption);

    //for all the vehicle types, create the dropdown select list
    for(var k=0;k<data.length;k++){        
        var dataType=data[k].VehicleTypeName;
        //remove the duplicate vehicle types pulled from API
        if(!typeArr.includes(dataType)){
            typeArr.push(dataType);
            typeOption=$("<option>").addClass("typClass").text(dataType);
            $("#vehicle-menu").append(typeOption);  
        }
    }
    //enable vehicle type select tag, so user can select the vehicle type
    $("#vehicle-menu").prop("disabled",false).css("color","#222");
    typeArr=[];
}

//create model list using the data from API 
function createModelList(data){
    
    var modelOption;
    $("#model-menu").empty();
    //add first option 
    modelOption=$("<option>").addClass("model-option").text("Select A Model").val("1");
    $("#model-menu").append(modelOption);  

    //for all the models , create model dropdown select list
    for(var k=0;k<data.length;k++){
        var dataModel=data[k].Model_Name;
        //remove the duplicate models from API
        if(!modelArr.includes(dataModel)){
           modelArr.push(dataModel);
           modelOption=$("<option>").addClass("modelClass").text(dataModel);
           $("#model-menu").append(modelOption);  
        }
    }

    //enable model select tag, so user can select the model
    $("#model-menu").prop("disabled",false).css("color","#222");
    modelArr=[];
}


//Through API , get the model or vehicle type information
function getCarInfo(type){
    var queryStr;
    
    // NHTSA API address
    var queryUrl="https://vpic.nhtsa.dot.gov/api/vehicles/";
    //Get Vehicle Types for Make by Name
    if (type === "vehicle-type"){
       queryStr = "GetVehicleTypesForMake/"+make+"?format=json"; }
    //Get Vehicle model based on the make, year and vehicletype   
    if (type === "model"){    
        queryStr = "GetModelsForMakeYear/make/"+make+"/modelyear/"+year+"/vehicletype/"+vehicleTyp+"?format=json"; }
    
    queryUrl=queryUrl+queryStr;
    
    //call API to get the vehicle data
    $.ajax({
        url: queryUrl,
        type: "GET",
        dataType: "json",
        success: function(result)
        {
            //based on the different types to get vehicle types or models
            if(type === "vehicle-type"){
                createVTypList(result.Results);}
            if(type==="model"){
               createModelList(result.Results);
            }
           
        },
        
        error: function(xhr, ajaxOptions, thrownError)
        {
            console.log(xhr.status);
            console.log(thrownError);
        }
    });
    }

 //use key to retrieve car Sale Data from database    
 function retrieveSaleData(key){

    //read database once to get the car sale data
    ref.child("carSaleData").once("value").then(function(snapshot){
        
        snapshot.forEach(function(data) {
            //get the record with the record key equals to key(make+year+model)
            if(data.key === key) {   
                createCarSale(data.val());
            }
            });
           
        });
    
 }   

//get car recall data from database
function retrieveMData(key){
    //define count to count the total children whose keys equal to variable key
    var matchCount=0;
    ref.child("carMData").once("value").then(function(snapshot){        
       
        snapshot.forEach(function(data) {
            //get the record with the record key equals to key(make+year+model)
            if(data.key === key) {    
                data.forEach(function(seqData){                
                   //call createCarMd function to create car recall table 
                   createCarMd(seqData.val());
                   matchCount++;                   
                })
            }   
        });

         //if no record found in database, call createCarMdEmpty function 
        if (matchCount === 0){            
            createCarMdEmpty();
        }
    });

   
} 

//display car sales data 
function createCarSale(sale){

    //creates tags to hold the car's image and other sale information
    // var title=$("<div>").text(sale.Make+" "+sale.Year+" "+sale.Model).addClass(".carImg col-lg-5 col-md-5 col-sm-10 col-10");
    var title=$("<div>").text(sale.Make+" "+sale.Year+" "+sale.Model);
    var imgUrl="assets/images/"+sale.Image;    
    var imgDiv=$("<img>").attr("src",imgUrl).addClass("img-fluid");
    var carImg= $("<div>").addClass(".carImg col-lg-5 col-md-5 col-sm-10 col-10");
    var carSale=$("<div>").addClass(".carSale col-lg-5 col-md-5 col-sm-10 col-10");
    carImg.append(imgDiv);

  
    // var carSale=$("<p>").addClass(".carSale").html(carImg);
   
    
    var price=Number(parseFloat(sale.Price)).toLocaleString("en");
   
    var price=$("<div>").text("Price: $"+price).addClass("carPrice");
    var extColor=$("<div>").text("Ext. Color: "+sale.Exterior);
    var intColor=$("<div>").text("Int. Color: "+sale.Interior);
    var drive=$("<div>").text("Drive : "+sale.Drive);
    var engine=$("<div>").text("Engine : "+sale.Engine);
    var trans=$("<div>").text("Transmission : "+sale.Transmission);
    var type=$("<div>").text("Type : "+sale.Type);
    
    if (favoriteFlg === false) {
        var favoriteDiv=$("<i>").addClass("fa fa-heart addFavorite");
        favoriteDiv.attr("fav-status","no");       
        carSale.append(title,favoriteDiv,price,extColor,intColor,drive,engine,trans,type);
    } else{
        carSale.append(title,price, extColor,intColor,drive,engine,trans,type);
    }      
    
    $(".searchResult").append(carImg,carSale);

}

//display car recall information
function createCarMd(mdata){   
    
    var carMData =$("<tr>").addClass("carMd");     
    //create  the table rows under the recall list
    var carMData =$("<tr>").addClass("carMd");
    carMData.append( $("<td>").text(mdata.recall_number),
                    $("<td>").text(mdata.recall_date),
                    $("<td>").text(mdata.desc),
                    $("<td>").text(mdata.consequence),
                    $("<td>").text(mdata.corrective_action));      
                 

    $(".recallList").append(carMData);
    $(".carRecallTable").show();
}

//when there is no recall record in databse, create an information table row
function createCarMdEmpty(){
 
    var carMData =$("<tr>").addClass("carMd");  
    carMData.append( $("<td>").attr("colspan",5).text("There is no recall record for this car!"));
    $(".recallList").append(carMData);
    $(".carRecallTable").show();

}




//when addFavorite is clicked, call function favFunction
$(document).on("click",".addFavorite",favFunction);

//add the favorite car's info to local Storage or delete it from local strorage
function favFunction(){
    
    var favFlg=$(this).attr("fav-status");
    var favorites=$(this);    


    if(favFlg==="yes"){
        //when the favorite tag is unselected, call the delete favorite function
        deleteFavFunction();
        favorites.attr("fav-status","no");
        favorites.css("color","black");
    }else{
        //  add the favorite car key to favoriteArr
        if(!favoriteArr.includes(carKey)){
           favoriteArr.push(carKey);    
           //save the favorite array to the local storage
           localStorage.setItem("favorite",JSON.stringify(favoriteArr));
        }
        //change favorite tag's status and color
        favorites.attr("fav-status","yes");
        favorites.css("color","red");
        
    }
}

//delete  favorite image process
function deleteFavFunction(){

     var localFavorite=localStorage.getItem("favorite");
     //If local storage has the data with key 'favorite', check if it exists, delete it 
     if (localStorage.getItem("favorite")!= null){

        //get the favorites from localstorage and store in favorite Array 
        favoriteArr=JSON.parse(localFavorite);           
        var indexFav=favoriteArr.findIndex(x=> x===carKey);   
        console.log("index",indexFav);
        if (indexFav!=-1)   {
          //delete this picture from favorite array 
           favoriteArr.splice(indexFav,1);           
           //update local storage 
           localStorage.setItem("favorite",JSON.stringify(favoriteArr));
        }      
    }

}

//when click on my Favorite, get them from local storage and display them
$(".myFavorite").on("click",function(){
    
    $(".searchResult").empty();    
    $(".recallList").empty();
    $(".carRecallTable").hide();
    var getFav=JSON.parse(localStorage.getItem("favorite"));  
    //if can get the data from local storage, display all the favorite images
    if (getFav != null){
        for (var j=0;j<getFav.length;j++){
            console.log("getFav j",getFav[j]);
            favoriteFlg=true;
            retrieveSaleData(getFav[j]);
        }
    } 
})


}) //end of document ready