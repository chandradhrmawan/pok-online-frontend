import React from 'react'
import { InputSelect } from "src/components"

const seedStatus = [];
for (let index = 0; index < 20; index++) {
    if (index === 0) {
        seedStatus.push({ label: "Original", value: index });
    } else {
        seedStatus.push({ label: "Revisi " + index, value: index });
    }
}
const SelectRevisionType = ({ clearable, onSelect, value }) => {

    return <InputSelect clearable={clearable} onSelect={onSelect} options={seedStatus} value={value} />

};

export default SelectRevisionType;