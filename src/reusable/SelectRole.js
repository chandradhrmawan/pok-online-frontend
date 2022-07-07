import React, { useContext, useEffect, useState } from "react";
import { InputSelect } from "src/components";
import SecurityContext from "src/SecurityContext";


const SelectRole = ({ onSelect, clearable, value }) => {

    const { get } = useContext(SecurityContext);
    const [options, setOptions] = useState([]);

    useEffect(() => {
        get("/api/user/roles")
            .then(response => {
                setOptions(
                    response.data.map(d => ({
                        label: d.kdsatker + " - " + d.name,
                        value: d.uid
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
            placeholder="Select Role"
        />
    </>
};

export default SelectRole;