import { LOCATIONS_LIST } from "consts/services/locations";
import Flag from "react-world-flags";

interface Location {
    name: string;
    flag: string;
    code: string;
}

/**
 * Formats a location string with flag emoji and city name.
 * @param cityName The name of the city to format.
 * @returns Formatted string like "🇬🇧 Newcastle" or the original city name if not found.
 */
export const formatLocation = (cityName: string): string => {
    if (!cityName) return "Unknown Location";

    const location = LOCATIONS_LIST.find(
        (loc) => loc.name.toLowerCase() === cityName.trim().toLowerCase()
    );

    if (!location) return cityName;

    return `${location.name}`;
};

/**
 * Returns a flag component for the given city name.
 * @param cityName The name of the city.
 * @returns A JSX element containing the flag image or null if not found.
 */
export const getLocationFlag = (cityName: string): JSX.Element | null => {
    if (!cityName) return null;

    const location = LOCATIONS_LIST.find(
        (loc) => loc.name.toLowerCase() === cityName.trim().toLowerCase()
    );

    if (!location) return null;

    return <Flag
        code={location.flag.toUpperCase()}
        style={{ width: "2em", marginRight: "0.2em" }}
    />;
};
