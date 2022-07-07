import React, { useContext, useEffect, useState } from "react";
import { InputSelect } from "src/components";
import SecurityContext from "src/SecurityContext";


const SelectUserRole = ({ onSelect, clearable, value, type }) => {

    const { get } = useContext(SecurityContext);
    const [options, setOptions] = useState([]);

    useEffect(() => {
        get("/api/user/list?type=" + type)
            .then(response => {
                setOptions(
                    response.data.map(d => ({
                        label: d.name,
                        value: d.id
                    }))
                )
            })
    }, [get, type]);

    return <>
        <InputSelect
            value={value}
            onSelect={onSelect}
            options={options}
            clearable={clearable}
            placeholder="Select User"
        />
    </>
};

export default SelectUserRole;