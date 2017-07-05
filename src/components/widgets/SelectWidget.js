import React, {PropTypes} from "react";

import {asNumber} from "../../utils";

/**
 * This is a silly limitation in the DOM where option change event values are
 * always retrieved as strings.
 */
function processValue({type, items}, value) {
  if (value === "") {
    return undefined;
  } else if (type === "array" && items && ["number", "integer"].includes(items.type)) {
    return value.map(asNumber);
  } else if (type === "boolean") {
    return value === "true";
  } else if (type === "number") {
    return asNumber(value);
  }
  console.log("test", value);
  return value;
}

function getValue(event, multiple) {
  if (multiple) {
    return [].slice.call(event.target.options)
      .filter(o => o.selected)
      .map(o => o.value);
  } else {
    var selectTag = event.target;
    return selectTag[selectTag.selectedIndex];
  }
}

function SelectWidget({
  schema,
  id,
  options,
  value,
  required,
  disabled,
  readonly,
  multiple,
  autofocus,
  onChange,
  onBlur,
  placeholder
}) {
  const {enumOptions} = options;
  const emptyValue = multiple ? [] : "";
  console.log("enumOptions",enumOptions);
  return (
    <select
      id={id}
      multiple={multiple}
      className="form-control"
      value={typeof value === "undefined" ? emptyValue : value}
      required={required}
      disabled={disabled}
      readOnly={readonly}
      autoFocus={autofocus}
      onBlur={onBlur && (event => {
        const newValue = getValue(event, multiple);
        onBlur(id, processValue(schema, newValue));
      })}
      onChange={(event) => {
        console.log("event.target", event.target.selectedIndex);
        console.log("event.target.value", event.target.value);
        const newValue = getValue(event, multiple);
        console.log("newValue", newValue.innerHTML);
        onChange(newValue.innerHTML);
      }}>
      {!multiple && !schema.default && <option value="">{placeholder}</option>}
      {enumOptions.map(({value, label}, i) => {
        return <option key={i} value={value} data-label={label}>{label}</option>;  //changed (value={value})
      })}
    </select>
  );
}

SelectWidget.defaultProps = {
  autofocus: false,
};

if (process.env.NODE_ENV !== "production") {
  SelectWidget.propTypes = {
    schema: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    options: PropTypes.shape({
      enumOptions: PropTypes.array,
    }).isRequired,
    value: PropTypes.any,
    required: PropTypes.bool,
    multiple: PropTypes.bool,
    autofocus: PropTypes.bool,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
  };
}

export default SelectWidget;
