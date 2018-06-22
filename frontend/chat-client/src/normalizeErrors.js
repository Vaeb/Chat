export const normalizeErrors = errors =>
    errors.reduce((acc, cv) => {
        if (cv.path in acc) acc[cv.path].push(cv.message);
        else acc[cv.path] = [cv.message];
        return acc;
    }, {});

export const chooseError = (touched, errors, priority) => {
    let errorPath;

    if (priority) {
        errorPath = priority.find(path => touched[path] && errors[path]);
        if (errorPath === undefined) errorPath = priority.find(path => errors[path]);
    }

    if (errorPath !== undefined) return errors[errorPath][0];

    const allErrors = Object.values(errors);

    if (allErrors.length) return allErrors[0];

    return null;
};
