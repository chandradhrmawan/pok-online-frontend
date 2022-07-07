import React, { useContext, useEffect, useState } from "react";
import { InputSelect } from "src/components";
import SecurityContext from "src/SecurityContext";


const SelectPermission = ({ onSelect, clearable, value }) => {

    const { get } = useContext(SecurityContext);
    const [options, setOptions] = useState([]);

    useEffect(() => {
        get("/api/user/permissions")
            .then(response => {
                setOptions(
                    response.data.map(d => ({
                        label: d.permission,
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
            placeholder="Select Permission"
        />
    </>
};

export default SelectPermission;