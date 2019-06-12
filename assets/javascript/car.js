var makeArr=["Honda","Ford","Dodge","Nissan"];
const startYear=1990;
const endYear=2019;
var make,model,year,vehicleTyp;
var makeSelFlg,yearSelFlg,vTypSelFlg,modelSelFlg;
var modelArr=[];
var typeArr=[];

$(document).ready(function(){

initialFun();

function initialFun(){    
    //initialize variables
    makeSelFlg=false;
    yearSelFlg=false;
    vTypSelFlg=false;
    modelSelFlg=false;
    modelArr=[];
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

$("select.make").change(function(){

    console.log("make",$(this).children("option:selected").val());
    make=$(this).children("option:selected").val()
    if (make != 1){
        makeSelFlg=true;
        //if user reselect make again, use flags to make sure model flag and vehicle type must be reselected. 
        modelSelFlg=false;
        vTypSelFlg=false;
    } else{
        makeSelFlg=false;
    }
    console.log("make flag",makeSelFlg);
    getCarInfo("vehicle-type");

    if(yearSelFlg && makeSelFlg && vTypSelFlg){
        getCarInfo("model");}    
    
})

$("select.year").change(function(){

    console.log("this year",$(this).children("option:selected").val());
    year=$(this).children("option:selected").val()
    if (year != 1){
        yearSelFlg=true;
        //if user reselect year again, use modelSelFlg to make sure model flag must be reselected. 
        modelSelFlg=false;
    } else{
        yearSelFlg=false;
    }   

    if(yearSelFlg && makeSelFlg && vTypSelFlg){
       getCarInfo("model");}
})

$("select.vehicleTyp").change(function(){

    console.log("vehicleTyp",$(this).children("option:selected").val());
    vehicleTyp=$(this).children("option:selected").val()
    if (vehicleTyp != 1){
        vTypSelFlg=true;
        //if user reselect vehicle type again, use modelSelFlg to make sure model flag must be reselected. 
        modelSelFlg=false;
    } else{
        vTypSelFlg=false;
    }   

    if(yearSelFlg && makeSelFlg && vTypSelFlg){
        getCarInfo("model");}
})

$("select.model").change(function(){

    console.log("model",$(this).children("option:selected").val());
    model=$(this).children("option:selected").val();
    console.log("model",model);
    if (model != 1){
        modelSelFlg=true;
    } else{
        modelSelFlg=false;
    }       
    //if all the make,year,type and model have been selected, set search button to enable3
    console.log("flags",makeSelFlg+" "+yearSelFlg+" "+modelSelFlg+" "+vTypSelFlg);
    if(makeSelFlg && yearSelFlg && modelSelFlg && vTypSelFlg){
        $("#btnSearch").prop("disabled",false);
    }
    
}) 


$("#btnSearch").on("click",function(){

    console.log("click search button");
   

})


function createVTypList(data){
    console.log("data",data);
    var typeOption;
    $("#vehicle-menu").empty();    
    //add first option 
    typeOption=$("<option>").addClass("vehicle-option").text("Select Vehicle Type").val("1");
    $("#vehicle-menu").append(typeOption);
    for(var k=0;k<data.length;k++){        
        var dataType=data[k].VehicleTypeName;
        if(!typeArr.includes(dataType)){
            typeArr.push(dataType);
            typeOption=$("<option>").addClass("typClass").text(dataType);
            $("#vehicle-menu").append(typeOption);  
        }
    }
    $("#vehicle-menu").prop("disabled",false).css("color","#222");
    typeArr=[];
}

function createModelList(data){
    console.log("data",data);
    var modelOption;
    $("#model-menu").empty();
    //add first option 
    modelOption=$("<option>").addClass("model-option").text("Select A Model").val("1");
    $("#model-menu").append(modelOption);  
    for(var k=0;k<data.length;k++){
        var dataModel=data[k].Model_Name;
        if(!modelArr.includes(dataModel)){
           modelArr.push(dataModel);
           modelOption=$("<option>").addClass("modelClass").text(dataModel);
           $("#model-menu").append(modelOption);  
        }
    }
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
    
    $.ajax({
        url: queryUrl,
        type: "GET",
        dataType: "json",
        success: function(result)
        {
            console.log("result",result);
            if(type === "vehicle-type"){
                createVTypList(result.Results);}
            if(type==="model"){
               createModelList(result.Results);
            }
           
        },
        //check if need to delete ajaxOptions???????
        error: function(xhr, ajaxOptions, thrownError)
        {
            console.log(xhr.status);
            console.log(thrownError);
        }
    });
    }

})

