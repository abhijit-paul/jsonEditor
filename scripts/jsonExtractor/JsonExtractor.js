var JsonExtractor = function () {
    var jsonUtil = new JsonExtractorUtil(),
        jsonValidator = new JsonValidator(),
        labelElem;

    var updateJsonWithProperty = function (json, prop, targetProperties, targetDom) {
        var propTarget,
            childDom,
            childJson,
            childValue,
            domJson;

        targetProperties[prop] = jsonUtil.resolveProperty(targetProperties[prop]);
        if ("oneOf" in targetProperties[prop]) {
            propTarget = prop + ".type";
        }
        else {
            propTarget = prop;
        }
        childDom = targetDom.find("[propertyIdentifier='" + propTarget + "']").first();
        if ("oneOf" in targetProperties[prop]) {
            childJson = getJsonForOneOfReference(targetProperties[prop], childDom);
            if (jsonValidator.isValidDataElement(childJson, childDom)) {
                json[prop] = childJson;
            }

        }
        else if (childDom.hasClass("inputElement") &&
                targetProperties[prop].__json === true) {
            try {
                // Check if the input JSON is well-formed or not. If it is not well-formed,
                // throw an exception up on the screen. If it is well-formed (which means it
                // is syntactically correct JSON), store it as a raw string. The actual JSON 
                // object level interpretation of the string happens in the backend.
                if (childDom.getValue()) {
                    JSON.parse(childDom.getValue());
                }
            }
            catch (err) {
                Common.CustomMessaging.ShowErrorMessage("Invalid JSON syntax in entry field: " + targetProperties[prop].title + " " + err);
                throw "Invalid JSON syntax";
            }

            childValue = childDom.getValue();

            if (jsonValidator.isValidDataElement(childValue, childDom, targetProperties[prop]['default'])) {
                json[prop] = childValue;
            }
        }
        else if (childDom.hasClass("inputElement")) {
            childValue = getJSONForPrimitiveTypes(targetProperties[prop], childDom);
            if (jsonValidator.isValidDataElement(childValue, childDom, targetProperties[prop]['default'])) {
                json[prop] = childValue;
            }
        }
        else if (typeof targetProperties[prop] === "object") {
            childJson = jsonUtil.resolveProperty(targetProperties[prop], schema);
            domJson = getJSONForSubElement(childJson, childDom, prop);
            if (jsonValidator.isValidDataElement(domJson, childDom)) {
                json[prop] = domJson;
            }
        }
    };

    var initiateJSONFromType = function (targetJson, domNode) {
        var childDataTarget, parentDom, propType;

        propType = domNode.attr("propertyIdentifier");

        propNode = jsonUtil.getProperty(domNode, propType);
        if (targetJson.properties.type.enum[0] == propNode.getValue()) {
            childDataTarget = propNode.find("option:selected").attr('data-target');
            if (propNode.parent().hasClass("inputGroupElement")) {
                parentDom = propNode.parent().parent().parent();
            }
            else {
                parentDom = propNode.parent().parent();
            }
            return {
                targetDom: parentDom.children("[reference='" + childDataTarget + "']"),
                value: propNode.getValue()
            };
        }
        else {
            return null;
        }

    };

    var getJSONForArray = function (schema, dom, parentProp) {
        var arrayItems = [],
            itemProperties,
            arrayElems,
            index,
            arrayItem;

        itemProperties = jsonUtil.resolveProperty(schema.items);
        arrayElems = dom.children(".inputElem");
        for (index = 0; index < arrayElems.length; index += 1) {
            if ("oneOf" in itemProperties) {
                arrayItem = getJsonForOneOfReference(itemProperties, $(arrayElems[index]).find('[propertyidentifier*=type]').first());
            }
            else {
                arrayItem = getJSONForSubElement(
                    itemProperties,
                    $(arrayElems[index]),
                    parentProp
                    );
            }
            if (jsonValidator.isValidDataElement(arrayItem, $(arrayElems[index]))) {
                arrayItems.push(arrayItem);
            }
        }
        return arrayItems;
    };

    var getJSONForObject = function (schema, dom, parentProp) {
        var prop,
            objectProperties,
            objectProperty,
            json = {},
            objectValue,
            childDom;
        objectProperties = schema.properties;
        for (prop in objectProperties) {
            objectProperty = jsonUtil.resolveProperty(objectProperties[prop]);
            childDom = dom.find("[propertyIdentifier='" + prop + "']").first();
            if ("oneOf" in objectProperties[prop]) {
                objectValue = getJsonForOneOfReference(objectProperties[prop], childDom.find('[propertyidentifier*=type]').first());
            }
            else {
                objectValue = getJSONForSubElement(
                    objectProperty,
                    childDom,
                    prop
                );
            }
            if (jsonValidator.isValidDataElement(objectValue, childDom, objectProperties[prop]['default'])) {
                json[prop] = objectValue;
            }
        }
        return json;
    };

    var getJSONFromInPlaceObject = function (schema, domNode) {
        var json = {},
            prop,
            targetJson = jsonUtil.resolveProperty(schema, schema),
            targetDom = domNode;

        for (prop in targetJson.properties) {
            updateJsonWithProperty(json, prop, targetJson.properties, targetDom);
        }
        return json;
    };

    var getJSONForPrimitiveTypes = function (schema, property) {
        var propertyValue = property.getValue();
        if (propertyValue === undefined || propertyValue === null) {
            return propertyValue;
        }
        if (schema.type === "integer" && propertyValue.trim() !== "") {
            return parseInt(propertyValue);
        }
        else if (schema.type === "number" && propertyValue.trim() !== "") {
            return Number(propertyValue);
        }
        else {
            return propertyValue;
        }
    };

    var getJSONForSubElement = function (schema, dom, parentProp) {
        var primitiveProperty;

        if (schema.type === "array") {
            return getJSONForArray(schema, dom, parentProp);
        }
        else if (schema.type === "object") {
            return getJSONForObject(schema, dom, parentProp);
        }
        else {
            primitiveProperty = dom
                .find("*").andSelf()    //Look for match in dom(Self) and its children
                .filter("." + parentProp)   //Matching Jquery DOM object pattern
                .first()        //Only the first item in match
                    .find("*").andSelf()            //Move one more level
                    .filter(" .inputElement");      //and search for inputElement inside it


            return getJSONForPrimitiveTypes(schema, primitiveProperty);
        }
    };

    var getJsonForSelectedOneOf = function (targetJson, typeDetails) {
        var prop,
            targetDom,
            json = {};

        if (typeDetails !== null) {
            targetDom = typeDetails.targetDom;
            json["type"] = typeDetails.value;

            for (prop in targetJson.properties) {
                if (prop == "type") {
                    continue;
                }
                updateJsonWithProperty(json, prop, targetJson.properties, targetDom);
            }
        }

        return json;
    };

    var getJsonForOneOfReference = function (schema, domNode) {
        var oneOfJson,
            oneOfs,
            i,
            typeDetails,
            targetJson;

        oneOfs = schema["oneOf"];
        for (i = 0; i < oneOfs.length; i += 1) {
            targetJson = jsonUtil.resolveProperty(oneOfs[i], schema);
            typeDetails = initiateJSONFromType(targetJson, domNode);
            if (typeDetails != null) {
                //We have found the oneOf pertaining to our selection from the domNode.type
                //Hence breaking away. No need to iterate any more oneOfs
                break;
            }
        }

        oneOfJson = getJsonForSelectedOneOf(targetJson, typeDetails);

        return oneOfJson;
    };

    return {
        updateJsonWithProperty: updateJsonWithProperty,
        getJSONForArray: getJSONForArray,
        getJSONFromInPlaceObject: getJSONFromInPlaceObject,
        getJsonForOneOfReference: getJsonForOneOfReference
    };
};