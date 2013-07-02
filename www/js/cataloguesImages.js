// local storage catalogue listing
// arry structure: catalogueID,Name,image|catalogueID,Name,image

var catalogueKey = "catalogueKey";
var catalogueString = "";

var imageKey = "imageKey";
var imageString = "";

var array1;
var array2;

function catalogueLoad(catalogueID) {
    catalogueString = localStorage.getItem(catalogueKey);

    if (catalogueString !== null || catalogueID == 0) {
        array1 = catalogueString.split("|");
        if (catalogueID == 0) {
            return catalogueString;
        } else {
            for (i = 0; i < array1.length; i++) {
                array2 = array1[i];
                if (array2[0] == catalogueID) {
                    return array2[0];
                }
            }
        }
    } else {
        return "";
    }
}

function catalogueSave(catalogueID, catalogueName, image) {
    catalogueString = localStorage.getItem(catalogueKey);

    if (catalogueString == null) {
        catalogueString = catalogueID + "," + catalogueName + "," + image;
    } else {
        var catalogue = catalogueLoad(catalogueID);

        if (catalogue !== undefined) {
            // catalogue already exists
        } else {
            catalogueString += "|" + catalogueID + "," + catalogueName + "," + image;
        }
    }

    localStorage.setItem(catalogueKey, catalogueString);
}

function catalogueDelete(catalogueID) {
    catalogueString = localStorage.getItem(catalogueKey);

    if (catalogueString == null) {

    } else {
        var catalogue = catalogueLoad(catalogueID);

        if (catalogue !== undefined) {
            // catalogue already exists
            var removeIndex = -1;

            array1 = catalogueString.split("|");
            
            for (i = 0; i < array1.length; i++) {
                array2 = array1[i];
                if (array2[0] == catalogueID) {
                    removeIndex = i;
                }
            }

            if (removeIndex !== -1) {
                if (array1.length == 1){
                    catalogueString = "";
                } else if (removeIndex == 0) {
                    catalogueString = catalogueString.replace(array1[0] + "|", "");
                }else{
                    catalogueString = catalogueString.replace("|" + array1[removeIndex], "");
                }
            }
        }
    }

    localStorage.setItem(catalogueKey, catalogueString);
}

// local storage image listing
// imageid,imageid

function imageLoad(imageID) {
    try{
        imageString = localStorage.getItem(imageKey);
        
        if (imageString !== null) {
            array1 = imageString.split(",");
            if (imageID == 0) {
                return imageString;
            } else {
                for (i = 0; i < array1.length; i++) {
                    if (array1[i] == imageID) {
                        return array1[i];
                    }
                }
            }
        } else {
            return "";
        }
    } catch(ex){
        alert(ex);
    }
}

function imageSave(imageID) {
    imageString = localStorage.getItem(imageKey);

    if (imageString == null) {
        
        
        imageString = imageID;
    } else {
        var image = imageLoad(imageID);

        if (image !== undefined) {
            // catalogue already exists
        } else {
            imageString += "," + imageID;
        }
    }

    localStorage.setItem(imageKey, imageString);
}