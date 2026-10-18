import React, { useState, useRef } from 'react';
import './StarRating.css';

const StarRating = () => {
    const [currentRating, setCurrentRating] = useState(0); // 1-10
    const [hoverRating, setHoverRating] = useState(0); // 1-10
    const [isHovering, setIsHovering] = useState(false);

    const rangeRef = useRef(null);
    const starWidth = 19.5; // Each half-star is 13px (scaled by 1.5 -> 19.5px)
    const maxRating = 10;

    const handleMouseMove = (e) => {
        if (!rangeRef.current) return;
        const rect = rangeRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;

        let hoverVal = Math.ceil(x / starWidth);
        if (hoverVal > maxRating) hoverVal = maxRating;
        if (hoverVal < 1) hoverVal = 1;

        setHoverRating(hoverVal);
        setIsHovering(true);
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
        setHoverRating(0);
    };

    const handleClick = (e) => {
        if (!rangeRef.current) return;
        const rect = rangeRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;

        let newRating = Math.ceil(x / starWidth);
        if (newRating > maxRating) newRating = maxRating;
        if (newRating < 1) newRating = 1;

        setCurrentRating(newRating);
    };

    const handleReset = (e) => {
        e.stopPropagation();
        setCurrentRating(0);
        setIsHovering(false);
    };

    const displayRating = isHovering && hoverRating > 0 ? hoverRating : currentRating;

    return (
        <div className="py-2.5 border-b border-[#2c3440] flex flex-col items-center">
            <span className="text-[12px] text-[#99aabb] mb-1.5 font-normal">
                Rate
            </span>
            <div className="rateit">
                <button
                    className="rateit-reset"
                    aria-label="reset rating"
                    onClick={handleReset}
                ></button>
                <div
                    ref={rangeRef}
                    className="rateit-range"
                    tabIndex="0"
                    role="slider"
                    aria-label="rating"
                    aria-valuemin="0"
                    aria-valuemax="10"
                    aria-valuenow={currentRating}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    onClick={handleClick}
                >
                    <div
                        className="rateit-selected"
                        style={{ width: `${currentRating * starWidth}px`, display: isHovering ? 'none' : 'block' }}
                    ></div>
                    <div
                        className="rateit-hover"
                        style={{ width: `${hoverRating * starWidth}px`, display: isHovering ? 'block' : 'none' }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default StarRating;
