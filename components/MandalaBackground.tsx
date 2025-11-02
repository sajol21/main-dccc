import React from 'react';

const MandalaBackground: React.FC = () => {
    return (
        <div className="absolute inset-0 z-0 opacity-10">
            <svg 
                className="w-full h-full animate-spin"
                viewBox="0 0 200 200"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <path 
                        id="petal" 
                        d="M 100 10 C 110 40, 110 70, 100 90 C 90 70, 90 40, 100 10 Z" 
                        fill="#1E40AF" 
                    />
                    <path 
                        id="arc" 
                        d="M 60 60 A 40 40 0 0 1 140 60"
                        stroke="#1E40AF"
                        strokeWidth="2"
                        fill="none"
                    />
                </defs>
                
                {/* Central element */}
                <circle cx="100" cy="100" r="10" fill="#F59E0B"/>

                {/* Petals */}
                {[...Array(12)].map((_, i) => (
                    <use 
                        key={`petal-${i}`} 
                        href="#petal" 
                        transform={`rotate(${i * 30} 100 100)`} 
                    />
                ))}

                {/* Arcs */}
                 {[...Array(6)].map((_, i) => (
                    <use 
                        key={`arc-${i}`} 
                        href="#arc" 
                        transform={`rotate(${i * 60} 100 100)`} 
                    />
                ))}

                 {/* Outer Circles */}
                 <circle cx="100" cy="100" r="95" stroke="#1E40AF" strokeWidth="1" fill="none" strokeDasharray="5 5"/>
                 <circle cx="100" cy="100" r="70" stroke="#F59E0B" strokeWidth="0.5" fill="none" />

            </svg>
        </div>
    );
};

export default MandalaBackground;