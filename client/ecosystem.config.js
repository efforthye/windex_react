module.exports = {
    apps: [
        {
            name: 'windex-client',
            cwd: '/var/www/client',
            script: 'node_modules/next/dist/bin/next',
            args: 'start',
            watch: '.',
        },
    ],
};
