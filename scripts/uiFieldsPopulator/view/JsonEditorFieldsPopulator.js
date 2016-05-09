var JsonEditorFieldsPopulator = function () {
    var arrayElementsModifiers = new ArrayElementModifiers();

    this.populateArrayElement = function (domNode, jsonData, parentProp) {
        var arrayRoot = $(domNode.find("[propertyidentifier='" + parentProp + "']")).first();
        if (arrayRoot.length > 0) {
            arrayElements = $(arrayRoot).children(".inputElem");
            arrayElementCount = arrayElements.length;

            //Adjust number of array elements in UI
            arrayElementsModifiers.fixSizeOfArrayElements(arrayElements, jsonData);

            for (index = 0; index < jsonData.length; index += 1) {
                $(arrayElements[index]).removeClass("stayHidden");
                this.populateUIFieldsWithJSON(jsonData[index], $(arrayElements[index]));
            }
        }
    },

    this.populateObjectElement = function (domNode, jsonData, parentProp) {
        var selection,
            selectionRef,
            childNode;

        if (jsonData.type != "service" &&
                jsonData.type != "profile" &&
                jsonData.type != "filter") {

            if ("type" in jsonData) {
                if (parentProp === undefined) {
                    parentProp = "type";
                }
                else {
                    parentProp = parentProp + ".type";
                }

                selection = $(domNode.find("[propertyidentifier='" + parentProp + "']")).first();
                selection.setValue(jsonData.type);
                selection.trigger("change");
                selectionRef = selection.find("option[value='" + jsonData.type + "']").attr('data-target');
                childNode = domNode.find("[reference='" + selectionRef + "']");
                domNode = childNode;
            }
            else {
                if (parentProp !== undefined) {
                    domNode = $(domNode.find("[propertyidentifier='" + parentProp + "']")).first();
                    domNode.children('.inputElem').removeClass("stayHidden");
                }
            }
        }
        domNode.children(".inputElem").find("[type=checkbox]").each(function () {
            if ($(this).attr("default-value") !== undefined) {
                $(this).setValue($(this).attr("default-value"));
            }
        });
        for (prop in jsonData) {
            if (prop === "type" || prop === "rules") {
                continue;
            }
            this.populateUIFieldsWithJSON(jsonData[prop], domNode, prop);
        }
        return domNode;
    },

    this.populatePrimitiveElement = function (domNode, jsonData, parentProp) {
        var primitiveProperty = $(domNode);

        if (parentProp !== undefined) {
            primitiveProperty = primitiveProperty
                .find("*")
                .andSelf()
                .filter("." + parentProp)
                .first();
        }
        primitiveProperty = primitiveProperty
                .find('*').andSelf()
                .filter(" .inputElement").first();

        primitiveProperty.setValue(jsonData);
        primitiveProperty.trigger("change");
    };

    this.populateUIFieldsWithJSON = function (jsonData, domNode, parentProp) {
        var index = 0,
            prop,
            property,
            selection,
            selectionRef,
            childNode,
            arrayRoot,
            arrayElements,
            primitiveProperty;

        //For array
        if (typeof jsonData === "object" && jsonData.length !== undefined) {
            this.populateArrayElement(domNode, jsonData, parentProp);
        }
        //For object
        else if (typeof jsonData === "object") {
            domNode = this.populateObjectElement(domNode, jsonData, parentProp);
        }
        //For element
        else {
            this.populatePrimitiveElement(domNode, jsonData, parentProp);
        }
    };

    return this;
};