import React from 'react'
import { InputSelect } from "src/components"

const SelectSemester = ({ clearable, onSelect, placeholder, value }) => {

    const options = [{ label: "Awal", value: 0 }, { label: "Revisi 1", value: 1 }, { label: "Revisi 2", value: 2 }];
    return <InputSelect clearable={clearable} onSelect={onSelect} options={options} placeholder={placeholder} value={value} />

};

export default SelectSemester;