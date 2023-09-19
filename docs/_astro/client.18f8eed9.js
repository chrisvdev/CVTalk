const se = "modulepreload",
  ae = function (e) {
    return "/" + e;
  },
  z = {},
  ce = function (t, n, r) {
    if (!n || n.length === 0) return t();
    const l = document.getElementsByTagName("link");
    return Promise.all(
      n.map((o) => {
        if (((o = ae(o)), o in z)) return;
        z[o] = !0;
        const i = o.endsWith(".css"),
          p = i ? '[rel="stylesheet"]' : "";
        if (!!r)
          for (let c = l.length - 1; c >= 0; c--) {
            const _ = l[c];
            if (_.href === o && (!i || _.rel === "stylesheet")) return;
          }
        else if (document.querySelector(`link[href="${o}"]${p}`)) return;
        const d = document.createElement("link");
        if (
          ((d.rel = i ? "stylesheet" : se),
          i || ((d.as = "script"), (d.crossOrigin = "")),
          (d.href = o),
          document.head.appendChild(d),
          i)
        )
          return new Promise((c, _) => {
            d.addEventListener("load", c),
              d.addEventListener("error", () =>
                _(new Error(`Unable to preload CSS for ${o}`)),
              );
          });
      }),
    )
      .then(() => t())
      .catch((o) => {
        const i = new Event("vite:preloadError", { cancelable: !0 });
        if (((i.payload = o), window.dispatchEvent(i), !i.defaultPrevented))
          throw o;
      });
  };
var I,
  v,
  Y,
  fe,
  P,
  q,
  Z,
  $,
  T = {},
  ee = [],
  ue = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i,
  j = Array.isArray;
