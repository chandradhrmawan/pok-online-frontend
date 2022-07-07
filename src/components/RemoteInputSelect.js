import { useContext, useEffect, useState } from "react"
import SecurityContext from "src/SecurityContext"
import InputSelect from "./InputSelect"

const RemoteInputSelect = ({ entity, field, onSelect, clearable, value, placeholder }) => {
    const { get } = useContext(SecurityContext);
    const [options, setOptions] = useState([]);

    useEffect(() => {
        get(`/api/dbz/fetch?entity=${entity}&field=${field}`)
            .then(response => {
                setOptions(
                    response.data.map(d => ({
                        label: d.name,
                        value: d.uid
                    }))
                )
            })
    }, [get, entity, field]);

    return <>
        <InputSelect
            value={value}
            onSelect={onSelect}
            options={options}
            clearable={clearable}
            placeholder={placeholder}
        />
    </>
}

export default RemoteInputSelect;