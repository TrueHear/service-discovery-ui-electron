import PropTypes from "prop-types";
import "./LoadingIndicator.css";

/**
 * NotificationIndicator
 * A React component that displays a circular loader with a customizable title and invokes a callback when the button is clicked.
 *
 * @param {Object} props - React props
 * @param {string} props.title - The title text to display below the loader.
 * @param {boolean} props.show - The flag to show the notification button.
 * @param {Function} props.onAction - The callback function to invoke when the button is clicked.
 * @param {string} props.buttonLabel - The label or tag for the notification button.
 * @returns {JSX.Element} A styled notification indicator with a title.
 */
const NotificationIndicator = ({ title = 'Loading...', show = false, onAction, buttonLabel = 'Notify' }) => {
    
    const handleAction = () => {
        if (typeof onAction === "function") {
            onAction(title);
        }
    };

    return (
        <div className="flex flex-col gap-y-4">
            <div className="loading-container">
                <div className="loader"></div>
                <div className="loading-text">{title}</div>
            </div>
            {show && (
                <div className="flex justify-center">
                    <button
                        className="flex justify-center items-center gap-3 md:gap-4 px-4 md:px-6 py-2 md:py-4 text-lg md:text-2xl font-semibold rounded-xl transition-all duration-200 max-md:w-full hover:bg-blue-800 bg-blue-400 text-white min-w-[150px]"
                        onClick={handleAction}
                    >
                        {buttonLabel}
                    </button>
                </div>
            )}
        </div>
    );
};

NotificationIndicator.propTypes = {
    /**
     * The title text to display below the loader.
     */
    title: PropTypes.string,
    /**
     * A flag to show or hide the notification button.
     */
    show: PropTypes.bool,
    /**
     * The callback function to invoke when the button is clicked.
     */
    onAction: PropTypes.func,
    /**
     * The label or tag for the notification button.
     */
    buttonLabel: PropTypes.string,
};

export default NotificationIndicator;