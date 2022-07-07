import React, { useContext, useEffect, useState } from "react"
import SecurityContext from "src/SecurityContext"
import { InputSelect } from "src/components"

const SelectSatker = ({ onSelect, clearable, value, selectFirst }) => {
    const { get } = useContext(SecurityContext);
    const [options, setOptions] = useState([]);

    useEffect(() => {
        get("/api/references/satker")
            .then(response => {
                setOptions(
                    response.data.map(d => ({
                        label: d.name,
                        value: d.id
                    }))
                )
            })
    }, [get]);

    return <>
        <InputSelect
            value={value}
            onSelect={onSelect}
            options={options}
            clearable={clearable}
            selectFirst={selectFirst}
            placeholder="Select Satker"
        />
    </>
}

export default SelectSatker;