function x(e, t) {
  for (var n in t) e[n] = t[n];
  return e;
}
function te(e) {
  var t = e.parentNode;
  t && t.removeChild(e);
}
function E(e, t, n) {
  var r,
    l,
    o,
    i = {};
  for (o in t)
    o == "key" ? (r = t[o]) : o == "ref" ? (l = t[o]) : (i[o] = t[o]);
  if (
    (arguments.length > 2 &&
      (i.children = arguments.length > 3 ? I.call(arguments, 2) : n),
    typeof e == "function" && e.defaultProps != null)
  )
    for (o in e.defaultProps) i[o] === void 0 && (i[o] = e.defaultProps[o]);
  return M(e, i, r, l, null);
}
function M(e, t, n, r, l) {
  var o = {
    type: e,
    props: t,
    key: n,
    ref: r,
    __k: null,
    __: null,
    __b: 0,
    __e: null,
    __d: void 0,
    __c: null,
    __h: null,
    constructor: void 0,
    __v: l ?? ++Y,
  };
  return l == null && v.vnode != null && v.vnode(o), o;
}
function O(e) {
  return e.children;
}
function H(e, t) {
  (this.props = e), (this.context = t);
}
function D(e, t) {
  if (t == null) return e.__ ? D(e.__, e.__.__k.indexOf(e) + 1) : null;
  for (var n; t < e.__k.length; t++)
    if ((n = e.__k[t]) != null && n.__e != null) return n.__e;
  return typeof e.type == "function" ? D(e) : null;
}
function ne(e) {
  var t, n;
  if ((e = e.__) != null && e.__c != null) {
    for (e.__e = e.__c.base = null, t = 0; t < e.__k.length; t++)
      if ((n = e.__k[t]) != null && n.__e != null) {
        e.__e = e.__c.base = n.__e;
        break;
      }
    return ne(e);
  }
}
function G(e) {
  ((!e.__d && (e.__d = !0) && P.push(e) && !R.__r++) ||
    q !== v.debounceRendering) &&
    ((q = v.debounceRendering) || Z)(R);
}
function R() {
  var e, t, n, r, l, o, i, p, a;
  for (P.sort($); (e = P.shift()); )
    e.__d &&
      ((t = P.length),
      (r = void 0),
      (l = void 0),
      (o = void 0),
      (p = (i = (n = e).__v).__e),
      (a = n.__P) &&
        ((r = []),
        (l = []),
        ((o = x({}, i)).__v = i.__v + 1),
        F(
          a,
          i,
          o,
          n.__n,
          a.ownerSVGElement !== void 0,
          i.__h != null ? [p] : null,
          r,
          p ?? D(i),
          i.__h,
          l,
        ),
        le(r, i, l),
        i.__e != p && ne(i)),
      P.length > t && P.sort($));
  R.__r = 0;
}
function _e(e, t, n, r, l, o, i, p, a, d, c) {
  var _,
    m,
    f,
    s,
    u,
    C,
    h,
    y,
    S,
    k = 0,
    g = (r && r.__k) || ee,
    L = g.length,
    w = L,
    N = t.length;
  for (n.__k = [], _ = 0; _ < N; _++)
    (s = n.__k[_] =
      (s = t[_]) == null || typeof s == "boolean" || typeof s == "function"
        ? null
        : typeof s == "string" || typeof s == "number" || typeof s == "bigint"
        ? M(null, s, null, null, s)
        : j(s)
        ? M(O, { children: s }, null, null, null)
        : s.__b > 0
        ? M(s.type, s.props, s.key, s.ref ? s.ref : null, s.__v)
        : s) != null
      ? ((s.__ = n),
        (s.__b = n.__b + 1),
        (y = pe(s, g, (h = _ + k), w)) === -1
          ? (f = T)
          : ((f = g[y] || T), (g[y] = void 0), w--),
        F(e, s, f, l, o, i, p, a, d, c),
        (u = s.__e),
        (m = s.ref) &&
          f.ref != m &&
          (f.ref && V(f.ref, null, s), c.push(m, s.__c || u, s)),
        u != null &&
          (C == null && (C = u),
          (S = f === T || f.__v === null)
            ? y == -1 && k--
            : y !== h &&
              (y === h + 1
                ? k++
                : y > h
                ? w > N - h
                  ? (k += y - h)
                  : k--
                : (k = y < h && y == h - 1 ? y - h : 0)),
          (h = _ + k),
          typeof s.type != "function" || (y === h && f.__k !== s.__k)
            ? typeof s.type == "function" || (y === h && !S)
              ? s.__d !== void 0
                ? ((a = s.__d), (s.__d = void 0))
                : (a = u.nextSibling)
              : (a = re(e, u, a))
            : (a = oe(s, a, e)),
          typeof n.type == "function" && (n.__d = a)))
      : (f = g[_]) &&
        f.key == null &&
        f.__e &&
        (f.__e == a && (a = D(f)), B(f, f, !1), (g[_] = null));
  for (n.__e = C, _ = L; _--; )
    g[_] != null &&
      (typeof n.type == "function" &&
        g[_].__e != null &&
        g[_].__e == n.__d &&
        (n.__d = g[_].__e.nextSibling),
      B(g[_], g[_]));
}
function oe(e, t, n) {
  for (var r, l = e.__k, o = 0; l && o < l.length; o++)
    (r = l[o]) &&
      ((r.__ = e),
      (t = typeof r.type == "function" ? oe(r, t, n) : re(n, r.__e, t)));
  return t;
}
function re(e, t, n) {
  return (
    n == null || n.parentNode !== e
      ? e.insertBefore(t, null)
      : (t == n && t.parentNode != null) || e.insertBefore(t, n),
    t.nextSibling
  );
}
function pe(e, t, n, r) {
  var l = e.key,
    o = e.type,
    i = n - 1,
    p = n + 1,
    a = t[n];
  if (a === null || (a && l == a.key && o === a.type)) return n;
  if (r > (a != null ? 1 : 0))
    for (; i >= 0 || p < t.length; ) {
      if (i >= 0) {
        if ((a = t[i]) && l == a.key && o === a.type) return i;
        i--;
      }
      if (p < t.length) {
        if ((a = t[p]) && l == a.key && o === a.type) return p;
        p++;
      }
    }
  return -1;
}
function de(e, t, n, r, l) {
  var o;
  for (o in n)
    o === "children" || o === "key" || o in t || A(e, o, null, n[o], r);
  for (o in t)
    (l && typeof t[o] != "function") ||
      o === "children" ||
      o === "key" ||
      o === "value" ||
      o === "checked" ||
      n[o] === t[o] ||
      A(e, o, t[o], n[o], r);
}
function J(e, t, n) {
  t[0] === "-"
    ? e.setProperty(t, n ?? "")
    : (e[t] =
        n == null ? "" : typeof n != "number" || ue.test(t) ? n : n + "px");
}
function A(e, t, n, r, l) {
  var o;
  e: if (t === "style")
    if (typeof n == "string") e.style.cssText = n;
    else {
      if ((typeof r == "string" && (e.style.cssText = r = ""), r))
        for (t in r) (n && t in n) || J(e.style, t, "");
      if (n) for (t in n) (r && n[t] === r[t]) || J(e.style, t, n[t]);
    }
  else if (t[0] === "o" && t[1] === "n")
    (o = t !== (t = t.replace(/(PointerCapture)$|Capture$/, "$1"))),
      (t = t.toLowerCase() in e ? t.toLowerCase().slice(2) : t.slice(2)),
      e.l || (e.l = {}),
      (e.l[t + o] = n),
      n
        ? r || e.addEventListener(t, o ? Q : K, o)
        : e.removeEventListener(t, o ? Q : K, o);
  else if (t !== "dangerouslySetInnerHTML") {
    if (l) t = t.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
    else if (
      t !== "width" &&
      t !== "height" &&
      t !== "href" &&
      t !== "list" &&
      t !== "form" &&
      t !== "tabIndex" &&
      t !== "download" &&
      t !== "rowSpan" &&
      t !== "colSpan" &&
      t in e
    )
      try {
        e[t] = n ?? "";
        break e;
      } catch {}
    typeof n == "function" ||
      (n == null || (n === !1 && t[4] !== "-")
        ? e.removeAttribute(t)
        : e.setAttribute(t, n));
  }
}
function K(e) {
  return this.l[e.type + !1](v.event ? v.event(e) : e);
}
function Q(e) {
  return this.l[e.type + !0](v.event ? v.event(e) : e);
}
function F(e, t, n, r, l, o, i, p, a, d) {
  var c,
    _,
    m,
    f,
    s,
    u,
    C,
    h,
    y,
    S,
    k,
    g,
    L,
    w,
    N,
    b = t.type;
  if (t.constructor !== void 0) return null;
  n.__h != null &&
    ((a = n.__h), (p = t.__e = n.__e), (t.__h = null), (o = [p])),
    (c = v.__b) && c(t);
  e: if (typeof b == "function")
    try {
      if (
        ((h = t.props),
        (y = (c = b.contextType) && r[c.__c]),
        (S = c ? (y ? y.props.value : c.__) : r),
        n.__c
          ? (C = (_ = t.__c = n.__c).__ = _.__E)
          : ("prototype" in b && b.prototype.render
              ? (t.__c = _ = new b(h, S))
              : ((t.__c = _ = new H(h, S)),
                (_.constructor = b),
                (_.render = ve)),
            y && y.sub(_),
            (_.props = h),
            _.state || (_.state = {}),
            (_.context = S),
            (_.__n = r),
            (m = _.__d = !0),
            (_.__h = []),
            (_._sb = [])),
        _.__s == null && (_.__s = _.state),
        b.getDerivedStateFromProps != null &&
          (_.__s == _.state && (_.__s = x({}, _.__s)),
          x(_.__s, b.getDerivedStateFromProps(h, _.__s))),
        (f = _.props),
        (s = _.state),
        (_.__v = t),
        m)
      )
        b.getDerivedStateFromProps == null &&
          _.componentWillMount != null &&
          _.componentWillMount(),
          _.componentDidMount != null && _.__h.push(_.componentDidMount);
      else {
        if (
          (b.getDerivedStateFromProps == null &&
            h !== f &&
            _.componentWillReceiveProps != null &&
            _.componentWillReceiveProps(h, S),
          !_.__e &&
            ((_.shouldComponentUpdate != null &&
              _.shouldComponentUpdate(h, _.__s, S) === !1) ||
              t.__v === n.__v))
        ) {
          for (
            t.__v !== n.__v && ((_.props = h), (_.state = _.__s), (_.__d = !1)),
              t.__e = n.__e,
              t.__k = n.__k,
              t.__k.forEach(function (U) {
                U && (U.__ = t);
              }),
              k = 0;
            k < _._sb.length;
            k++
          )
            _.__h.push(_._sb[k]);
          (_._sb = []), _.__h.length && i.push(_);
          break e;
        }
        _.componentWillUpdate != null && _.componentWillUpdate(h, _.__s, S),
          _.componentDidUpdate != null &&
            _.__h.push(function () {
              _.componentDidUpdate(f, s, u);
            });
      }
      if (
        ((_.context = S),
        (_.props = h),
        (_.__P = e),
        (_.__e = !1),
        (g = v.__r),
        (L = 0),
        "prototype" in b && b.prototype.render)
      ) {
        for (
          _.state = _.__s,
            _.__d = !1,
            g && g(t),
            c = _.render(_.props, _.state, _.context),
            w = 0;
          w < _._sb.length;
          w++
        )
          _.__h.push(_._sb[w]);
        _._sb = [];
      } else
        do
          (_.__d = !1),
            g && g(t),
            (c = _.render(_.props, _.state, _.context)),
            (_.state = _.__s);
        while (_.__d && ++L < 25);
      (_.state = _.__s),
        _.getChildContext != null && (r = x(x({}, r), _.getChildContext())),
        m ||
          _.getSnapshotBeforeUpdate == null ||
          (u = _.getSnapshotBeforeUpdate(f, s)),
        _e(
          e,
          j(
            (N =
              c != null && c.type === O && c.key == null
                ? c.props.children
                : c),
          )
            ? N
            : [N],
          t,
          n,
          r,
          l,
          o,
          i,
          p,
          a,
          d,
        ),
        (_.base = t.__e),
        (t.__h = null),
        _.__h.length && i.push(_),
        C && (_.__E = _.__ = null);
    } catch (U) {
      (t.__v = null),
        (a || o != null) &&
          ((t.__e = p), (t.__h = !!a), (o[o.indexOf(p)] = null)),
        v.__e(U, t, n);
    }
  else
    o == null && t.__v === n.__v
      ? ((t.__k = n.__k), (t.__e = n.__e))
      : (t.__e = he(n.__e, t, n, r, l, o, i, a, d));
  (c = v.diffed) && c(t);
}
function le(e, t, n) {
  for (var r = 0; r < n.length; r++) V(n[r], n[++r], n[++r]);
  v.__c && v.__c(t, e),
    e.some(function (l) {
      try {
        (e = l.__h),
          (l.__h = []),
          e.some(function (o) {
            o.call(l);
          });
      } catch (o) {
        v.__e(o, l.__v);
      }
    });
}
function he(e, t, n, r, l, o, i, p, a) {
  var d,
    c,
    _,
    m = n.props,
    f = t.props,
    s = t.type,
    u = 0;
  if ((s === "svg" && (l = !0), o != null)) {
    for (; u < o.length; u++)
      if (
        (d = o[u]) &&
        "setAttribute" in d == !!s &&
        (s ? d.localName === s : d.nodeType === 3)
      ) {
        (e = d), (o[u] = null);
        break;
      }
  }
  if (e == null) {
    if (s === null) return document.createTextNode(f);
    (e = l
      ? document.createElementNS("http://www.w3.org/2000/svg", s)
      : document.createElement(s, f.is && f)),
      (o = null),
      (p = !1);
  }
  if (s === null) m === f || (p && e.data === f) || (e.data = f);
  else {
    if (
      ((o = o && I.call(e.childNodes)),
      (c = (m = n.props || T).dangerouslySetInnerHTML),
      (_ = f.dangerouslySetInnerHTML),
      !p)
    ) {
      if (o != null)
        for (m = {}, u = 0; u < e.attributes.length; u++)
          m[e.attributes[u].name] = e.attributes[u].value;
      (_ || c) &&
        ((_ && ((c && _.__html == c.__html) || _.__html === e.innerHTML)) ||
          (e.innerHTML = (_ && _.__html) || ""));
    }
    if ((de(e, f, m, l, p), _)) t.__k = [];
    else if (
      (_e(
        e,
        j((u = t.props.children)) ? u : [u],
        t,
        n,
        r,
        l && s !== "foreignObject",
        o,
        i,
        o ? o[0] : n.__k && D(n, 0),
        p,
        a,
      ),
      o != null)
    )
      for (u = o.length; u--; ) o[u] != null && te(o[u]);
    p ||
      ("value" in f &&
        (u = f.value) !== void 0 &&
        (u !== e.value ||
          (s === "progress" && !u) ||
          (s === "option" && u !== m.value)) &&
        A(e, "value", u, m.value, !1),
      "checked" in f &&
        (u = f.checked) !== void 0 &&
        u !== e.checked &&
        A(e, "checked", u, m.checked, !1));
  }
  return e;
}
function V(e, t, n) {
  try {
    typeof e == "function" ? e(t) : (e.current = t);
  } catch (r) {
    v.__e(r, n);
  }
}
function B(e, t, n) {
  var r, l;
  if (
    (v.unmount && v.unmount(e),
    (r = e.ref) && ((r.current && r.current !== e.__e) || V(r, null, t)),
    (r = e.__c) != null)
  ) {
    if (r.componentWillUnmount)
      try {
        r.componentWillUnmount();
      } catch (o) {
        v.__e(o, t);
      }
    (r.base = r.__P = null), (e.__c = void 0);
  }
  if ((r = e.__k))
    for (l = 0; l < r.length; l++)
      r[l] && B(r[l], t, n || typeof e.type != "function");
  n || e.__e == null || te(e.__e), (e.__ = e.__e = e.__d = void 0);
}
function ve(e, t, n) {
  return this.constructor(e, n);
}
function ye(e, t, n) {
  var r, l, o, i;
  v.__ && v.__(e, t),
    (l = (r = typeof n == "function") ? null : (n && n.__k) || t.__k),
    (o = []),
    (i = []),
    F(
      t,
      (e = ((!r && n) || t).__k = E(O, null, [e])),
      l || T,
      T,
      t.ownerSVGElement !== void 0,
      !r && n ? [n] : l ? null : t.firstChild ? I.call(t.childNodes) : null,
      o,
      !r && n ? n : l ? l.__e : t.firstChild,
      r,
      i,
    ),
    le(o, e, i);
}
(I = ee.slice),
  (v = {
    __e: function (e, t, n, r) {
      for (var l, o, i; (t = t.__); )
        if ((l = t.__c) && !l.__)
          try {
            if (
              ((o = l.constructor) &&
                o.getDerivedStateFromError != null &&
                (l.setState(o.getDerivedStateFromError(e)), (i = l.__d)),
              l.componentDidCatch != null &&
                (l.componentDidCatch(e, r || {}), (i = l.__d)),
              i)
            )
              return (l.__E = l);
          } catch (p) {
            e = p;
          }
      throw e;
    },
  }),
  (Y = 0),
  (fe = function (e) {
    return e != null && e.constructor === void 0;
  }),
  (H.prototype.setState = function (e, t) {
    var n;
    (n =
      this.__s != null && this.__s !== this.state
        ? this.__s
        : (this.__s = x({}, this.state))),
      typeof e == "function" && (e = e(x({}, n), this.props)),
      e && x(n, e),
      e != null && this.__v && (t && this._sb.push(t), G(this));
  }),
  (H.prototype.forceUpdate = function (e) {
    this.__v && ((this.__e = !0), e && this.__h.push(e), G(this));
  }),
  (H.prototype.render = O),
  (P = []),
  (Z =
    typeof Promise == "function"
      ? Promise.prototype.then.bind(Promise.resolve())
      : setTimeout),
  ($ = function (e, t) {
    return e.__v.__b - t.__v.__b;
  }),
  (R.__r = 0);
