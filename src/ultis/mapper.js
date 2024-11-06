export const mapTo = (source, Type) => {
    if (Type instanceof Function) {
        let newType = new Type();
        if (source instanceof Object) {
            Object.keys(source).forEach(key => {
                newType[key] = source[key];
            })
        }
        return newType;
    }
    return null;
}
export const mapArrayTo = (source, Type) => {
    if (source instanceof Array) {
        return source.map((v, i) => mapTo(v, Type));
    }
    return null;
}