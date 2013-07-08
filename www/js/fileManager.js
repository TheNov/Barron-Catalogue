
var fileName;
var fileData;
var callback;
var callbackVars;
var existCheck;
var overwrite = true;
var useSQL = false;
var insertTable = "Catalogues"; // Catalogues, Images
var ignorCallback = false; // Catalogues, Images

// SQL Code at the bottom of the page
//<write start>

function createFile(name, data, callbackVars, callback, skipOverwrite, overwrite, useSQL) {
    try
    {
        this.fileName = name;
        this.fileData = data;
        this.callbackVars = callbackVars;
        this.callback = callback;

        if (useSQL == true) {
            ignorCallback = true;
            var db = window.openDatabase("BarronCat", "1.0", "BarronCat", 268435456);
            db.transaction(queryDB, errorCB);

        } else {
            if (overwrite !== undefined) {
                this.overwrite = overwrite;
            }
            window.requestFileSystem(window.TEMPORARY, 80 * 1024 * 1024, gotFSCreate, function () { alert("createFile fail"); });
        }
    } catch (ex) {
        alert(ex);
    }
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

//<read start>
function readFile(name, data, callback, vars, exist) {

    this.fileName = name;
    this.fileData = data;
    this.callback = callback;
    this.callbackVars = vars;
    this.existCheck = exist;

    if (useSQL == true) {
        var db = window.openDatabase("BarronCat", "1.0", "BarronCat", (1024 * 1024 * 256) /* 256 mb */);
        db.transaction(queryDB, errorCB);
    } else {
        window.requestFileSystem(LocalFileSystem.TEMPORARY, 0, gotFSLoad, fail);
    }
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

//<sql code>

function populateDB(tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS ' + this.insertTable + ' (id unique, data)');
    tx.executeSql('INSERT INTO ' + this.insertTable + ' (id, data) VALUES ("' + this.fileName + '", "' + this.data + '")');
}

function errorCB(){
    alert("errorCB");
}

function successCB() {
    alert("successCB");
}

function queryDB(tx) {
    tx.executeSql('SELECT data FROM ' + this.insertTable + ' WHERE id = "' + this.fileName + '"', [], querySuccess, errorCB);
}

function querySuccess(tx, results) {
    // this will be true since it was a select statement and so rowsAffected was 0
    if (ignorCallback == undefined) {
        callback(results.rows.item(0).data, results.rows.item(0).id);
    } else {
        if (results.rows.length == 0) {
            var db = window.openDatabase("BarronCat", "1.0", "BarronCat", 268435456);
            db.transaction(populateDB, errorCB, successCB);
        }
    }
}

//</sql code>