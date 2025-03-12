import PropTypes from "prop-types";

/**
 * Reusable InputField Component
 *
 * A generic input field component with label and controlled state.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.label - The label text for the input.
 * @param {string | number} props.value - The current value of the input.
 * @param {Function} props.setValue - The function to update the state.
 * @param {string} [props.type="text"] - The type of the input (default: text).
 */
const InputField = ({ label, value, setValue, type = "text" }) => {
    return (
        <div>
            <label className="block text-gray-700 font-medium">{label}:</label>
            <input
                type={type}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
        </div>
    );
};

// **Prop Types Validation**
InputField.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    setValue: PropTypes.func.isRequired,
    type: PropTypes.string,
};

export default InputField;
