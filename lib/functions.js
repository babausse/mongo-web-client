function parse_values(obj) {
  if (['Cursor', 'AggregationCursor'].includes(obj.constructor.name)) {
    return obj.toArray();
  }
  else if (obj instanceof Array) {
    return obj.map(i => parse_values(i));
  }
  else if (obj instanceof Object) {
    return Object.fromEntries(Object.entries(obj).map(e => [e[0], parse_values(e[1])]))
  }
  else {
    return obj;
  }
}

function print_value(value) {
  if (value === undefined) {
    print(JSON.stringify({error: "no return statement"}))
  }
  if (value.constructor.name === 'Cursor') {
    if (value.size() > 100) value = value.limit(100);
    print(JSON.stringify(value.toArray()));
  }
  else if (value.constructor.name === 'AggregationCursor') {
    let results = value.toArray();
    if (results.length > 100) results = results.slice(0, 100);
    print(JSON.stringify(results));
  }
  else if (value instanceof Object) {
    print(JSON.stringify(parse_values(value)));
  }
  else {
    print(value);
  }
}