import React from 'react';
import { BsArrowRepeat } from 'react-icons/bs';
const ButtonComponent = ({ handleClick }) => {
    return (
        <button onClick={handleClick}>
            <MdSkipNext />
        </button>
    );
}

export default ButtonComponent;