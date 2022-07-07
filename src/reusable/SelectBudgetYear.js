import React, { useState, useEffect } from 'react'
import { InputSelect } from "src/components"

const seedYear = [];
const currentYear = new Date().getFullYear();
let currentYearOption = null;
for (let index = 2020; index < currentYear + 10; index++) {
    seedYear.push({ label: index, value: index });
    if (index === currentYear) {
        currentYearOption = { label: index, value: index };
    }
}

const SelectBudgetYear = ({ clearable, onSelect, selectFirst, value, placeholder }) => {
    const [options] = useState([...seedYear]);
    useEffect(() => {
        if (selectFirst && options) {
            onSelect(currentYearOption);
        }
    }, [options]); // eslint-disable-line react-hooks/exhaustive-deps
    return <InputSelect clearable={clearable} onSelect={onSelect} options={options} value={value} placeholder={placeholder}/>
};

export default SelectBudgetYear;