import CIcon from "@coreui/icons-react";
import {
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
} from "@coreui/react";
import React from "react";
import Select from "react-select";

const InputGroup = function ({
  type,
  className,
  placeholder,
  autoComplete,
  iconName,
  prependText,
  options,
  onChange,
}) {

    const handleOnchange = (e) => {
        if (onChange) {
            if (type === 'select') {
                onChange(e.value)
            } else {
                onChange(e.target.value)
            }
        }
    }

  return (
    <CInputGroup className={className}>
      <CInputGroupPrepend>
        <CInputGroupText>
          {iconName ? <CIcon name={iconName} /> : prependText}
        </CInputGroupText>
      </CInputGroupPrepend>
      {type === "select" ? (
        <Select
          onChange={handleOnchange}
          options={options}
          placeholder={placeholder}
          isClearable
          className="form-control-react-select"
        />
      ) : (
        <CInput
          onChange={handleOnchange}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
        />
      )}
    </CInputGroup>
  );
};

export default InputGroup;
