import React, { useState } from 'react';


type BurgerMenuProps = {
    content: string[];
};

const BurgerMenu: React.FC<BurgerMenuProps> = ({ content }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav>
            <ul>
                {content.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
        </nav>
    )
};


export default BurgerMenu;