const ie = ({ value: e, name: t, hydrate: n = !0 }) =>
  e
    ? E(n ? "astro-slot" : "astro-static-slot", {
        name: t,
        dangerouslySetInnerHTML: { __html: e },
      })
    : null;
ie.shouldComponentUpdate = () => !1;
var X = ie;
const W = new Map();
var me =
  (e) =>
  async (t, n, { default: r, ...l }) => {
    if (!e.hasAttribute("ssr")) return;
    for (const [a, d] of Object.entries(l)) n[a] = E(X, { value: d, name: a });
    if (e.dataset.preactSignals) {
      const { signal: a } = await ce(
        () => import("./signals.module.a41360f3.js"),
        [],
      );
      let d = JSON.parse(e.dataset.preactSignals);
      for (const [c, _] of Object.entries(d)) {
        if (!W.has(_)) {
          const m = a(n[c]);
          W.set(_, m);
        }
        n[c] = W.get(_);
      }
    }
    function i({ children: a }) {
      let d = Object.fromEntries(
        Array.from(e.attributes).map((c) => [c.name, c.value]),
      );
      return E(e.localName, d, a);
    }
    let p = e.parentNode;
    ye(E(i, null, E(t, n, r != null ? E(X, { value: r }) : r)), p, e);
  };
export { H as b, me as c, v as l, fe as t };
