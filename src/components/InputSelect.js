import React, { useEffect } from "react"
import Select from "react-select"

const InputSelect = ({ options, onSelect, clearable, disabled, placeholder, value, selectFirst }) => {

    useEffect(() => {
        if (selectFirst && options && options[0]) {
            onSelect(options[0]);
        }
    }, [options]); // eslint-disable-line react-hooks/exhaustive-deps

    return <Select
        options={options}
        onChange={onSelect}
        isClearable={clearable}
        className={"form-control-react-select"}
        placeholder={placeholder}
        isDisabled={disabled}
        value={value}
    />
};

export default InputSelect;