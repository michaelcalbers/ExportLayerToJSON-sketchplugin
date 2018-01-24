@import 'common.js'

var onRun = function(context) {
  // reference the sketch document
  var doc = context.document;
  var selection = context.selection;
  
  // make sure something is selected
  if (selection.count() == 0) {
    doc.showMessage("Please select a layer.");
  } else { // good. something is selected.
    //*** let the user specify where to put the XML file
    // setup a variable... allow xml to be written to the folder
    // var fileTypes = [NSArray arrayWithObjects:@"json", nil]; // --> resulted in "ObjC method arrayWithObjects: requires 1 argument, but JavaScript passed 2 arguments"
    var fileTypes = ["json"];
    
    // create a folder/directory chooser window
    var panel = [NSOpenPanel openPanel];
    [panel setCanChooseDirectories:true];
    [panel setCanCreateDirectories:true];
    [panel setAllowedFileTypes:fileTypes];
    
    // create variable to check what button was selected/clicked
    var clicked = [panel runModal];
    // check if clicked
    if (clicked == NSFileHandlingPanelOKButton) {
      
      var isDirectory = true;
      // get the folder path
      var firstURL = [[panel URLs] objectAtIndex:0];
      // format it to a string
      var file_path = [NSString stringWithFormat:@"%@", firstURL];
      
      // remove the 'file://'' path from string
      if (0 === file_path.indexOf("file://")) {
        file_path = file_path.substring(7);
      }
      //log("Path: " + file_path);

    }
    // loop through the selected layers and export the XML
    for(var i = 0; i < selection.count(); i++){
      var layer = selection[i];
      //log(layer);
      exportJSON(layer, file_path);
    }
  }
};

// The heavy-lifting to create the JSON data and JSON file
function exportJSON(layer, file_path){

  // initialize the layer array
  var layerArray = [];

  // create the variables
  var layerName = String(layer.name());
  var layerFrame = layer.absoluteRect();
  var layerXpos = String(layerFrame.x());
  var layerYpos = String(layerFrame.y());
  var layerHeight = String(layerFrame.height());
  var layerWidth = String(layerFrame.width());

  // add the strings to the array
  layerArray.push({
      name: layerName,
      xPos: layerXpos,
      yPos: layerYpos,
      height: layerHeight,
      width: layerWidth,
  });
  
  // Create the JSON object from the layer array
  var jsonObj = { "layer": layerArray };
  // Convert the object to a json string
  var file = NSString.stringWithString(JSON.stringify(jsonObj, null, "\t"));
  // Save the file
  [file writeToFile:file_path+layerName+".json" atomically:true encoding:NSUTF8StringEncoding error:null];

  var alertMessage = layerName+".json saved to: " + file_path;
  alert("Layer JSON Exported!", alertMessage);
}