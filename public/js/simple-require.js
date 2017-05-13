(function () {
  if (typeof require === 'undefined' && typeof window !== 'undefined') {
    
    var modules = {};
    window.require = baseRequire();
    
    function resolve(basePath, path) {
      if (path.substr(-3) !== '.js') {
        path = path + '.js';
      }
      var pathSegments;
      if (path[0] === '/') {
        pathSegments = ['']; // '/'.split().pop()
      }
      else {
        pathSegments = basePath.split('/');
        pathSegments.pop();
      }
      var segment;
      var segments = path.split('/');
      for (var i = 0; i < segments.length; i++) {
        segment = segments[i];
        if (segment === '..') {
          pathSegments.pop();
        }
        else if (segment !== '' && segment !== '.') {
          pathSegments.push(segment);
        }
      }
      return pathSegments.join('/');
    }
    
    function loadFile(path) {
      var request = new XMLHttpRequest();
      request.open('GET', path, false);  // `false` makes the request synchronous
      request.send(null);

      if (request.status === 200) {
        return request.responseText;
      }
      else {
        throw new Error('cannot load file');
      }
    }
    
    function loadScript(path) {
      var script = document.createElement("script")
      script.type = "text/javascript";
      script.src = path;
      document.getElementsByTagName("head")[0].appendChild(script);
    }
    
    function loadModule(origin, path, module) {
      var code = loadFile(path);
      // adds the code to the source view of chrome dev tools
      code = code + '//# sourceURL=' + origin + path;
      var fn;
      try {
        fn = new Function('require', 'module', 'exports', code);
      }
      catch (e) {
        if (e instanceof SyntaxError) {
          // there is a syntax error in the file
          // load the file as a script so the browser should display the location of the syntax error
          loadScript(path);
          return;
        }
        else {
          throw e;
        }
      }
      fn.displayName = path; // sets a friendly name for the call stack
      var exports = module.exports = {};
      var moduleRequire = baseRequire(origin, path);
      fn(moduleRequire, module, exports);
      module.path = path;
    }

    function getPathInfo() {
      var currentScript = document.currentScript || (function() {
        var scripts = document.getElementsByTagName('script');
        return scripts[scripts.length - 1];
      })();
      var location;
      var baseUrl = currentScript.attributes.getNamedItem('src');
      if (baseUrl !== null) {
        location = baseUrl.value;
      } else {
        location = window.location.href;
      }
      var a = document.createElement('a');
      a.href = location;
      var origin = a.origin;
      var pathName = a.pathname;
      var basePath = pathName.substring(0, pathName.lastIndexOf('/') + 1);
      return {
        origin: origin,
        basePath: basePath
      };
    }

    function baseRequire(origin, basePath) {
      function require(path) {
        if (require.basePath == null) {
          var pathInfo = getPathInfo();
          require.origin = pathInfo.origin;
          require.basePath = pathInfo.basePath;
        }
        var modulePath = resolve(require.basePath, path);
        var module;
        if (modulePath in modules) {
          module = modules[modulePath];
        }
        else {
          // this fixes cyclic modules
          module = modules[modulePath] = {};
          loadModule(require.origin, modulePath, module);
        }
        return module.exports;
      }
      require.origin = origin;
      require.basePath = basePath;
      return require;
    }
  }
}());