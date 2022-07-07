import React, { useContext, useEffect, useState } from "react"
import SecurityContext from "src/SecurityContext"
import { InputSelect } from "src/components"

const SelectOfficer = ({ onSelect, clearable, value, category, selectFirst }) => {
    const { get } = useContext(SecurityContext);
    const [options, setOptions] = useState([]);

    useEffect(() => {
        get("/api/references/pejabat?type=" + category )
            .then(response => {
                setOptions(
                    response.data.map(d => ({
                        label: d.name,
                        value: d.id
                    }))
                )
            })
    }, [get, category]);

    return <>
        <InputSelect
            value={value}
            onSelect={onSelect}
            options={options}
            clearable={clearable}
            selectFirst={selectFirst}
        />
    </>
}

export default SelectOfficer;