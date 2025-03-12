const isElectron = () => typeof window !== 'undefined' && window.electron !== undefined && window.electron !== 'undefined' && window.electron !== null;
export default isElectron;
