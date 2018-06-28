import React from 'react';
import { Dropdown } from 'semantic-ui-react';

const MultiSelectRoles = ({ allRoles, value, handleChange, placeholder }) => (
    <React.Fragment>
        <Dropdown
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            fluid
            multiple
            search
            selection
            options={Object.values(allRoles).map(r => ({ key: r.id, value: r.id, text: r.name }))}
        />
    </React.Fragment>
);

export default MultiSelectRoles;
