module.exports = function (env) {
    if (!env && process.env) env = process.env.NODE_ENV;
    return require(`./webpack.${env}.js`);
}