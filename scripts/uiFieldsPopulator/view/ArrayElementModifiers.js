var ArrayElementModifiers = function () {
    var inputElementsInitiator = new InputElementInitiator();

    this.removeAdditionalComponentsFromArrayElements = function () {
        var allArrayInputElems = $('.arrayElement').closest('.inputElem').parent(),
            i;
        for (i = 0 ; i < allArrayInputElems.length; i++) {
            $(allArrayInputElems[i]).children('.inputElem:gt(0)').remove();
        }
    };

    this.fixSizeOfArrayElements = function (arrayElements, jsonData) {
        var arrayElementsCount = arrayElements.length,
            extras = arrayElementsCount - jsonData.length,
            index,
            clonedElement;

        //Array elements are more than items in json. Hence need to remove extras
        //But we do not want to delete all of them
        if (extras > 0) {
            for (index = jsonData.length; index < arrayElementsCount && index != 0; index += 1) {
                arrayElements[index].remove();
            }
        }
            //Array elements are less than items in json. Hence need to clone extra items
        else if (extras < 0) {
            for (index = arrayElementsCount; index < jsonData.length; index += 1) {
                clonedElement = Common.util.cloneItem(arrayElements[0], arrayElements[arrayElementsCount - 1]);
                inputElementsInitiator.reinitiateInputItems(clonedElement);
                arrayElements.push(clonedElement);
            }
        }
    };



    return this;
};