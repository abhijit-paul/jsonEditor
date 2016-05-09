(function JsonEditorBtnController() {
    var inputFieldsPostEventView = new InputFieldsPostEventView(),
        inputCustomizers = new InputCustomizers(),
        inputElementInitiator = new InputElementInitiator();

    (function init() {
        (function ArrayElementControllers() {
            (function RemoveArrayElement() {
                $(document).delegate('.removeArrayElement', 'click', function () {
                    var arrayElement = $(this).parent().parent(),
                        indexOfElement = arrayElement.index();
                    if (indexOfElement == 1 && arrayElement.parent().children().length == 2) {
                        inputElementInitiator.initiateInputElementsWithDefaults(arrayElement);
                        arrayElement.hide();
                    }
                    else {
                        arrayElement.remove();
                    }
                });
            })();

            (function AddArrayElement() {
                $(document).delegate('.addArrayItem', 'click', function () {
                    var itemToClone = $(this).parent().parent().next(),
                        clonedItem,
                        inputElementsInClonedItem,
                        itemIndx,
                        inputElement;

                    if (itemToClone.is(":hidden")) {
                        clonedItem = itemToClone;
                        clonedItem.show();
                    }
                    else {
                        clonedItem = Common.util.cloneItem(
                            $(this).parent().parent().next(),
                            $(this).parent().parent().siblings().last());
						clonedItem = $(clonedItem);
                    }
                    clonedItem.find(".combobox").trigger("change");
                    inputElementInitiator.initiateInputElementsWithDefaults(clonedItem);

                    inputCustomizers.showInputSuggestions();
                    inputCustomizers.showInputDescriptions();
                    inputCustomizers.showSourceCodeEditors();
                });
            })();
        })();

        (function ToggleObjectElementVisibility() {
            $(document).delegate('.showHideObjectItem', 'click', function () {
                var itemToShowHide = $(this).parent().parent().next();
                if (itemToShowHide.is(":hidden")) {
                    itemToShowHide.find(".combobox").trigger("change");
                    itemToShowHide.show();
                    itemToShowHide.find('*').show();
                    itemToShowHide.find('*').promise().done(
                        function () {
                            inputCustomizers.showSourceCodeEditors(itemToShowHide);
                            itemToShowHide.find(".stayHidden").hide();
                        }
                    );
                }
                else {
                    itemToShowHide.hide();
                }
            });
        })();

        (function ShowSelectedSubSection() {
            $(document).delegate('.combobox', 'change', function () {

                var contentId = $(this).find("option:selected").attr('data-target'),
                    parentGroup;

                if ($(this).parent().hasClass("inputGroupElement")) {
                    parentGroup = $(this).parent().parent().parent();
                }
                else {
                    parentGroup = $(this).parent().parent();
                }

                //Extract reference from selected option
                contentId = $(parentGroup
                        .children("[reference='" + contentId + "']")
                        );
                if (contentId.length > 0) {
                    //Referred content ID found in DOM:
                    inputFieldsPostEventView.showSectionFromReference(
                        parentGroup,
                        contentId
                        );
                }
            });

            $('.combobox').trigger('change');
        })();
    })();
})();
