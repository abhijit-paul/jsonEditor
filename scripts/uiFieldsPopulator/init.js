var UIFieldsPopulator = function () {
    var jsonEditorFieldsPopulator = new JsonEditorFieldsPopulator(),
        inputFieldsInitiator = new InputElementInitiator();

    this.initializeInputFieldValues = function () {
        inputFieldsInitiator.initiateInputElements();
    };

    this.initiateFieldsPopulationWithJson = function (jsonData, domElementToPopulate) {
        jsonEditorFieldsPopulator.populateUIFieldsWithJSON(jsonData, domElementToPopulate);
    };

    return this;
};