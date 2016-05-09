var ListBuilder = function () {
    var builderDefaults = new JSONUIBuilderDefaults();

    this.drawEnum = function (prop, propHtml) {
        this.drawCombobox(prop, propHtml, prop.enum);
    };

    this.drawSuggestions = function (prop, propHtml) {
        this.drawCombobox(prop, propHtml, prop.__suggestions);
        propHtml.customCombobox(
            {
                allowAdditionalItems: true
            }
        );
    };

    this.drawCombobox = function (prop, propHtml, comboboxOptions) {
        var propChild,
            propChildGroupHtml,
            propChildHtml,
            propItemIndx,
            propChildItemIndx,
            createPropChildItem = function (propChild) {
                var propChildHtml = $(builderDefaults.childElems[prop.type]),
                    propValue,
                    propText;
                if (typeof (propChild) === "string") {
                    propValue = propChild;
                    propText = propChild;
                }
                else {
                    propValue = propChild.value;
                    propText = propChild.text;
                }
                propChildHtml.attr("value", propValue);
                if (propChildHtml.attr("value") == prop.default) {
                    propChildHtml.attr("selected", "selected");
                }
                propChildHtml.text(propText);
                return propChildHtml;
            };

        propHtml.empty();

        for (propItemIndx = 0; propItemIndx < comboboxOptions.length; propItemIndx += 1) {
            propChild = comboboxOptions[propItemIndx];

            if (typeof (propChild) === "object") {
                propChildGroupHtml = $(builderDefaults.childGroupElems[prop.type]);
                propChildGroupHtml.attr("label", propChild.label);
                for (propChildItemIndx = 0;
                        propChildItemIndx < propChild.values.length;
                        propChildItemIndx += 1) {
                    propChildHtml = createPropChildItem(propChild.values[propChildItemIndx]);
                    propChildGroupHtml.append(propChildHtml);
                }
                propHtml.append(propChildGroupHtml);
            }
            else {
                propChildHtml = createPropChildItem(propChild);
                propHtml.append(propChildHtml);
            }
        }
    };

    this.drawCustomFillOptions = function (prop, propHtml, fillOption) {
        var propChild,
            propChildHtml,
            propItemIndx;

        propHtml.attr("fillOptions", ["fillOption", fillOption].join("."));

        // Check if the custom option specified in __fillOptions exists or not
        // in this object's implementation.
        if (!(fillOption in RuleSetUtil.customFillOptions)) {
            return;
        }

        this.drawCombobox(prop, propHtml, RuleSetUtil.customFillOptions[fillOption]);
    };

    return this;
};