import React from 'react'
import { InputSelect } from "src/components"

const SelectApprovalStatus = ({ clearable, onSelect, value }) => {

    const options = [{ label: "Approved", value: "Approved" }, { label: "Pending", value: "New" }];
    return <InputSelect clearable={clearable} onSelect={onSelect} options={options} value={value} />

};

export default SelectApprovalStatus;