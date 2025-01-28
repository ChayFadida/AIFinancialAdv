import React from 'react';
import { TypeAnimation } from 'react-type-animation';

interface TypewriterProps {
    text: string;
    speed?: number;
}

export const Typewriter: React.FC<TypewriterProps> = ({ text, speed = 50 }) => {
    return (
        <TypeAnimation
            sequence={[text]}
            speed={speed}
            cursor={false}
            style={{ whiteSpace: 'pre-wrap', display: 'inline-block' }}
        />
    );
};