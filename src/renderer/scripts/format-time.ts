const formatTime = (inMs: number) => {
  if (inMs === undefined) {
    return '--:--';
  }
  if (Number.isNaN(inMs)) {
    return '--:--';
  }
  if (inMs < 0) {
    return '00:00';
  }
  let minutes: number | string = Math.floor(inMs / 60000);
  const secondsFull = (inMs - minutes * 60000) / 1000;
  let seconds: number | string = Math.floor(secondsFull);

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  if (seconds < 10) {
    seconds = `0${seconds}`;
  }
  return `${minutes}:${seconds}`;
};

export default formatTime;
