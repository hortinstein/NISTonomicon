// TODO Fix the output to load dynamically from the NIST website
var controlJSON = require("../output/saved_800-53_rev4.json");

var familyCount = 0
var controlCount = 0
var enhancementCount = 0
//parse out the enhancements from each control
//


//formats the control or enhancement number
// var formatControlNumber(number){
//     return number.number.replace(/ /g, '_')
//                         .replace(/-/g, '_')
//                         .replace(/\)/g, '')
//                         .replace(/\(/g,'')
// }


var parseEnhancements = function(controlEnhancements){
    var parsedEnhancements = {};
    for (i in controlEnhancements){
        enhancementCount++
        if (controlEnhancements[i].number !== undefined ) { //ensuring the property is there
            var enhancement = controlEnhancements[i]
            parsedEnhancements[enhancement.number] = enhancement.title
        } else{ //edge case if there is only one enhancement...nist formatting or XML is awful
            var enhancement = controlEnhancements
            parsedEnhancements[enhancement.number] = enhancement.title
            break;
        }
    }
    return parsedEnhancements;
}

// this function parses out each control, saving relevant data in a data structure used to build the 
// templated tests, it will also seperate out any control enhancements
var parseControl = function(control,controlsDict){
    if (!controlsDict.hasOwnProperty([control.family])){
        familyCount++    
        controlsDict[control.family] = {}
    } 
    controlCount++
    controlsDict[control.family][control.title] = {}
    controlsDict[control.family][control.title]['title'] = control.title
    //console.log(control.family, control.number, control.title);

    if (control.hasOwnProperty('control-enhancements')){
        var controlEnhancementSet = control['control-enhancements']['control-enhancement']
        controlsDict[control.family][control.title]['enhancements'] = parseEnhancements(controlEnhancementSet); 
    }
    return controlsDict
}

var parseControlSet = function(controlSet){
    controlsDict = {};
    var controlSet = controlJSON["controls:controls"]["controls:control"];
    for (i in controlSet){ //lists all of the controls in 800-53
        if (controlSet.hasOwnProperty(i)) { //ensuring the property is there
            controlsDict = parseControl(controlSet[i],controlsDict)
        }
        //console.log(controlsDict)

    }
}

parseControlSet(controlJSON)
console.log("parsed ",familyCount," families ",controlCount," controls ", enhancementCount, " enhancementCount" )