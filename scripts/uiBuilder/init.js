var JsonUIBuilderInitiator = function () {
    var jsonEditorBuilder = new JsonEditorBuilder();

    this.init = function (jsonElement, jsonContainer) {
        if (jsonElement.ignore !== undefined) {
            jsonEditorBuilder.deleteJsonRef(jsonElement.ignore, jsonElement.schema);
        }
		if(jsonElement.schema===undefined && 
				jsonElement.navigationRef===undefined) {
			jsonEditorBuilder.jsonSchema = jsonElement;
			jsonElement.navigationRef = "#";
		}
		else if(jsonElement.schema !== undefined)	{
			jsonEditorBuilder.jsonSchema = jsonElement.schema;
			jsonElement.navigationRef = "#";
		}
        jsonEditorBuilder.build(
            reference = jsonElement.navigationRef,
            buildTarget = jsonContainer
            );
    };
};

