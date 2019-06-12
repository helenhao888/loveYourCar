var makeArr=["Honda","Ford","Dodge","Nissan"];
const startYear=1990;
const endYear=2019;
var make,model,year,vehicleTyp;
var makeSelFlg,yearSelFlg,vTypSelFlg,modelSelFlg;
var modelArr=[];

$(document).ready(function(){
console.log("ready");
initialFun();

function initialFun(){    
    //initialize variables
    makeSelFlg=false;
    yearSelFlg=false;
    vTypSelFlg=false;
    modelSelFlg=false;
    // load makes from array    
    getMakeList();
    getYearList();
    

}

//create  button from the each value in array topics
function getCarInfo(type){
var queryStr;
//call ajax 
// var queryUrl="https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValuesExtended/5UXWX7C5*BA?format=json&modelyear=2011";
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
	error: function(xhr, ajaxOptions, thrownError)
	{
		console.log(xhr.status);
		console.log(thrownError);
	}
});
}


function getMakeList(){
    
    for (var i=0;i<makeArr.length;i++){
        var makeOption=$("<option>").addClass("makeClass").text(makeArr[i]);
              
        $("#make-menu").append(makeOption);        
    }   
}

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
    } else{
        vTypSelFlg=false;
    }   

    if(yearSelFlg && makeSelFlg && vTypSelFlg){
        getCarInfo("model");}
})

$("select.model").change(function(){

    console.log("model",$(this).children("option:selected").val());
    model=$(this).children("option:selected").val()
    if (model != 1){
        modelFlg=true;
    } else{
        modelFlg=false;
    }   

    
})

function createVTypList(data){
    console.log("data",data);
    $("#vehicle-menu").empty();
    for(var k=0;k<data.length;k++){        
        var typeOption=$("<option>").addClass("typClass").text(data[k].VehicleTypeName);
        $("#vehicle-menu").append(typeOption);  
    }
}

function createModelList(data){
    console.log("data",data);
    $("#model-menu").empty();
    for(var k=0;k<data.length;k++){
        dataModel=data[k].Model_Name;
        if(!modelArr.includes(dataModel)){
           modelArr.push(dataModel);
           var typeOption=$("<option>").addClass("typClass").text(dataModel);
           $("#model-menu").append(typeOption);  
        }
    }
}

})