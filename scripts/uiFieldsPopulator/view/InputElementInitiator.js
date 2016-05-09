var InputElementInitiator = function () {
    var extractSelectedElements = function (rootElement, selector) {
        var selectedElements;
        if (rootElement !== undefined) {
            selectedElements = rootElement
                .find(selector)
                .addBack(selector);
        }
        else {
            selectedElements = $(selector);
        }
        return selectedElements;
    };

    this.initiateInputElements = function (elements) {
        var inputElements = extractSelectedElements(elements, selector='.inputElement'),
            inputElement,
            itemIndx;

        for (itemIndx = 0 ;
                itemIndx < inputElements.length;
                    itemIndx += 1) {
            inputElement = $(inputElements[itemIndx]);
            if (inputElement.is(".combobox")) {
                inputElement.setValue(inputElement.find("option").first().attr("value"));
                inputElement.trigger("change");
            }
            else {
                inputElement.setValue("");
            }
        }
        return inputElements;
    };

    this.reinitiateInputItems = function (rootElement) {
        //Clear cloned element
        //Set default values in cloned element

        $(rootElement).find(".inputElement:not('.combobox')").setValue("");
        $(rootElement).find(".inputElement[default-value]").each(function () {
            var defaultValue = $(this).attr('default-value');
            $(this).setValue(defaultValue);
            $(this).trigger("change");
        });
    };

    this.setDefaultValues = function (rootElem) {
        var elementsWithDefaults = extractSelectedElements(rootElem, selector="[default-value]");

        elementsWithDefaults.each(function () {
            var defaultValue = $(this).attr('default-value');
            if (defaultValue !== undefined) {
                $(this).setValue(defaultValue);
            }
        });
        return elementsWithDefaults;
    };

    this.initiateInputElementsWithDefaults = function (rootElement) {
        var inputElements = this.initiateInputElements(
                    rootElement
                );
        this.setDefaultValues(inputElements);
    };

    return this;

};