var JsonExtractInitiator = function () {
    var jsonUtil = new JsonExtractorUtil(),
        jsonExtractor = new JsonExtractor();


    var initiateJSONExtraction = function (schema, domNode) {
        var json = {}, oneOfs, childJson;

        $(".requiredInputMissing").removeClass("requiredInputMissing");

        window.schema = schema.schema;
        if (schema.navigationRef !== undefined) {
            schema = jsonUtil.resolveJsonRef(schema.navigationRef, schema.schema);
        }
        else {
            schema = schema.schema;
        }

        if (schema.type === "object" || schema.type == "select") {
            if ("oneOf" in schema) {
                json = jsonExtractor.getJsonForOneOfReference(schema, domNode);
            }
            else {
                json = jsonExtractor.getJSONFromInPlaceObject(schema, domNode);
            }
        }

        return json;
    };

    return {
        initiateJSONExtraction: initiateJSONExtraction
    };
};