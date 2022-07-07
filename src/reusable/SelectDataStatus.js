import React, { useContext, useEffect, useState } from "react"
import SecurityContext from "src/SecurityContext"
import { InputSelect } from "src/components"

const SelectDataStatus = ({ onSelect, clearable, revisionId, exclude, selectFirst, disabled }) => {
    const { get } = useContext(SecurityContext);
    const [options, setOptions] = useState([]);

    useEffect(() => {
        if (revisionId) {
            get("/api/pok/available-status?revisionId=" + revisionId)
                .then(response => {
                    setOptions(
                        response.data
                        .filter(d => {
                            if (exclude !== undefined || exclude !== null) {
                                return exclude !== d;
                            }

                            return true;
                        })
                        .sort()
                        .map(d => ({
                            label: d,
                            value: d
                        }))
                    );
                })
        }
    }, [get, revisionId, exclude]);

    return <>
        <InputSelect
            disabled={disabled}
            onSelect={onSelect}
            options={options}
            clearable={clearable}
            selectFirst={selectFirst}
        />
    </>
}

export default SelectDataStatus;