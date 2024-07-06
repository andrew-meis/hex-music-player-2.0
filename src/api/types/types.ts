import Prism from '@zwolf/prism';

const toBoolean = ($data: Prism<any>) => {
  const { value } = $data;
  if (value == null) {
    return undefined;
  }
  return value === 1 || value === '1' || value === 'true' || value === true;
};

const toNumber = ($data: Prism<any>) => {
  const { value } = $data;
  if (value == null) {
    return undefined;
  }
  return parseInt(value, 10);
};

const toFloat = ($data: Prism<any>) => {
  const { value } = $data;
  if (value == null) {
    return undefined;
  }
  return parseFloat(value);
};

const toTimestamp = ($data: Prism<any>) => {
  const { value } = $data;
  if (value == null) {
    return undefined;
  }
  return $data.transform(toNumber).value! * 1000;
};

const toDate = ($data: Prism<any>) => {
  const { value } = $data;
  if (value == null) {
    return undefined;
  }
  return new Date($data.value);
};

const toDateFromSeconds = ($data: Prism<any>) =>
  $data.transform(toTimestamp).transform(toDate).value;

export { toBoolean, toDate, toDateFromSeconds, toFloat, toNumber, toTimestamp };
