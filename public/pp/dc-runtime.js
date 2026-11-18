/* Public Pulse — tiny runtime that renders the design templates with Preact. */
(function () {
  var P = window.preact, h = P.h, Component = P.Component, Fragment = P.Fragment;

  var ROUTES = {
    Main: '/', Services: '/services/', Work: '/work/', Results: '/case-studies/', Election: '/election/',
    Insights: '/blog/', Studio: '/about/', Contact: '/contact/', Book: '/book/', Pricing: '/pricing/',
    Press: '/press/', Guides: '/guides/', Glossary: '/glossary/', Compare: '/compare/',
    Locations: '/locations/', Industries: '/industries/'
  };

  function mapHref(v) {
    if (typeof v !== 'string') return v;
    var m = v.match(/^\/?([A-Za-z0-9_-]+)\.dc\.html(#.*)?$/);
    if (!m) return v;
    return (ROUTES[m[1]] || '/') + (m[2] || '');
  }

  function lookup(path, scope) {
    path = path.trim();
    if (path === 'true') return true;
    if (path === 'false') return false;
    if (path === 'null') return null;
    if (path === 'undefined') return undefined;
    if (/^-?\d+(\.\d+)?$/.test(path)) return Number(path);
    var q = path.match(/^(['"])(.*)\1$/);
    if (q) return q[2];
    var cur = scope, parts = path.split('.');
    for (var i = 0; i < parts.length; i++) {
      if (cur == null) return undefined;
      cur = cur[parts[i]];
    }
    return cur;
  }

  var HOLE = /\{\{\s*([^}]+?)\s*\}\}/g;
  var WHOLE = /^\s*\{\{\s*([^}]+?)\s*\}\}\s*$/;

  function compileValue(raw) {
    var w = raw.match(WHOLE);
    if (w) { var p = w[1]; return function (s) { return lookup(p, s); }; }
    if (raw.indexOf('{{') < 0) return function () { return raw; };
    return function (s) {
      return raw.replace(HOLE, function (_, p) { var v = lookup(p, s); return v == null ? '' : String(v); });
    };
  }

  function camel(n) { return n.replace(/-([a-z])/g, function (_, c) { return c.toUpperCase(); }); }

  var REGISTRY = {};

  function compileChildren(nodes) {
    var out = [];
    for (var i = 0; i < nodes.length; i++) {
      var c = compileNode(nodes[i]);
      if (c) out.push(c);
    }
    return function (s) {
      var r = [];
      for (var j = 0; j < out.length; j++) r.push(out[j](s));
      return r;
    };
  }

  function compileNode(n) {
    if (n.nodeType === 3) {
      var t = n.nodeValue;
      if (t.indexOf('{{') < 0) return function () { return t; };
      var f = compileValue(t);
      return function (s) { return f(s); };
    }
    if (n.nodeType !== 1) return null;
    var tag = n.localName;
    if (tag === 'helmet') return null;
    var kids = compileChildren(n.tagName === 'TEMPLATE' ? n.content.childNodes : n.childNodes);

    if (tag === 'sc-for') {
      var list = compileValue(n.getAttribute('list') || ''), as = n.getAttribute('as') || 'item';
      return function (s) {
        var arr = list(s) || [];
        return arr.map(function (item, i) {
          var sc = Object.create(s); sc[as] = item; sc.$index = i;
          return kids(sc);
        });
      };
    }
    if (tag === 'sc-if') {
      var cond = compileValue(n.getAttribute('value') || '');
      return function (s) { return cond(s) ? kids(s) : null; };
    }
    if (tag === 'dc-import') {
      var name = n.getAttribute('name'), propsC = [];
      for (var a = 0; a < n.attributes.length; a++) {
        var at = n.attributes[a];
        if (at.name === 'name' || at.name.indexOf('hint-') === 0) continue;
        propsC.push([camel(at.name), compileValue(at.value)]);
      }
      return function (s) {
        var C = REGISTRY[name];
        if (!C) return null;
        var props = {};
        propsC.forEach(function (p) { props[p[0]] = p[1](s); });
        return h(C, props);
      };
    }

    var attrs = [];
    for (var k = 0; k < n.attributes.length; k++) {
      var att = n.attributes[k], an = att.name;
      if (an.indexOf('hint-') === 0) continue;
      if (an.indexOf('on') === 0 && an.length > 2) {
        if (an === 'onchange' && (tag === 'input' || tag === 'textarea')) an = 'oninput';
      }
      attrs.push([an, compileValue(att.value)]);
    }
    return function (s) {
      var props = {};
      for (var i = 0; i < attrs.length; i++) {
        var v = attrs[i][1](s), nm = attrs[i][0];
        if (nm === 'href') v = mapHref(v);
        props[nm] = v;
      }
      return h(tag, props, kids(s));
    };
  }

  function DCLogic(props) { Component.call(this, props); }
  DCLogic.prototype = Object.create(Component.prototype);
  DCLogic.prototype.constructor = DCLogic;
  DCLogic.prototype.render = function () {
    var vals = this.renderVals ? this.renderVals() : {};
    var scope = Object.assign(Object.create(null), vals || {});
    return h(Fragment, null, this.constructor.__tpl(scope));
  };

  window.__dcDefine = function (name, factory) {
    var tplEl = document.getElementById('tpl-' + name);
    var Cls = factory(DCLogic);
    Cls.__tpl = compileChildren(tplEl.content.childNodes);
    REGISTRY[name] = Cls;
  };

  window.__dcMount = function (name) {
    P.render(h(REGISTRY[name], {}), document.getElementById('app'));
    if (location.hash) {
      var id = decodeURIComponent(location.hash.slice(1)), tries = 0;
      var go = function () {
        var el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        else if (tries++ < 20) setTimeout(go, 100);
      };
      setTimeout(go, 350);
    }
  };
})();
