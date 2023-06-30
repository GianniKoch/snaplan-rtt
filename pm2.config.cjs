module.exports = {
    apps: [
        {
            name: 'frontend-web-server',
            script: 'build/index.js',
        },
        {
            name: 'backend-web-server',
            script: 'server/server.js',
        },
    ],
};