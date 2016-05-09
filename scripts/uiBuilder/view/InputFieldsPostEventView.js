var InputFieldsPostEventView = function () {
    var inputCustomizers = new InputCustomizers();

    this.showSectionFromReference = function (parentGroup, contentId) {
        parentGroup.find('.propertyGroup').hide();
        
        //Show reference content
        contentId.show();

        //Show children of reference content
        contentId.find(':hidden').show();
        contentId.find(':hidden').promise().done(
            function () {
                //TODO: Pass this as a callback

                //Once children are shown, hide the custom stay hidden elements
                contentId.find(".stayHidden").hide();
                //Show source code editors under the children of reference
                inputCustomizers.showSourceCodeEditors(contentId);
            }
        );

        contentId.find('.combobox').trigger('change');
    };
    return this;
};