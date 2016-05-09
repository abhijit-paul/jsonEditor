var JsonExtractorUtil = function () {
    var getPropertyBuildPath = function (reference) {
        var buildPath = reference.split("/").splice(1);
        return buildPath;
    };

    var resolveJsonRef = function (reference, sourceJson) {
        if (sourceJson === undefined) {
            sourceJson = this.jsonSchema;
        }
        var refJson = sourceJson,
            buildPath = getPropertyBuildPath(reference),
            buildPathIndx;


        for (buildPathIndx = 0; buildPathIndx < buildPath.length; buildPathIndx += 1) {
            refJson = refJson[buildPath[buildPathIndx]];
        }

        return refJson;
    };

    var resolveProperty = function (target, schema) {
        var targetJson;
        if ("$ref" in target) {
            ref = target["$ref"];
            targetJson = resolveJsonRef(ref, window.schema);
        }
        else {
            targetJson = target;
        }
        return targetJson;
    };

    var getProperty = function (parent, propertyId) {
        return parent.find("*").andSelf().filter("[propertyIdentifier='" + propertyId + "']")
                            .first();
    };

    return {
        resolveJsonRef: resolveJsonRef,
        resolveProperty: resolveProperty,
        getProperty: getProperty
    };
};