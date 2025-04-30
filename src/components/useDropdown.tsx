import {useState, useRef, useEffect} from "react";

/**
 * A custom hook for managing dropdown state and click-outside behavior
 * @param initialState The initial open/closed state of the dropdown
 * @returns An object containing the current state, state setter, and ref to attach to the dropdown container
 */

export const useDropdown = (initialState: boolean = false) => {
    const [isOpen, setIsOpen] = useState(initialState);
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return {isOpen, setIsOpen, ref};
};