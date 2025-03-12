import PropTypes from "prop-types"; // Import PropTypes for type validation

/**
 * MessageBox Component
 * 
 * A reusable and customizable message box (modal) that displays error, warning, 
 * info, or success messages. It overlays on the screen and can be closed by the user.
 * 
 * @component
 * @param {boolean} isOpen - Controls whether the message box is visible.
 * @param {function} onClose - Callback function triggered when the close button is clicked.
 * @param {string} message - The main message to be displayed inside the modal.
 * @param {string} [type="error"] - The type of message ('error', 'warning', 'info', 'success').
 * @param {string} [title] - Custom title for the message box. Defaults to type-based title.
 * @returns {JSX.Element|null} - The message box component or `null` if `isOpen` is false.
 */
const MessageBox = ({ isOpen, onClose, message, type = "error", title }) => {
    // If the modal is not open, do not render anything
    if (!isOpen) return null;

    // Define styling and icons for different message types
    const typeStyles = {
        error: { bg: "bg-red-500", icon: "⚠️", defaultTitle: "Error" },
        warning: { bg: "bg-yellow-500", icon: "⚠️", defaultTitle: "Warning" },
        info: { bg: "bg-blue-500", icon: "ℹ️", defaultTitle: "Information" },
        success: { bg: "bg-green-500", icon: "✅", defaultTitle: "Success" },
    };

    // Get styling properties for the selected message type, or fallback to "error" styles
    const { bg, icon, defaultTitle } = typeStyles[type] || typeStyles.error;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full relative">
                {/* Header: Displays the title with the appropriate background color */}
                <div className={`flex items-center ${bg} text-white px-4 py-2 rounded-t-lg`}>
                    <span className="text-lg font-semibold">{title || defaultTitle}</span>
                </div>

                {/* Body: Displays the message with an icon */}
                <div className="p-4 text-gray-800 flex items-start space-x-2">
                    <span className="text-xl">{icon}</span>
                    <p className="flex-1">{message}</p>
                </div>

                {/* Footer: Close button */}
                <div className="flex justify-end mt-4">
                    <button
                        onClick={onClose}
                        className="bg-gray-500 hover:bg-gray-600 text-white py-1.5 px-4 rounded-md transition-all duration-200"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

// PropTypes for type checking and validation
MessageBox.propTypes = {
    isOpen: PropTypes.bool.isRequired, // Controls the visibility of the modal
    onClose: PropTypes.func.isRequired, // Callback function to close the modal
    message: PropTypes.string.isRequired, // The message displayed inside the modal
    type: PropTypes.oneOf(["error", "warning", "info", "success"]), // Message type (default: "error")
    title: PropTypes.string, // Optional custom title
};

// Default props in case some props are not provided
MessageBox.defaultProps = {
    type: "error", // Default message type
    title: "", // Default to empty title (falls back to default title per type)
};

export default MessageBox;
