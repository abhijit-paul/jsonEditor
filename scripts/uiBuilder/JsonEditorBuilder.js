var JsonEditorBuilder = function () {
    this.jsonSchema = {};
    var builderDefaults = new JSONUIBuilderDefaults(),
        comboboxBuilder = new ListBuilder();

    // ----------------------------------------------------------------------
    // Private Methods
    // ----------------------------------------------------------------------

    var getPropertyBuildPath = function (reference) {
        var buildPath = reference.split("/").splice(1);
        return buildPath;
    };

    var getScriptIdentifier = function (reference) {
        return reference.replace(/[#/]/g, "_")
    };

    var appendPropertyReference = function (reference, childRef) {
        var refBuilder = [reference];
        refBuilder.push("property");
        refBuilder = refBuilder.concat(childRef);


        return refBuilder.join("/");
    };

    // ----------------------------------------------------------------------
    // Public Methods
    // ----------------------------------------------------------------------

    this.deleteJsonRef = function (reference, sourceJson) {
        if (sourceJson === undefined) {
            sourceJson = this.jsonSchema;
        }
        var refJson = sourceJson,
            buildPath = getPropertyBuildPath(reference),
            buildPathIndx;

        for (buildPathIndx = 0; buildPathIndx < buildPath.length - 1; buildPathIndx += 1) {
            refJson = refJson[buildPath[buildPathIndx]];
        }
        delete refJson[buildPath[buildPath.length - 1]];
    };

    this.resolveJsonRef = function (reference, sourceJson) {
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

    this.drawOneOf = function (prop, propHtml, buildTarget) {
        var propItemIndx,
            propGroup,
            propChild,
            propChildHtml,
            childRef,
            source;

        for (propItemIndx = 0; propItemIndx < prop.oneOf.length; propItemIndx += 1) {
            propChildHtml = $(builderDefaults.childElems[prop.type]);
            /*
             Assumption : Multiple rule elements cannot have same 
             enum property type
            */
            propGroup = $(builderDefaults.propertyGroup).clone();
            if ("$ref" in prop.oneOf[propItemIndx]) {
                childRef = prop.oneOf[propItemIndx]["$ref"];
                propChild = this.resolveJsonRef(childRef);
                source = undefined;
                propGroup.attr("id", getScriptIdentifier(childRef));
            }
            else {
                childRef = prop.oneOf[propItemIndx].properties.type.enum[0];
                propChild = prop.oneOf[propItemIndx];
                source = prop.oneOf[propItemIndx];
            }
            propGroup.attr("reference", getScriptIdentifier(childRef));
            propChildHtml.attr("value", propChild.properties.type.enum[0]);
            propChildHtml.attr("data-target", getScriptIdentifier(childRef));

            buildTarget.append(propGroup);
            propGroup.hide();
            this.build(childRef, propGroup, source);

            if (propChildHtml.attr("value") == prop.__default) {
                propChildHtml.attr("selected", "selected");
            }
            propChildHtml.html(propChild.title);
            propHtml.append(propChildHtml);
        }
    };

    this.drawPropItems = function (prop, propHtml) {
        var propItemIndx,
            propGroup,
            propChild,
            propChildHtml,
            propLabel,
            propHtmlWrapperWithDesc;

        //If property contains an external reference, propagate property to that reference
        if ("$ref" in prop.items) {
            childRef = prop.items["$ref"];
            propChild = this.resolveJsonRef(childRef);
            source = undefined;
        }
        else {
            childRef = "#";
            propChild = prop.items;
            source = prop.items;
        }

        this.build(childRef, propHtml, source);
    };

    this.drawHeader = function (prop, propHtml, propLabel) {
        var propDescHtml,
            propHtmlHeader;

        if (prop.description !== undefined) {
            propDescHtml = $(builderDefaults.inputDescriptor.tmplt);
            $(propDescHtml)
                .attr(builderDefaults.inputDescriptor.titleTmplt, prop.title)
                .attr(builderDefaults.inputDescriptor.descTmplt, prop.description);
        }

        propHtmlHeader = $(builderDefaults.wrapper.inputWrapper);

        propHtmlHeader.append(propHtml);
        propLabel.append(propDescHtml);

        return propHtmlHeader;
    };

    this.drawProp = function (prop, propName, buildTarget, isPropRequired) {
        var propLabel,
            propType,
            propHtml,
            propHtmlHeader,
            warningText;

        if (typeof prop != "object" || prop.title == "Type") {
            return;
        }

        //If property contains an external reference, propagate property to that reference
        if ("$ref" in prop) {
            prop = this.resolveJsonRef(prop["$ref"]);
        }

        if (prop.enum !== undefined) {
            prop.__control = "select";
        }
        else if (prop.oneOf !== undefined) {
            prop.__control = "select";
        }
        propType = prop.type;
        //Otherwise use property type attribute
        //But do check if the type is an array, then it means multiple options
        if (typeof prop.type == "object"
                && prop.type.length !== undefined
                && prop.type.length > 0) {
            prop.__control = "multiType";
            prop.multiType = prop.type;
        }

        //Use __control to derive input type if the input mapping is available
        if (prop.__control !== undefined && prop.__control in builderDefaults.inputTypes) {
            prop.type = prop.__control.valueOf();
        }


        propLabel = $(builderDefaults.propLabelTmplt);
        propLabel.append("<span/>");
        propLabel.find("span").text(prop.title);
        propLabel.find("span").attr("title", prop.title);

        if (isPropRequired) {
            propLabel.append($(builderDefaults.wrapper.requiredField));
        }

        if (prop.type === "array") {
            propLabel.append($(builderDefaults.arrayAppender));
            unorderedList = $(builderDefaults.wrapper.arrayGroupWrapper);
        }
        else if (prop.type === 'object' && prop.oneOf === undefined) {
            propLabel.append($(builderDefaults.objectToggler));
            unorderedList = $(builderDefaults.wrapper.objectGroupWrapper);
        }
        if (prop.type === 'array' || (prop.type === 'object' && prop.oneOf === undefined)) {
            listItem = $(builderDefaults.wrapper.arrayObjectWrapper);
            listItem.attr("propertyIdentifier", propName);

            unorderedList.append(listItem);
            buildTarget.append(unorderedList);
            buildTarget = listItem;

            buildTarget.append($(builderDefaults.wrapper.labelInArray).html(propLabel));
        }
        else {
            buildTarget.append($(builderDefaults.wrapper.label).html(propLabel));
        }

        if (prop.properties !== undefined) {
            propHtml = $(builderDefaults.inputTypes['objectElement']);
        }
        else {
            propHtml = $(builderDefaults.inputTypes[prop.type]);
        }

        if (prop.default !== undefined) {
            propHtml.attr('default-value', prop.default);
        }
        else if (prop.__default !== undefined) {
            propHtml.attr('default-value', prop.__default);
        }

        if (prop.minimum !== undefined && typeof (prop.minimum) === "number") {
            propHtml.attr('min', prop.minimum);
        }

        if (prop.maximum !== undefined && typeof (prop.maximum) === "number") {
            propHtml.attr('max', prop.maximum);
        }

        if ("oneOf" in prop) {
            if (propName !== undefined && propName !== "") {
                propName = propName + ".type";
            }
            else {
                propName = "type";
            }
        }
        propHtml.attr("propertyIdentifier", propName);
        propHtml.addClass(propName);
        if (propName == "" && !buildTarget.hasClass('arrayElement')) {
            propHtml.attr("propertyIdentifier", "type");
            propHtml.addClass('type');
        }

        if (prop.__control != undefined) {
            propHtml.attr(builderDefaults.attribMap[prop.type], prop.__control);
        }

        propHtmlHeader = this.drawHeader(prop, propHtml, propLabel);

        if (propLabel.children().length === 1 && prop.title === undefined) {
            propLabel.remove();
        }

        if (prop.type === 'array' || (prop.type === 'object' && prop.oneOf === undefined)) {
            buildTarget.append($(builderDefaults.wrapper.inputInArray).html(propHtmlHeader));
        }
        else {
            buildTarget.append($(builderDefaults.wrapper.input).html(propHtmlHeader));
        }

        if (prop.type === "array") {
            propHtmlHeader.prepend($(builderDefaults.wrapper.arrayRemovalWrapper));
        }

        if (prop.oneOf !== undefined) {
            this.drawOneOf(prop, propHtml, buildTarget);
        }
        else if (prop.enum !== undefined) {
            comboboxBuilder.drawEnum(prop, propHtml);
        }
        else if (prop.__suggestions !== undefined) {
            comboboxBuilder.drawSuggestions(prop, propHtml);
        }
        else if (prop.__fillOptions !== undefined) {
            // __fillOptions is used as a metadata tag to input the JS function
            // name that should be called to fill-in the options in the associated 
            // combo box. The input function name string is called as function.

            comboboxBuilder.drawCustomFillOptions(prop, propHtml, prop.__fillOptions);
        }

        else if (prop.properties !== undefined) {
            prop.items = {
                "properties": prop.properties,
                "type": "object",
                "__propertiesDisplayOrder": prop.__propertiesDisplayOrder,
                "required": prop.required
            };
        }

        if (prop.__warningCheck !== undefined &&
                prop.__warningMessage !== undefined) {
            warningText = $(builderDefaults.inputWarningLabel);
            warningText.text(prop.__warningMessage);
            warningText.hide();
            propHtml.after(warningText);
            $(propHtml).on("change", function () {
                if ($(this).getValue() !== null &&
                        $(this).getValue() !== undefined &&
                        $(this).getValue() !== "" &&
                        window.currentElement !== undefined) {
                    var errorWarningUtil = new ErrorWarningUtil(),
                        validation =
                    errorWarningUtil[prop.__warningCheck]($(this).getValue(), window.currentElement);
                    if (validation !== undefined && validation == true) {
                        $(this).next(".warn").hide();
                    }
                    else {
                        $(this).next(".warn").show();
                    }
                }
            });
        }

        if (prop.items !== undefined) {
            this.drawPropItems(prop, propHtml);
        }

        if (prop.multiType !== undefined) {
            $(propHtml).otherSelector("", "string");
        }
    };

    this.build = function (reference, buildTarget, source) {
        var ruleDef = this.resolveJsonRef(reference, source),
            propIndx,
            prop,
            requiredPropsMentioned,
            isReqProp;

        requiredPropsMentioned = ruleDef.required !== undefined &&
            typeof ruleDef.required === "object" &&
            ruleDef.required.length > 0;

        if (ruleDef.__propertiesDisplayOrder === undefined && ruleDef.properties !== undefined) {
            //If no propertiesDisplayOrder, show all properties apart from "type"
            //  "type" is a special property used for linking oneOfs
            var allKeys = Object.keys(ruleDef.properties);
            if (allKeys.indexOf("type") >= 0) {
                allKeys.splice(allKeys.indexOf("type"), 1);
            }
            ruleDef['__propertiesDisplayOrder'] = allKeys;
        }
        if (ruleDef.__propertiesDisplayOrder === undefined && ruleDef.properties === undefined) {
            this.drawProp(ruleDef, "", buildTarget);
        }
        else {
            for (propIndx = 0; propIndx < ruleDef.__propertiesDisplayOrder.length; propIndx += 1) {
                prop = ruleDef.properties[ruleDef.__propertiesDisplayOrder[propIndx]];
                isReqProp = requiredPropsMentioned && ruleDef.required.indexOf(ruleDef.__propertiesDisplayOrder[propIndx]) >= 0;
                this.drawProp(prop, ruleDef.__propertiesDisplayOrder[propIndx], buildTarget, isReqProp);
            }
        }
    };

    return this;
};