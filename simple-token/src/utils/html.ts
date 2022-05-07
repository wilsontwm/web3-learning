export function getFormInputs(elements: Array<any>): any {
  return [...elements].reduce((accum, currentVal) => {
    if (currentVal.name) accum[currentVal.name] = currentVal.value;
    return accum;
  }, {});
}

export function combineClassNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
