
var fileName;
var fileData;
var callback;
var callbackVars;
var existCheck;
var overwrite = true;

//<write start>
var createFile = function (filename, data, callbackVars, callback, skipOverwrite, overwrite) {
    try{
        var writeOutData = function () {
            var fw = new FileWriter();
            fw.oncomplete = callback;
            fw.onerror = function () { 
                alert("Failed to save update");
            }
            fw.writeAsText("myDir/" + filename, data);
        }
	
        navigator.fileMgr.testDirectoryExists("myDir", function(exists) {
            exists ? writeOutData() :
			navigator.fileMgr.createDirectory("myDir", writeOutData, function() {
			    alert("Failed to save update");
			})
        });
    } catch (ex) {
        alert(ex);
    }
};
 
var readData = function (filename, callback) {
	var filePath = "myDir/" + filename;
	
	var readInData = function () {
		var fr = new FileReader();
		fr.onload = function (data) {
			callback(data);
		};
		fr.readAsText(filePath);
	}		
	
	navigator.fileMgr.testFileExists(filePath, function(exists) {
		exists ? readInData() : alert("file doesn't exist");
	});
}
/*
function createFile(name, data, callbackVars, callback, skipOverwrite, overwrite){
    this.fileName = name;
    this.fileData = data;
    this.callbackVars = callbackVars;
    this.callback = callback;
    if (overwrite !== undefined){
        this.overwrite = overwrite;
    }
    window.requestFileSystem(LocalFileSystem.TEMPORARY, 0, gotFSCreate, fail);
}

function gotFSCreate(fileSystem) {
    // once fily system is accessed, add the file with create options
    fileSystem.root.getFile(this.fileName, { create: true, exclusive: false }, gotCreateEntry, fail);
}
    
function gotCreateEntry(fileEntry) {
    // create writer
    if (overwrite){
        fileEntry.createWriter(gotFileWriter, fail);
    }else{
        callback(callbackVars);
    }
}
    
function gotFileWriter(writer) {
    // execute writer...
    writer.onwriteend = function (evt) {
        callback(callbackVars);
    };
    writer.write(this.fileData);
}
//</write end>
*/
//<read start>
function readFile(name, data, callback, vars, exist){
    this.fileName = name;
    this.fileData = data;
    this.callback = callback;
    this.callbackVars = vars;
    this.existCheck = exist;
    //alert("find fs");
    window.requestFileSystem(LocalFileSystem.TEMPORARY, 0, gotFSLoad, fail);
}

function gotFSLoad(fileSystem) {
    // get catalogue XML file
    //alert(this.fileName);
    if (existCheck){
        fileSystem.root.getFile(this.fileName, null, gotExists, failExists);
    } else {
        fileSystem.root.getFile(this.fileName, null, gotFileRef, fail);
    }
}
    
function gotFileRef(fileEntry) {
    //alert("getFile");
    fileEntry.file(gotFile, fail);
}
    
function gotFile(file) {
    //alert("create reader");
    readAsText(file);
}

function readAsText(file) {
    // read and populate on call back
    //alert("startRead");
    var reader = new FileReader();
    reader.onloadend = function (evt) {
        callback(evt.target.result, fileName);
    };
    reader.readAsText(file);
}

function gotExists(){
    callback(true);
}

function failExists(){
    callback(false);
}
//<read end>

//<delete end>
function deleteFile(name, callback){
    this.fileName = name;
    this.callback = callback;
    
    window.requestFileSystem(LocalFileSystem.TEMPORARY, 0, gotFSDelete, fail);
}

function gotFSDelete(fileSystem) {
    // get catalogue XML file
    fileSystem.root.getFile(this.fileName, null, gotFileDelete, fail);
}

function gotFileDelete(fileEntry) {
    fileEntry.remove(callback, fail);
}
//<delete end>
