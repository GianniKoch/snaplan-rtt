module.exports = {
    apps: [
        {
            name: 'frontend-web-server',
            script: 'build',
        },
        {
            name: 'backend-web-server',
            script: 'server/server.js',
        },
    ],
};