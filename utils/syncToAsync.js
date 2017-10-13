module.exports = fn => {
    return (...args) => {
        return new Promise(resolve => {
            process.nextTick(() => {
                resolve(fn.apply(this, args))
            })
        });
    }
}