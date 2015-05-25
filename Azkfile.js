/**
 * Documentation: http://docs.azk.io/Azkfile.js
 */

// Adds the systems that shape your system
systems({
  wordpress: {
    // Dependent systems
    depends: ['mysql'],
    // More images:  http://images.azk.io
    image: {"docker": "azukiapp/php-fpm"},
    workdir: "/azk/#{manifest.dir}",
    shell: "/bin/bash",
    wait: {"retry": 20, "timeout": 1000},
    mounts: {
      '/azk/#{manifest.dir}': path("."),
    },
    scalable: {"default": 1},
    http: {
      domains: [ "#{system.name}.#{azk.default_domain}" ]
    },
    ports: {
      // exports global variables
      http: "80/tcp",
    },
    envs: {
      // set instances variables
      APP_DIR: "/azk/#{manifest.dir}",
    },
    docker_extra: {
      // extra docker options
      start: {
        Privileged: "true",
      },
    },
  },
  mysql: {
    // More images:  http://images.azk.io
    image: {"docker": "azukiapp/mysql"},
    shell: "/bin/bash",
    wait: {"retry": 25, "timeout": 1000},
    mounts: {
      '/var/lib/mysql': persistent("mysql_lib#{manifest.dir}"),
    },
    ports: {
      // exports global variables
      data: "3306/tcp",
    },
    envs: {
      // set instances variables
      MYSQL_USER         : "azk",
      MYSQL_PASS         : "azk",
      MYSQL_DATABASE     : "#{manifest.dir}_development",
    },
    export_envs: {
      // check this gist to configure your database
      // https://gist.github.com/gullitmiranda/62082f2e47c364ef9617
      DATABASE_URL: "mysql2://#{envs.MYSQL_USER}:#{envs.MYSQL_PASS}@#{net.host}:#{net.port.data}/${envs.MYSQL_DATABASE}",
    },
  },
});
