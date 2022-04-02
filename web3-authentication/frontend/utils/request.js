class Request {
  constructor(attrs) {
    this.body = attrs.body || {};
    this.success = typeof attrs.success === "function" ? attrs.success : () => {};
    this.error = attrs.error || (() => {});
    this.finally = attrs.finally || (() => {});
  }
}

export default Request;
