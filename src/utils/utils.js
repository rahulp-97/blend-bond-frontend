export const isPageReloaded = () => {
    const navigationTypes = window.performance.getEntriesByType('navigation');
    return !!navigationTypes?.find(nav => nav?.type === 'reload');
};

export const isEmptyObject = (obj) => {
    return obj === null || obj === undefined || Object.keys(obj).length === 0;
};