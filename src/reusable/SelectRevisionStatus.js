import React, { useContext, useEffect, useState } from "react"
import SecurityContext from "src/SecurityContext"
import { InputSelect } from "src/components"

const SelectRevisionStatus = ({ onSelect, clearable, value }) => {
    const { get } = useContext(SecurityContext);
    const [options, setOptions] = useState([]);

    useEffect(() => {
        get("/api/references/statuses")
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
            onSelect={onSelect}
            options={options}
            clearable={clearable}
            value={value}
        />
    </>
}

export default SelectRevisionStatus;